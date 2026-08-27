/**
 * POST /api/compare
 *
 * Accepts: { urls: string[] }  (between 2 and 4 URLs)
 * Returns: ApiResponse<CompareResult>  (Side-by-side analysis for the Compare page)
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/analyzer";
import { validateUrl } from "@/lib/validator";
import { checkRateLimit } from "@/lib/rateLimit";
import { addHistoryEntry } from "@/lib/history";
import type { ApiResponse, CompareResult, AnalysisResult } from "@/types";

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function errorResponse(
  message: string,
  status: number,
  code?: string
): NextResponse<ApiResponse<CompareResult>> {
  return NextResponse.json<ApiResponse<CompareResult>>(
    { success: false, error: message, code },
    { status }
  );
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<CompareResult>>> {
  // 1. Rate limiting
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);

  if (!rateCheck.allowed) {
    const retryAfterSec = Math.ceil(rateCheck.retryAfterMs / 1000);
    return NextResponse.json<ApiResponse<CompareResult>>(
      {
        success: false,
        error: `Too many requests. Please wait ${retryAfterSec} second(s) before trying again.`,
        code: "RATE_LIMITED",
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    );
  }

  // 2. Parse request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Request body must be valid JSON.", 400, "INVALID_JSON");
  }

  if (typeof body !== "object" || body === null) {
    return errorResponse("Request body must be a JSON object.", 400, "INVALID_BODY");
  }

  const { urls } = body as Record<string, unknown>;

  if (!Array.isArray(urls) || urls.length < 2 || urls.length > 4) {
    return errorResponse("Provide between 2 and 4 valid URLs to compare.", 400, "INVALID_URLS_COUNT");
  }

  // 3. Validate and sanitize each URL
  const validatedUrls: string[] = [];
  for (let i = 0; i < urls.length; i++) {
    const raw = urls[i];
    const validation = validateUrl(raw);
    if (!validation.valid) {
      return errorResponse(`URL #${i + 1} ("${raw}") is invalid: ${validation.error}`, 400, validation.code);
    }
    validatedUrls.push(validation.url);
  }

  // 4. Run multi-site analysis concurrently
  try {
    const results: AnalysisResult[] = await Promise.all(
      validatedUrls.map(async (url) => {
        const res = await analyzeWebsite(url);
        addHistoryEntry(res);
        return res;
      })
    );

    // 5. Compute comparative summary
    let bestOverall = results[0].normalizedUrl;
    let highestScore = results[0].overallHealthScore;

    let fastestTTFB = results[0].normalizedUrl;
    let lowestTTFB = results[0].metrics.ttfbMs;

    let smallestPayload = results[0].normalizedUrl;
    let lowestSize = results[0].metrics.pageSizeKb;

    const scoresDiff: Record<string, number> = {};

    results.forEach((r) => {
      scoresDiff[r.normalizedUrl] = r.overallHealthScore;

      if (r.overallHealthScore > highestScore) {
        highestScore = r.overallHealthScore;
        bestOverall = r.normalizedUrl;
      }
      if (r.metrics.ttfbMs < lowestTTFB) {
        lowestTTFB = r.metrics.ttfbMs;
        fastestTTFB = r.normalizedUrl;
      }
      if (r.metrics.pageSizeKb < lowestSize) {
        lowestSize = r.metrics.pageSizeKb;
        smallestPayload = r.normalizedUrl;
      }
    });

    const compareData: CompareResult = {
      sites: results,
      summary: {
        bestOverall,
        fastestTTFB,
        smallestPayload,
        scoresDiff,
      },
    };

    return NextResponse.json<ApiResponse<CompareResult>>({
      success: true,
      data: compareData,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Comparison analysis failed.";
    console.error("[compare] Multi-analysis failed:", message);
    return errorResponse(message, 500, "COMPARE_FAILED");
  }
}
