/**
 * Simple in-memory rate limiter.
 *
 * Uses a module-level Map so state persists across requests in the same
 * Next.js server process (warm lambdas / long-running dev server).
 *
 * This is intentionally lightweight — no Redis, no external package.
 * For production at scale, swap the Map for a Redis INCR + EXPIRE call.
 */

import { config } from "./config";

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// Module-level store — lives as long as the server process lives.
const store = new Map<string, RateLimitEntry>();

/**
 * Checks whether the given key (typically an IP address) has exceeded
 * the configured request limit for the current time window.
 *
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`.
 */
export function checkRateLimit(key: string): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= config.rateLimitWindowMs) {
    // New window — reset counter
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count >= config.rateLimitMax) {
    const retryAfterMs = config.rateLimitWindowMs - (now - entry.windowStart);
    return { allowed: false, retryAfterMs };
  }

  entry.count += 1;
  return { allowed: true };
}

/**
 * Periodically prune expired entries so the Map doesn't grow unbounded.
 * Called once when the module loads; cleans up every 5 minutes.
 */
function scheduleCleanup() {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now - entry.windowStart >= config.rateLimitWindowMs) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

// Only run in a Node.js environment (not during Next.js static analysis)
if (typeof setInterval !== "undefined") {
  scheduleCleanup();
}
