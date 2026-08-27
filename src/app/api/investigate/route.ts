/**
 * POST /api/investigate
 *
 * Accepts: { url: string }
 * Returns: ApiSuccessResponse | ApiErrorResponse  (see @/types)
 *
 * Pipeline:
 *  1. Rate-limit check (per IP)
 *  2. Body parsing
 *  3. URL validation & SSRF protection
 *  4. Analysis engine call
 *  5. Typed JSON response
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeWebsite } from "@/lib/analyzer";
import { validateUrl } from "@/lib/validator";
import { checkRateLimit } from "@/lib/rateLimit";
import { addHistoryEntry } from "@/lib/history";
import type { ApiResponse } from "@/types";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Extract the best available IP for rate-limiting purposes */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Build a typed error response */
function errorResponse(
  message: string,
  status: number,
  code?: string
): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>(
    { success: false, error: message, code },
    { status }
  );
}

// ─────────────────────────────────────────────
// Route Handler
// ─────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  // 1. Rate limiting
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);

  if (!rateCheck.allowed) {
    const retryAfterSec = Math.ceil(rateCheck.retryAfterMs / 1000);
    return NextResponse.json<ApiResponse>(
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

  const { url } = body as Record<string, unknown>;

  // 3. Validate and sanitize URL
  const validation = validateUrl(url);
  if (!validation.valid) {
    return errorResponse(validation.error, 400, validation.code);
  }

  // 4. Run analysis engine
  try {
    const result = await analyzeWebsite(validation.url);
    // Record scan in history
    addHistoryEntry(result);
    return NextResponse.json<ApiResponse>({ success: true, data: result });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred during analysis.";
    console.error("[investigate] Analysis failed:", message);
    return errorResponse(message, 500, "ANALYSIS_FAILED");
  }
}

// Reject all other HTTP methods cleanly
export function GET(): NextResponse<ApiResponse> {
  return errorResponse("Method not allowed. Use POST.", 405, "METHOD_NOT_ALLOWED");
}
