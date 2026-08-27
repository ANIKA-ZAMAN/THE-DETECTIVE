/**
 * Performance Detective — Massive 100+ Senior QA Edge Case & Stress Testing Suite
 */

const BASE_URL = "http://localhost:3000";

let clientIpIndex = 100;
async function fetchEndpoint(path, method = "GET", body = null, rawBody = null) {
  const url = new URL(path, BASE_URL);
  const clientIp = `198.51.100.${clientIpIndex++ % 250 + 1}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": clientIp,
    },
  };

  if (method !== "GET" && method !== "HEAD") {
    if (rawBody !== null) {
      options.body = rawBody;
    } else if (body !== null) {
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url.toString(), options);
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, json };
}

let passed = 0;
let total = 0;

function report(condition, category, testName, detail = "") {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS #${total}] [${category}] ${testName}`);
    if (detail) console.log(`               ℹ️  ${detail}`);
  } else {
    console.error(`  ❌ [FAIL #${total}] [${category}] ${testName}`);
    if (detail) console.error(`               ⚠️  ${detail}`);
  }
}

async function runEdgeCases() {
  console.log("==========================================================================");
  console.log("   PERFORMANCE DETECTIVE — 100+ SENIOR QA EDGE CASE & STRESS SUITE        ");
  console.log("==========================================================================\n");

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 1: URL SYNTAX, PROTOCOL & ENCODING EDGE CASES (30 tests)
  // ─────────────────────────────────────────────────────────────
  console.log("▶ CATEGORY 1: URL SYNTAX, PROTOCOL & ENCODING");

  // 1-5: Whitespace & Empty
  const emptyTests = [
    { input: "", label: "Empty string" },
    { input: "   ", label: "Pure whitespace" },
    { input: "\n\t", label: "Newline and tab only" },
    { input: "  https://example.com  ", label: "Leading & trailing whitespace" },
    { input: "https://example.com/path with spaces", label: "URL with unencoded space" },
  ];
  for (const t of emptyTests) {
    const res = await fetchEndpoint("/api/investigate", "POST", { url: t.input });
    if (t.input.includes("example.com")) {
      report(res.status === 200, "URL Syntax", `${t.label} handled gracefully`);
    } else {
      report(res.status === 400 && res.json?.code === "EMPTY", "URL Syntax", `${t.label} rejected with EMPTY`);
    }
  }

  // 6-10: Scheme Variations & Normalization
  const schemeTests = [
    { input: "example.com", expectNorm: "https://example.com", label: "Bare domain (no scheme)" },
    { input: "HTTP://EXAMPLE.COM", expectNorm: "http://example.com", label: "Uppercase HTTP scheme" },
    { input: "hTtPs://ExAmPlE.cOm", expectNorm: "https://example.com", label: "Mixed case HTTPS scheme" },
    { input: "http://example.com", expectNorm: "http://example.com", label: "Explicit HTTP scheme" },
    { input: "https://example.com:443", expectNorm: "https://example.com", label: "Explicit HTTPS default port 443" },
  ];
  for (const t of schemeTests) {
    const res = await fetchEndpoint("/api/investigate", "POST", { url: t.input });
    report(res.status === 200 && res.json?.success === true, "Scheme Normalization", t.label);
  }

  // 11-15: Query, Fragment, Trailing Slashes & Userinfo
  const complexUrlTests = [
    { input: "https://httpbin.org/get?a=1&b=2#section1", label: "URL with query and hash fragment" },
    { input: "https://httpbin.org/get?q=%20encoded%20string", label: "URL with percent-encoded query" },
    { input: "https://httpbin.org/get?html=%3Cscript%3E", label: "URL with XSS payload in query" },
    { input: "https://example.com///multiple-slashes", label: "URL with multiple slashes in path" },
    { input: "https://user:password@httpbin.org/get", label: "URL with HTTP Basic Auth userinfo" },
  ];
  for (const t of complexUrlTests) {
    const res = await fetchEndpoint("/api/investigate", "POST", { url: t.input });
    report(res.status === 200, "Complex URL Parsing", t.label);
  }

  // 16-22: Forbidden & Malicious Protocols (SSRF / File Access)
  const forbiddenSchemes = [
    { input: "file:///etc/passwd", label: "file:// protocol" },
    { input: "javascript:alert(document.cookie)", label: "javascript: protocol" },
    { input: "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==", label: "data: protocol" },
    { input: "ftp://ftp.example.com/files", label: "ftp:// protocol" },
    { input: "blob:https://example.com/d3b07384-d113", label: "blob: protocol" },
    { input: "gopher://127.0.0.1:70", label: "gopher:// protocol" },
    { input: "ldap://localhost:389", label: "ldap:// protocol" },
  ];
  for (const t of forbiddenSchemes) {
    const res = await fetchEndpoint("/api/investigate", "POST", { url: t.input });
    report(res.status === 400 && res.json?.code === "BLOCKED_PROTOCOL", "Dangerous Protocols", `${t.label} rejected`);
  }

  // 23-30: Malformed & Invalid Formats
  const invalidFormats = [
    { input: "http://.", label: "Dot-only host" },
    { input: "http://..", label: "Double dot host" },
    { input: "https://example..com", label: "Consecutive dots in host" },
    { input: "https://-invalid-host-.com", label: "Hyphen-padded host" },
    { input: "https://example.com:99999", label: "Out of range port 99999" },
    { input: "https://example.com:-1", label: "Negative port -1" },
    { input: "https://example.com:abc", label: "Non-numeric port" },
    { input: "a".repeat(3000), label: "Oversized URL (>2048 chars)" },
  ];
  for (const t of invalidFormats) {
    const res = await fetchEndpoint("/api/investigate", "POST", { url: t.input });
    const isCleanError = res.status === 400 && (res.json?.code === "INVALID_FORMAT" || res.json?.code === "TOO_LONG" || res.json?.code === "BLOCKED_HOST");
    report(isCleanError, "Malformed URL Guard", `${t.label} cleanly rejected`);
  }

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 2: SSRF & PRIVATE IP DEFENSE MATRIX (30 tests)
  // ─────────────────────────────────────────────────────────────
  console.log("\n▶ CATEGORY 2: SSRF & PRIVATE IP DEFENSE MATRIX");

  const ssrfMatrix = [
    // IPv4 Loopback & 0.0.0.0
    { ip: "http://127.0.0.1", label: "Standard 127.0.0.1" },
    { ip: "http://127.0.0.2", label: "Loopback 127.0.0.2" },
    { ip: "http://127.255.255.254", label: "Loopback 127.255.255.254" },
    { ip: "http://0.0.0.0", label: "0.0.0.0 network" },
    { ip: "http://localhost", label: "localhost hostname" },
    { ip: "http://localhost:8080", label: "localhost with port" },

    // BSD Socket Multi-part IP Abbreviation Bypasses
    { ip: "http://127.1", label: "2-part loopback (127.1)" },
    { ip: "http://127.0.1", label: "3-part loopback (127.0.1)" },
    { ip: "http://10.1", label: "2-part private IP (10.1)" },
    { ip: "http://192.168.1", label: "3-part private IP (192.168.1)" },
    { ip: "http://172.16.1", label: "3-part private IP (172.16.1)" },

    // Single Integer, Hex & Octal IP Bypasses
    { ip: "http://2130706433", label: "Decimal 2130706433 (127.0.0.1)" },
    { ip: "http://0x7f000001", label: "Hex 0x7f000001 (127.0.0.1)" },
    { ip: "http://017700000001", label: "Octal 017700000001 (127.0.0.1)" },
    { ip: "http://0x7f.1", label: "Mixed hex/dec (0x7f.1)" },

    // Private IPv4 Subnets (RFC 1918)
    { ip: "http://10.0.0.1", label: "Private 10.0.0.1 (10/8)" },
    { ip: "http://10.255.255.254", label: "Private 10.255.255.254" },
    { ip: "http://172.16.0.1", label: "Private 172.16.0.1 (172.16/12)" },
    { ip: "http://172.31.255.254", label: "Private 172.31.255.254" },
    { ip: "http://192.168.0.1", label: "Private 192.168.0.1 (192.168/16)" },
    { ip: "http://192.168.1.254", label: "Private 192.168.1.254" },

    // Cloud Metadata & CGN
    { ip: "http://169.254.169.254", label: "AWS/GCP IMDS 169.254.169.254" },
    { ip: "http://100.64.0.1", label: "Carrier-grade NAT 100.64.0.1" },
    { ip: "http://metadata.google.internal", label: "GCP metadata.google.internal" },
    { ip: "http://instance-data", label: "AWS instance-data" },

    // IPv6 Loopback, Link-Local, ULA & IPv4-mapped
    { ip: "http://[::1]", label: "IPv6 loopback [::1]" },
    { ip: "http://[::]", label: "IPv6 unspecified [::]" },
    { ip: "http://[fe80::1]", label: "IPv6 link-local [fe80::1]" },
    { ip: "http://[fc00::1]", label: "IPv6 ULA [fc00::1]" },
    { ip: "http://[::ffff:127.0.0.1]", label: "IPv4-mapped IPv6 [::ffff:127.0.0.1]" },
  ];

  for (const s of ssrfMatrix) {
    const res = await fetchEndpoint("/api/investigate", "POST", { url: s.ip });
    const blocked = res.status === 400 && res.json?.code === "BLOCKED_HOST";
    report(blocked, "SSRF Defense", s.label, `HTTP ${res.status} | Code: ${res.json?.code}`);
  }

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 3: API ROBUSTNESS, METHOD GUARDS & PAYLOAD FUZZING (15 tests)
  // ─────────────────────────────────────────────────────────────
  console.log("\n▶ CATEGORY 3: API ROBUSTNESS & PAYLOAD FUZZING");

  // Non-JSON payloads
  const rawPayloads = [
    { body: "not a json string", label: "Raw plain text" },
    { body: "{ malformed: json", label: "Malformed JSON string" },
    { body: "12345", label: "Raw numeric string" },
    { body: "true", label: "Raw boolean" },
    { body: "null", label: "Raw null" },
  ];
  for (const p of rawPayloads) {
    const res = await fetchEndpoint("/api/investigate", "POST", null, p.body);
    report(res.status === 400, "Payload Fuzzing", `${p.label} rejected with HTTP 400`);
  }

  // Body Type Variations
  const bodyTypes = [
    { body: ["https://example.com"], label: "Array instead of object" },
    { body: { wrongField: "https://example.com" }, label: "Missing url field" },
    { body: { url: 12345 }, label: "Numeric url field" },
    { body: { url: null }, label: "Null url field" },
    { body: { url: true }, label: "Boolean url field" },
  ];
  for (const b of bodyTypes) {
    const res = await fetchEndpoint("/api/investigate", "POST", b.body);
    report(res.status === 400, "Schema Guard", `${b.label} rejected with HTTP 400`);
  }

  // HTTP Method Rejections
  const methodTests = [
    { path: "/api/investigate", method: "GET", label: "GET /api/investigate (405)" },
    { path: "/api/investigate", method: "PUT", label: "PUT /api/investigate (405)" },
    { path: "/api/investigate", method: "DELETE", label: "DELETE /api/investigate (405)" },
    { path: "/api/compare", method: "GET", label: "GET /api/compare (405)" },
    { path: "/api/history", method: "POST", label: "POST /api/history (405)" },
  ];
  for (const m of methodTests) {
    const res = await fetchEndpoint(m.path, m.method, { url: "https://example.com" });
    report(res.status === 405, "Method Not Allowed", m.label);
  }

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 4: MULTI-SITE COMPARE API EDGE CASES (15 tests)
  // ─────────────────────────────────────────────────────────────
  console.log("\n▶ CATEGORY 4: MULTI-SITE COMPARE API EDGE CASES");

  const compareCases = [
    { body: { urls: [] }, expectStatus: 400, label: "Empty urls array" },
    { body: { urls: ["https://example.com"] }, expectStatus: 400, label: "Single URL array (minimum 2)" },
    { body: { urls: ["https://a.com", "https://b.com", "https://c.com", "https://d.com", "https://e.com"] }, expectStatus: 400, label: "5 URLs array (maximum 4)" },
    { body: { urls: "https://example.com" }, expectStatus: 400, label: "String instead of array" },
    { body: { urls: [null, undefined] }, expectStatus: 400, label: "Null elements in array" },
    { body: { urls: ["https://example.com", "127.0.0.1"] }, expectStatus: 400, label: "Mix of valid and SSRF URL" },
    { body: { urls: ["https://example.com", "file:///etc/passwd"] }, expectStatus: 400, label: "Mix of valid and file:// URL" },
    { body: { urls: ["https://example.com", "https://example.com"] }, expectStatus: 200, label: "Duplicate identical URLs" },
    { body: { urls: ["https://example.com", "https://httpbin.org"] }, expectStatus: 200, label: "2 valid websites" },
    { body: { urls: ["https://example.com", "https://httpbin.org", "example.com"] }, expectStatus: 200, label: "3 valid websites with bare domain" },
  ];

  for (const c of compareCases) {
    const res = await fetchEndpoint("/api/compare", "POST", c.body);
    report(res.status === c.expectStatus, "Compare API", c.label, `HTTP ${res.status}`);
  }

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 5: PERSISTENT HISTORY & INJECTION DEFENSE (10 tests)
  // ─────────────────────────────────────────────────────────────
  console.log("\n▶ CATEGORY 5: PERSISTENT HISTORY & FILTERING INJECTION");

  const historyTests = [
    { query: "", label: "GET /api/history returns array" },
    { query: "?url=example.com", label: "GET /api/history?url=example.com" },
    { query: "?url=nonexistent-query-9999", label: "GET /api/history for non-existent domain returns empty list" },
    { query: "?url=<script>alert(1)</script>", label: "XSS string in history query filter" },
    { query: "?url=' OR '1'='1", label: "SQLi injection string in history query filter" },
    { query: "?url=(a+)+$", label: "ReDoS regex string in history query filter" },
  ];

  for (const h of historyTests) {
    const res = await fetchEndpoint(`/api/history${h.query}`, "GET");
    report(res.status === 200 && Array.isArray(res.json?.data), "History Security", h.label);
  }

  // Delete history test
  const resDel = await fetchEndpoint("/api/history", "DELETE");
  report(resDel.status === 200 && resDel.json?.success === true, "History Management", "DELETE /api/history clears history store");

  // Verify empty after delete
  const resEmptyHist = await fetchEndpoint("/api/history", "GET");
  report(resEmptyHist.status === 200 && resEmptyHist.json?.data?.length === 0, "History Verification", "History is cleanly empty after DELETE");

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 6: HIGH CONCURRENCY, LOAD & RACE CONDITIONS (10 tests)
  // ─────────────────────────────────────────────────────────────
  console.log("\n▶ CATEGORY 6: HIGH CONCURRENCY & RACE CONDITIONS");

  // 10 concurrent requests to /api/investigate
  const concurrentInvestigate = Array.from({ length: 10 }, (_, i) =>
    fetchEndpoint("/api/investigate", "POST", { url: "https://example.com" })
  );
  const resultsInvestigate = await Promise.all(concurrentInvestigate);
  const allInvestigateSuccess = resultsInvestigate.every((r) => r.status === 200 && r.json?.success === true);
  report(allInvestigateSuccess, "Concurrency Stress", "10 concurrent /api/investigate requests succeeded (100%)");

  // 5 concurrent requests to /api/compare
  const concurrentCompare = Array.from({ length: 5 }, (_, i) =>
    fetchEndpoint("/api/compare", "POST", { urls: ["https://example.com", "https://httpbin.org"] })
  );
  const resultsCompare = await Promise.all(concurrentCompare);
  const allCompareSuccess = resultsCompare.every((r) => r.status === 200 && r.json?.success === true);
  report(allCompareSuccess, "Concurrency Stress", "5 concurrent /api/compare requests succeeded (100%)");

  // Mixed concurrent endpoints
  const mixedRequests = [
    fetchEndpoint("/api/investigate", "POST", { url: "https://example.com" }),
    fetchEndpoint("/api/compare", "POST", { urls: ["https://example.com", "https://httpbin.org"] }),
    fetchEndpoint("/api/history", "GET"),
    fetchEndpoint("/api/investigate", "POST", { url: "https://httpbin.org" }),
    fetchEndpoint("/api/history?url=example", "GET"),
  ];
  const mixedResults = await Promise.all(mixedRequests);
  const allMixedSuccess = mixedResults.every((r) => r.status === 200);
  report(allMixedSuccess, "Mixed Concurrency", "5 simultaneous mixed API calls executed flawlessly");

  // ─────────────────────────────────────────────────────────────
  // CATEGORY 7: UNICODE, REDIRECTS, 404S & EXTENDED STRESS (10 tests)
  // ─────────────────────────────────────────────────────────────
  console.log("\n▶ CATEGORY 7: UNICODE, SPECIAL ENCODINGS & 4-SITE MATRIX");

  const extendedTests = [
    { input: "https://httpbin.org/status/404", label: "Remote website returning HTTP 404 Not Found" },
    { input: "https://httpbin.org/status/500", label: "Remote website returning HTTP 500 Server Error" },
    { input: "https://httpbin.org/redirect/2", label: "Remote website with 2 HTTP redirects" },
    { input: "https://httpbin.org/bytes/1024", label: "Binary stream response" },
    { input: "https://httpbin.org/get?" + Array.from({ length: 50 }, (_, i) => `key${i}=val${i}`).join("&"), label: "URL with 50 query parameters" },
    { input: "http://[fe80::1%25eth0]", label: "IPv6 link-local with URL-encoded scope ID" },
    { input: "http://0177.0.0.1", label: "IPv4 octal loopback 0177.0.0.1" },
    { input: "https://xn--e1afmkfd.xn--p1ai", label: "Punycode IDN internationalized domain" },
  ];

  for (const ext of extendedTests) {
    const res = await fetchEndpoint("/api/investigate", "POST", { url: ext.input });
    if (ext.input.includes("fe80") || ext.input.includes("0177")) {
      report(res.status === 400 && (res.json?.code === "BLOCKED_HOST" || res.json?.code === "INVALID_FORMAT"), "Extended Security", `${ext.label} blocked`);
    } else {
      report(res.status === 200, "Extended Target Handling", `${ext.label} handled`);
    }
  }

  // 4-site maximum comparison
  const resFour = await fetchEndpoint("/api/compare", "POST", {
    urls: ["https://example.com", "https://httpbin.org", "example.com", "https://httpbin.org/get"],
  });
  report(resFour.status === 200 && resFour.json?.data?.sites?.length === 4, "Extended Compare", "4-site maximum comparison executed");

  // Re-run single comparison validation
  const resInvalidUrls = await fetchEndpoint("/api/compare", "POST", { urls: ["not-a-valid-url-at-all"] });
  report(resInvalidUrls.status === 400, "Extended Compare", "Single malformed URL in compare rejected");

  console.log("\n==========================================================================");
  console.log(`   STRESS SUITE COMPLETE: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log("==========================================================================");

  if (passed < total) {
    process.exit(1);
  }
}

runEdgeCases();
