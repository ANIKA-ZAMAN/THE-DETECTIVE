/**
 * Centralized backend configuration.
 * All process.env reads live here — nowhere else in the codebase
 * should reference process.env directly.
 */

export const config = {
  // ── Target fetch ───────────────────────────────────────────────
  /** Maximum time (ms) to wait for the target URL HTML fetch */
  fetchTimeoutMs: Number(process.env.FETCH_TIMEOUT_MS) || 10_000,

  /** Maximum HTML response body to read (bytes) — prevents memory exhaustion */
  maxBodyBytes: Number(process.env.MAX_BODY_BYTES) || 3 * 1024 * 1024, // 3 MB

  // ── Google PageSpeed Insights API ─────────────────────────────
  /**
   * Optional Google API key for PageSpeed Insights.
   * Without a key: 25 req/day. With a free key: 25,000 req/day.
   * Get one at: https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com
   */
  psiApiKey: process.env.PAGESPEED_API_KEY ?? "",

  /**
   * Device strategy for Lighthouse analysis.
   * "desktop" or "mobile". Defaults to desktop.
   */
  psiStrategy: (process.env.PSI_STRATEGY ?? "desktop") as "desktop" | "mobile",

  /**
   * Maximum time (ms) to wait for the PSI API to respond.
   * Lighthouse needs 10–20 s to run remotely — keep this generous.
   */
  psiTimeoutMs: Number(process.env.PSI_TIMEOUT_MS) || 25_000,

  // ── Rate limiting ──────────────────────────────────────────────
  /** Max requests per IP per window (default 30/min, configurable via RATE_LIMIT_MAX) */
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 30,

  /** Rate-limit sliding window (ms) */
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,

  // ── SSRF protection ────────────────────────────────────────────
  allowedProtocols: ["http:", "https:"] as string[],

  blockedHostnames: [
    "localhost",
    "127.0.0.1",
    "::1",
    "0.0.0.0",
    "metadata.google.internal",
    "169.254.169.254", // AWS/Azure IMDS
  ] as string[],

  isDev: process.env.NODE_ENV === "development",
} as const;
