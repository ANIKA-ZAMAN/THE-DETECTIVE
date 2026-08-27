/**
 * Performance Detective — Enterprise URL Validation & SSRF Defense Layer
 *
 * Responsibilities:
 *  - Normalize bare hostnames into full HTTPS URLs
 *  - Strictly reject dangerous protocols (file://, javascript://, data://, ftp://, gopher://, etc.)
 *  - Block loopback, private IPv4 & IPv6, link-local, carrier-grade NAT, and cloud metadata endpoints (SSRF defense)
 *  - Block decimal, hex, and octal IP bypass notations
 *  - Block internal domain suffixes (.local, .internal, .lan, .corp, etc.)
 *  - Enforce maximum URL length and structural safety
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

/** Maximum characters accepted for a URL string */
const MAX_URL_LENGTH = 2048;

/**
 * Checks if a string is an IPv4 address in any standard BSD-socket format:
 * 4-part (a.b.c.d), 3-part (a.b.c), 2-part (a.b), or 1-part (integer/hex/octal).
 */
function parseIPv4(ipStr: string): number[] | null {
  const parts = ipStr.split(".");
  if (parts.length >= 1 && parts.length <= 4) {
    const parsedParts: number[] = [];
    for (const p of parts) {
      let n: number;
      if (/^0x[0-9a-f]+$/i.test(p)) {
        n = parseInt(p, 16);
      } else if (/^0[0-7]+$/.test(p) && p.length > 1) {
        n = parseInt(p, 8);
      } else if (/^\d+$/.test(p)) {
        n = parseInt(p, 10);
      } else {
        return null;
      }
      if (isNaN(n) || n < 0) return null;
      parsedParts.push(n);
    }

    if (parsedParts.length === 4) {
      if (parsedParts.every((n) => n <= 255)) return parsedParts;
    } else if (parsedParts.length === 3) {
      if (parsedParts[0] <= 255 && parsedParts[1] <= 255 && parsedParts[2] <= 65535) {
        return [
          parsedParts[0],
          parsedParts[1],
          (parsedParts[2] >>> 8) & 255,
          parsedParts[2] & 255,
        ];
      }
    } else if (parsedParts.length === 2) {
      if (parsedParts[0] <= 255 && parsedParts[1] <= 16777215) {
        return [
          parsedParts[0],
          (parsedParts[1] >>> 16) & 255,
          (parsedParts[1] >>> 8) & 255,
          parsedParts[1] & 255,
        ];
      }
    } else if (parsedParts.length === 1) {
      if (parsedParts[0] <= 4294967295) {
        return [
          (parsedParts[0] >>> 24) & 255,
          (parsedParts[0] >>> 16) & 255,
          (parsedParts[0] >>> 8) & 255,
          parsedParts[0] & 255,
        ];
      }
    }
  }

  return null;
}

/**
 * Returns true if the IPv4 numbers fall into private, loopback, or reserved subnets.
 */
function isRestrictedIPv4(octets: number[]): boolean {
  const [a, b] = octets;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;
  // 10.0.0.0/8 (Private)
  if (a === 10) return true;
  // 100.64.0.0/10 (Shared Address Space / CGN)
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 169.254.0.0/16 (Link-local / AWS / GCP / Azure metadata)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 (Private)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.0.0.0/24 (IETF Protocol Assignments)
  if (a === 192 && b === 0 && octets[2] === 0) return true;
  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;
  // 198.18.0.0/15 (Benchmarking)
  if (a === 198 && (b === 18 || b === 19)) return true;
  // 224.0.0.0/4 (Multicast)
  if (a >= 224 && a <= 239) return true;
  // 240.0.0.0/4 (Reserved / Future Use)
  if (a >= 240) return true;

  return false;
}

/**
 * Returns true if the hostname is a private or loopback IPv6 address.
 */
function isRestrictedIPv6(hostname: string): boolean {
  const clean = hostname.replace(/^\[|\]$/g, "").toLowerCase();

  // Loopback / Unspecified
  if (
    clean === "::1" ||
    clean === "::" ||
    clean === "0:0:0:0:0:0:0:1" ||
    clean === "0:0:0:0:0:0:0:0"
  ) {
    return true;
  }

  // IPv4-mapped IPv6 (::ffff:127.0.0.1 or ::ffff:7f00:1 or ::ffff:7f00:0001)
  if (clean.startsWith("::ffff:") || clean.startsWith("0:0:0:0:0:ffff:")) {
    const mapped = clean.replace(/^(::ffff:|0:0:0:0:0:ffff:)/, "");
    if (mapped.includes(".")) {
      const octets = parseIPv4(mapped);
      if (octets && isRestrictedIPv4(octets)) return true;
    } else if (mapped.includes(":")) {
      const hexParts = mapped.split(":");
      if (hexParts.length === 2) {
        const hi = parseInt(hexParts[0], 16);
        const lo = parseInt(hexParts[1], 16);
        if (!isNaN(hi) && !isNaN(lo)) {
          const octets = [(hi >>> 8) & 255, hi & 255, (lo >>> 8) & 255, lo & 255];
          if (isRestrictedIPv4(octets)) return true;
        }
      }
    }
  }

  // Unique Local Address (fc00::/7)
  if (clean.startsWith("fc") || clean.startsWith("fd")) return true;

  // Link-Local Unicast (fe80::/10)
  if (
    clean.startsWith("fe8") ||
    clean.startsWith("fe9") ||
    clean.startsWith("fea") ||
    clean.startsWith("feb")
  ) {
    return true;
  }

  return false;
}

/**
 * Validates and normalizes a user-provided URL string.
 * Returns `{ valid: true, url }` or `{ valid: false, error, code }`.
 */
export function validateUrl(input: unknown): ValidationOutcome {
  // 1. Type and empty check
  if (typeof input !== "string" || input.trim().length === 0) {
    return { valid: false, error: "URL is required.", code: "EMPTY" };
  }

  const raw = input.trim();

  // 2. Length guard
  if (raw.length > MAX_URL_LENGTH) {
    return {
      valid: false,
      error: `URL must be ${MAX_URL_LENGTH} characters or fewer.`,
      code: "TOO_LONG",
    };
  }

  // 3. Check for explicit disallowed protocols first
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

  // 4. Normalize: prepend https:// if no protocol given
  const normalized = schemeMatch ? raw : `https://${raw}`;

  // 5. Parse to validate structure
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

  // 6. Protocol allowlist secondary check
  if (!config.allowedProtocols.includes(parsed.protocol)) {
    return {
      valid: false,
      error: `Protocol "${parsed.protocol}" is not allowed. Only http:// and https:// are supported.`,
      code: "BLOCKED_PROTOCOL",
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 7. SSRF: block known dangerous hostnames
  if (config.blockedHostnames.includes(hostname)) {
    return {
      valid: false,
      error: "Requests to internal, loopback, or metadata addresses are not allowed.",
      code: "BLOCKED_HOST",
    };
  }

  // 8. SSRF: block internal domain suffixes (.local, .internal, .lan, .corp, etc.)
  const internalSuffixes = [".local", ".internal", ".lan", ".corp", ".home", ".intranet", ".test", ".invalid", ".example"];
  if (internalSuffixes.some((suffix) => hostname.endsWith(suffix))) {
    return {
      valid: false,
      error: "Requests to internal or private domain extensions are not allowed.",
      code: "BLOCKED_HOST",
    };
  }

  // 9. SSRF: block IPv4 addresses in private/restricted ranges
  const ipv4Octets = parseIPv4(hostname);
  if (ipv4Octets && isRestrictedIPv4(ipv4Octets)) {
    return {
      valid: false,
      error: "Requests to private or internal IP network addresses are not allowed.",
      code: "BLOCKED_HOST",
    };
  }

  // 10. SSRF: block IPv6 addresses in private/restricted ranges
  if (isRestrictedIPv6(hostname)) {
    return {
      valid: false,
      error: "Requests to private or loopback IPv6 addresses are not allowed.",
      code: "BLOCKED_HOST",
    };
  }

  // 11. Must have a valid-looking hostname
  if (
    !hostname ||
    /^[\.\s]+$/.test(hostname) ||
    hostname.includes("..") ||
    hostname.startsWith(".") ||
    hostname.endsWith(".") ||
    hostname.startsWith("-") ||
    hostname.endsWith("-") ||
    (!hostname.includes(".") && !ipv4Octets && !hostname.startsWith("["))
  ) {
    return {
      valid: false,
      error: "Please enter a complete domain name (e.g. example.com).",
      code: "INVALID_FORMAT",
    };
  }

  return { valid: true, url: normalized };
}
