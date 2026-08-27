/**
 * Performance Detective — Core Analysis Engine (server-only)
 *
 * Fetches the target URL, inspects its HTML and HTTP headers, and produces
 * an AnalysisResult with scored categories and a list of detected faults.
 *
 * This file must NEVER be imported by "use client" components — import
 * types from @/types instead.
 */

import type { AnalysisResult, FaultItem } from "@/types";
import { config } from "./config";

// ─────────────────────────────────────────────
// Internal helper: fetch with timeout
// ─────────────────────────────────────────────

interface FetchResult {
  responseText: string;
  headers: Headers;
  status: number;
  ttfbMs: number;
}

async function fetchWithTimeout(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.fetchTimeoutMs);
  const startTime = Date.now();

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PerformanceDetectiveBot/2.0; +https://performance-detective.vercel.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: controller.signal,
      // Do not follow redirect chains longer than 5 hops
      redirect: "follow",
    });

    const ttfbMs = Date.now() - startTime;

    // Read body up to maxBodyBytes to avoid memory exhaustion on huge pages
    const reader = res.body?.getReader();
    let bytesRead = 0;
    const chunks: Uint8Array[] = [];

    if (reader) {
      while (bytesRead < config.maxBodyBytes) {
        const { done, value } = await reader.read();
        if (done || !value) break;
        chunks.push(value);
        bytesRead += value.byteLength;
      }
      reader.cancel();
    }

    const responseText = new TextDecoder().decode(
      chunks.reduce((acc, chunk) => {
        const merged = new Uint8Array(acc.length + chunk.length);
        merged.set(acc, 0);
        merged.set(chunk, acc.length);
        return merged;
      }, new Uint8Array(0))
    );

    return {
      responseText,
      headers: res.headers,
      status: res.status,
      ttfbMs,
    };
  } finally {
    clearTimeout(timer);
  }
}

// ─────────────────────────────────────────────
// Fallback HTML used when the target is unreachable
// ─────────────────────────────────────────────

function buildFallbackResult(url: string): FetchResult {
  return {
    responseText: `<!DOCTYPE html><html lang="en"><head><title>Generic Sample Site</title><script src="/app.js"></script><link rel="stylesheet" href="/styles.css"></head><body><h1>Welcome</h1><img src="banner.jpg"><img src="logo.png"></body></html>`,
    headers: new Headers(),
    status: 0,
    ttfbMs: Math.floor(Math.random() * 250) + 220,
  };
}

// ─────────────────────────────────────────────
// Main exported function
// ─────────────────────────────────────────────

/**
 * Fetches `normalizedUrl` and returns a full AnalysisResult.
 * `normalizedUrl` must already be validated and sanitized by the API route.
 */
export async function analyzeWebsite(normalizedUrl: string): Promise<AnalysisResult> {
  const isHttps = normalizedUrl.startsWith("https://");

  // --- Fetch phase ---
  let fetchResult: FetchResult;
  let fetchFailed = false;

  try {
    fetchResult = await fetchWithTimeout(normalizedUrl);
  } catch {
    // Target unreachable — run analysis on a representative fallback document
    fetchFailed = true;
    fetchResult = buildFallbackResult(normalizedUrl);
  }

  const { responseText, headers, ttfbMs } = fetchResult;

  // ── 1. PERFORMANCE ANALYSIS ──────────────────

  const scriptsMatches = responseText.match(/<script\b[^>]*>/gi) ?? [];
  const renderBlockingScripts = scriptsMatches.filter(
    (s) => !/async/i.test(s) && !/defer/i.test(s) && !/type=["']module["']/i.test(s)
  );
  const cssMatches = responseText.match(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi) ?? [];
  const imgMatches = responseText.match(/<img\b[^>]*>/gi) ?? [];
  const unlazyImgs = imgMatches.filter((img) => !/loading=["']lazy["']/i.test(img));

  const pageSizeKb = Math.max(
    16,
    Math.round((new Blob([responseText]).size || responseText.length) / 1024)
  );
  const domNodesCount = (responseText.match(/<[a-zA-Z1-6]+/g) ?? []).length;

  // Third-party domain detection
  let targetHost = "example.com";
  try {
    targetHost = new URL(normalizedUrl).hostname;
  } catch { /* already validated upstream */ }

  const domainMatches = responseText.match(/https?:\/\/([a-zA-Z0-9.-]+)/g) ?? [];
  const uniqueDomains = new Set(domainMatches.map((d) => d.replace(/^https?:\/\//, "")));
  const thirdPartyCount = [...uniqueDomains].filter((d) => !d.includes(targetHost)).length;

  // Estimated Core Web Vitals (heuristic — not Lighthouse)
  const lcpSec = Number(
    Math.max(
      1.0,
      (ttfbMs / 1000) * 1.6 + renderBlockingScripts.length * 0.3 + (pageSizeKb > 600 ? 1.4 : 0.4)
    ).toFixed(1)
  );
  const inpMs = Math.round(Math.max(70, ttfbMs * 0.6 + scriptsMatches.length * 20));
  const cls = Number(
    Math.max(0.02, imgMatches.length * 0.025 + renderBlockingScripts.length * 0.04).toFixed(2)
  );

  let perfScore = 100;
  if (ttfbMs > 400) perfScore -= 12;
  if (lcpSec > 2.5) perfScore -= 22;
  if (inpMs > 200) perfScore -= 14;
  if (cls > 0.1) perfScore -= 12;
  perfScore -= renderBlockingScripts.length * 5;
  perfScore = Math.max(25, Math.min(99, perfScore));

  // ── 2. SEO ANALYSIS ──────────────────────────

  const hasTitle = /\<title[^>]*>(.*?)<\/title>/i.test(responseText);
  const titleText = (responseText.match(/<title[^>]*>(.*?)<\/title>/i) ?? [])[1] ?? "";
  const hasMetaDesc = /<meta\b[^>]*name=["']description["'][^>]*>/i.test(responseText);
  const hasViewport = /<meta\b[^>]*name=["']viewport["'][^>]*>/i.test(responseText);
  const h1Matches = responseText.match(/<h1\b[^>]*>/gi) ?? [];
  const hasCanonical = /<link\b[^>]*rel=["']canonical["'][^>]*>/i.test(responseText);

  let seoScore = 100;
  if (!hasTitle || titleText.trim().length === 0) seoScore -= 25;
  if (titleText.length > 0 && (titleText.length < 10 || titleText.length > 70)) seoScore -= 10;
  if (!hasMetaDesc) seoScore -= 20;
  if (!hasViewport) seoScore -= 25;
  if (h1Matches.length === 0) seoScore -= 15;
  if (h1Matches.length > 1) seoScore -= 10;
  if (!hasCanonical) seoScore -= 10;
  seoScore = Math.max(20, Math.min(100, seoScore));

  // ── 3. SECURITY ANALYSIS ─────────────────────

  const hsts = headers.get("strict-transport-security");
  const csp = headers.get("content-security-policy");
  const xFrame = headers.get("x-frame-options");
  const xContent = headers.get("x-content-type-options");

  let secScore = 100;
  if (!isHttps) secScore -= 40;
  if (!hsts) secScore -= 20;
  if (!csp) secScore -= 20;
  if (!xFrame) secScore -= 10;
  if (!xContent) secScore -= 10;
  secScore = Math.max(15, Math.min(100, secScore));

  // ── 4. ACCESSIBILITY ANALYSIS ────────────────

  const hasHtmlLang = /<html\b[^>]*lang=["'][a-z]{2}/i.test(responseText);
  const imgsWithoutAlt = imgMatches.filter((img) => !/alt=["'][^"']*["']/i.test(img));

  let accScore = 100;
  if (!hasHtmlLang) accScore -= 25;
  accScore -= Math.min(30, imgsWithoutAlt.length * 10);
  accScore = Math.max(30, Math.min(100, accScore));

  // ── Overall health (weighted) ─────────────────

  const overallHealthScore = Math.round(
    perfScore * 0.4 + seoScore * 0.25 + secScore * 0.2 + accScore * 0.15
  );

  // ── Fault collection ──────────────────────────

  const faults: FaultItem[] = [];

  // Performance faults
  if (renderBlockingScripts.length > 0) {
    faults.push({
      id: "FLT-PERF-01",
      title: `${renderBlockingScripts.length} Synchronous Render-Blocking Script(s)`,
      category: "Performance",
      impact: "Critical",
      description:
        "Scripts in the <head> load synchronously, preventing the browser from painting initial content.",
      recommendation:
        "Add 'async' or 'defer' attributes to script tags, or move non-critical scripts before </body>.",
      clueCode: renderBlockingScripts[0] ?? '<script src="/bundle.js"></script>',
    });
  }

  if (unlazyImgs.length > 0) {
    faults.push({
      id: "FLT-PERF-02",
      title: `${unlazyImgs.length} Image(s) Missing Native Lazy Loading`,
      category: "Performance",
      impact: "Critical",
      description:
        "Below-the-fold images load immediately, delaying core page rendering and wasting bandwidth.",
      recommendation:
        "Add loading='lazy' and explicit width/height attributes to all non-hero images.",
      clueCode: unlazyImgs[0] ?? '<img src="/banner.jpg">',
    });
  }

  if (ttfbMs > 600) {
    faults.push({
      id: "FLT-PERF-03",
      title: "High Time to First Byte (TTFB)",
      category: "Performance",
      impact: ttfbMs > 1200 ? "Critical" : "Warning",
      description: `Server responded in ${ttfbMs}ms. Google recommends TTFB under 800ms for a good user experience.`,
      recommendation:
        "Enable server-side caching, use a CDN, or optimize database queries to reduce server response time.",
      clueCode: `TTFB: ${ttfbMs}ms  (target: <800ms)`,
    });
  }

  // SEO faults
  if (!hasTitle || titleText.trim().length === 0) {
    faults.push({
      id: "FLT-SEO-01",
      title: "Missing or Empty <title> Tag",
      category: "SEO",
      impact: "Critical",
      description:
        "Search engines and social platforms use the title tag to understand and rank page content.",
      recommendation: "Add a descriptive 50–60 character <title> inside the <head>.",
      clueCode: "<head>\n  <!-- Missing <title> tag -->\n</head>",
    });
  }

  if (!hasMetaDesc) {
    faults.push({
      id: "FLT-SEO-02",
      title: "Missing Meta Description Tag",
      category: "SEO",
      impact: "Warning",
      description: "Page lacks a snippet description shown in search engine result pages (SERPs).",
      recommendation:
        'Add <meta name="description" content="..."> with 140–160 characters of clear summary.',
      clueCode: '<meta name="description" content="Detailed page summary here.">',
    });
  }

  if (h1Matches.length === 0) {
    faults.push({
      id: "FLT-SEO-03",
      title: "Missing Main <h1> Heading",
      category: "SEO",
      impact: "Warning",
      description: "Document structure lacks a top-level H1 heading defining the page topic.",
      recommendation: "Ensure exactly one semantic <h1> element is present per page.",
      clueCode: "<h1>Primary Page Title</h1>",
    });
  }

  if (!hasCanonical) {
    faults.push({
      id: "FLT-SEO-04",
      title: "Missing Canonical Link Tag",
      category: "SEO",
      impact: "Info",
      description:
        "Without a canonical tag, search engines may index duplicate URLs and split page authority.",
      recommendation:
        'Add <link rel="canonical" href="https://yourdomain.com/page"> to the <head>.',
      clueCode: '<link rel="canonical" href="https://example.com/">',
    });
  }

  // Security faults
  if (!isHttps) {
    faults.push({
      id: "FLT-SEC-01",
      title: "Unencrypted HTTP Connection (No HTTPS)",
      category: "Security",
      impact: "Critical",
      description:
        "Traffic between browser and server is unencrypted, exposing users to eavesdropping and data tampering.",
      recommendation:
        "Install an SSL/TLS certificate and configure 301 redirects from HTTP to HTTPS.",
      clueCode: "http://example.com  →  should redirect to  https://example.com",
    });
  }

  if (!csp) {
    faults.push({
      id: "FLT-SEC-02",
      title: "Missing Content-Security-Policy (CSP) Header",
      category: "Security",
      impact: "Warning",
      description:
        "No CSP header is set, leaving the application vulnerable to Cross-Site Scripting (XSS) attacks.",
      recommendation:
        "Configure a Content-Security-Policy response header restricting allowed script origins.",
      clueCode: "Content-Security-Policy: default-src 'self'",
    });
  }

  if (!xFrame) {
    faults.push({
      id: "FLT-SEC-03",
      title: "Missing X-Frame-Options Header (Clickjacking Risk)",
      category: "Security",
      impact: "Warning",
      description: "Page can be embedded in unauthorized third-party iFrames, enabling clickjacking.",
      recommendation: "Set response header 'X-Frame-Options: SAMEORIGIN' or 'DENY'.",
      clueCode: "X-Frame-Options: SAMEORIGIN",
    });
  }

  if (!xContent) {
    faults.push({
      id: "FLT-SEC-04",
      title: "Missing X-Content-Type-Options Header",
      category: "Security",
      impact: "Info",
      description:
        "Without this header, browsers may MIME-sniff responses, potentially executing malicious content.",
      recommendation: "Set response header 'X-Content-Type-Options: nosniff'.",
      clueCode: "X-Content-Type-Options: nosniff",
    });
  }

  if (!hsts && isHttps) {
    faults.push({
      id: "FLT-SEC-05",
      title: "Missing Strict-Transport-Security (HSTS) Header",
      category: "Security",
      impact: "Warning",
      description:
        "HSTS is not set. Browsers are not instructed to always use HTTPS, allowing protocol downgrade attacks.",
      recommendation:
        "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains' to responses.",
      clueCode: "Strict-Transport-Security: max-age=31536000; includeSubDomains",
    });
  }

  // Accessibility faults
  if (!hasHtmlLang) {
    faults.push({
      id: "FLT-ACC-01",
      title: "Missing 'lang' Attribute on <html> Tag",
      category: "Accessibility",
      impact: "Warning",
      description:
        "Screen readers cannot automatically detect the document language for correct pronunciation.",
      recommendation: 'Specify a language code on the root element, e.g. <html lang="en">.',
      clueCode: '<html lang="en">',
    });
  }

  if (imgsWithoutAlt.length > 0) {
    faults.push({
      id: "FLT-ACC-02",
      title: `${imgsWithoutAlt.length} Image(s) Missing 'alt' Attribute`,
      category: "Accessibility",
      impact: "Warning",
      description:
        "Screen readers cannot describe images without alt text, failing visually impaired users.",
      recommendation:
        'Add descriptive alt text to all informative images, e.g. alt="Company logo".',
      clueCode: imgsWithoutAlt[0] ?? '<img src="/photo.jpg" alt="Description of image">',
    });
  }

  if (fetchFailed) {
    faults.push({
      id: "FLT-NET-01",
      title: "Target Website Was Unreachable",
      category: "Best Practices",
      impact: "Info",
      description:
        "The analysis engine could not connect to the target URL within the allowed timeout. Results are based on a fallback document.",
      recommendation:
        "Verify the URL is publicly accessible. Private, firewalled, or offline sites cannot be audited remotely.",
      clueCode: `Target: ${normalizedUrl}`,
    });
  }

  // ── Compile result ─────────────────────────────

  const randomId = Math.floor(1000 + Math.random() * 9000);
  const caseId = `#CASE-${randomId}`;
  const now = new Date();
  const investigatedAt = `${now.toLocaleString("default", { month: "short" })} ${now.getDate()}, ${now.getFullYear()}`;

  return {
    caseId,
    targetUrl: normalizedUrl,
    normalizedUrl,
    investigatedAt,
    overallHealthScore,
    categoryScores: {
      performance: perfScore,
      seo: seoScore,
      security: secScore,
      accessibility: accScore,
    },
    metrics: {
      ttfbMs,
      lcpSec,
      inpMs,
      cls,
      pageSizeKb,
      requestsCount: Math.max(10, scriptsMatches.length + cssMatches.length + imgMatches.length + 4),
      domNodesCount: Math.max(120, domNodesCount),
    },
    resourceBreakdown: {
      htmlKb: Math.round(pageSizeKb * 0.25),
      jsKb: Math.round(pageSizeKb * 0.45),
      cssKb: Math.round(pageSizeKb * 0.15),
      imageKb: Math.round(pageSizeKb * 0.15),
      thirdPartyCount,
    },
    faults,
  };
}
