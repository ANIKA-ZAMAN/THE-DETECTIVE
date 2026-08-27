/**
 * Centralized backend configuration.
 * All tuneable values and environment variable reads live here —
 * nowhere else in the codebase should reference process.env directly.
 */

export const config = {
  /** Maximum time (ms) we wait for the target URL to respond */
  fetchTimeoutMs: Number(process.env.FETCH_TIMEOUT_MS) || 8000,

  /** Maximum HTML body size we'll read (bytes) — prevents memory exhaustion */
  maxBodyBytes: Number(process.env.MAX_BODY_BYTES) || 3 * 1024 * 1024, // 3 MB

  /** How many requests one IP can make per window */
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 10,

  /** Rate-limit sliding window duration (ms) */
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000, // 1 minute

  /** URL protocols we will actually fetch */
  allowedProtocols: ["http:", "https:"] as string[],

  /**
   * Hostnames / IP ranges blocked to prevent Server-Side Request Forgery (SSRF).
   * The check also blocks numeric private-range IPs via the `isPrivateHost` helper.
   */
  blockedHostnames: [
    "localhost",
    "127.0.0.1",
    "::1",
    "0.0.0.0",
    "metadata.google.internal", // GCP metadata service
    "169.254.169.254",           // AWS/Azure IMDS
  ] as string[],

  /** Node environment */
  isDev: process.env.NODE_ENV === "development",
} as const;
