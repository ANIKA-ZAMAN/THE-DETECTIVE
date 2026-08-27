/**
 * URL validation and sanitization layer.
 *
 * Responsibilities:
 *  - Normalize bare hostnames into full URLs
 *  - Reject dangerous protocols (file://, javascript://, ftp://, etc.)
 *  - Block private/internal network targets to prevent SSRF attacks
 *  - Enforce a sensible maximum URL length
 */

import { config } from "./config";

export interface ValidationResult {
  valid: true;
  url: string; // normalized, safe URL string
}

export interface ValidationError {
  valid: false;
  error: string;
  code: "INVALID_FORMAT" | "BLOCKED_PROTOCOL" | "BLOCKED_HOST" | "TOO_LONG" | "EMPTY";
}

export type ValidationOutcome = ValidationResult | ValidationError;

/** Maximum characters we accept for a URL string */
const MAX_URL_LENGTH = 2048;

/**
 * Returns true if the hostname looks like a private or loopback IPv4 address.
 * Covers: 10.x, 172.16–31.x, 192.168.x, 127.x
 */
function isPrivateIPv4(hostname: string): boolean {
  const privateRanges = [
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,
    /^192\.168\.\d{1,3}\.\d{1,3}$/,
    /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  ];
  return privateRanges.some((re) => re.test(hostname));
}

/**
 * Validates and normalizes a user-provided URL string.
 * Returns either { valid: true, url } or { valid: false, error, code }.
 */
export function validateUrl(input: unknown): ValidationOutcome {
  // --- Type and empty check ---
  if (typeof input !== "string" || input.trim().length === 0) {
    return { valid: false, error: "URL is required.", code: "EMPTY" };
  }

  const raw = input.trim();

  // --- Length guard ---
  if (raw.length > MAX_URL_LENGTH) {
    return {
      valid: false,
      error: `URL must be ${MAX_URL_LENGTH} characters or fewer.`,
      code: "TOO_LONG",
    };
  }

  // --- Check for explicit disallowed protocols first (e.g. file://, ftp://, javascript:) ---
  const schemeMatch = raw.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (schemeMatch) {
    const scheme = `${schemeMatch[1].toLowerCase()}:`;
    if (!config.allowedProtocols.includes(scheme)) {
      return {
        valid: false,
        error: `Protocol "${scheme}" is not allowed. Only http:// and https:// are supported.`,
        code: "BLOCKED_PROTOCOL",
      };
    }
  }

  // --- Normalize: prepend https:// if no protocol given ---
  const normalized = schemeMatch ? raw : `https://${raw}`;

  // --- Parse to validate structure ---
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return {
      valid: false,
      error: "Could not parse the provided URL. Please enter a valid web address.",
      code: "INVALID_FORMAT",
    };
  }

  // --- Protocol allowlist secondary check ---
  if (!config.allowedProtocols.includes(parsed.protocol)) {
    return {
      valid: false,
      error: `Protocol "${parsed.protocol}" is not allowed. Only http:// and https:// are supported.`,
      code: "BLOCKED_PROTOCOL",
    };
  }

  // --- SSRF: block known dangerous hostnames ---
  const hostname = parsed.hostname.toLowerCase();
  if (config.blockedHostnames.includes(hostname)) {
    return {
      valid: false,
      error: "Requests to internal or reserved addresses are not allowed.",
      code: "BLOCKED_HOST",
    };
  }

  // --- SSRF: block private IP ranges ---
  if (isPrivateIPv4(hostname)) {
    return {
      valid: false,
      error: "Requests to private network addresses are not allowed.",
      code: "BLOCKED_HOST",
    };
  }

  // --- Must have a resolvable-looking hostname (at least one dot, or is a known TLD) ---
  if (!hostname.includes(".") && hostname !== "localhost") {
    return {
      valid: false,
      error: "Please enter a complete domain name (e.g. example.com).",
      code: "INVALID_FORMAT",
    };
  }

  return { valid: true, url: normalized };
}
