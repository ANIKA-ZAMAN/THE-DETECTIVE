/**
 * Performance Detective — Senior Production Backend Audit Suite
 */

const BASE_URL = "http://localhost:3000";

let ipCounter = 10;
async function makeRequest(path, method = "GET", body = null, customIp = null) {
  const url = new URL(path, BASE_URL);
  const clientIp = customIp || `198.51.100.${ipCounter++}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": clientIp,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), options);
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, json };
}

let passedCount = 0;
let totalCount = 0;

function assert(condition, message, detail = "") {
  totalCount++;
  if (condition) {
    passedCount++;
    console.log(`  ✅ [PASS] ${message}`);
    if (detail) console.log(`            ℹ️  ${detail}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    if (detail) console.error(`            ⚠️  ${detail}`);
  }
}

async function runAudit() {
  console.log("==========================================================================");
  console.log("   PERFORMANCE DETECTIVE — SENIOR PRODUCTION BACKEND AUDIT SUITE          ");
  console.log("==========================================================================\n");

  // ─────────────────────────────────────────────
  // 1. DATA ACCURACY & LIVE METRICS CALCULATION
  // ─────────────────────────────────────────────
  console.log("👉 1. DATA ACCURACY & LIVE METRICS CALCULATION");
  try {
    const res = await makeRequest("/api/investigate", "POST", { url: "https://example.com" });
    assert(res.status === 200 && res.json?.success === true, "POST /api/investigate returns HTTP 200 with valid schema");
    
    const d = res.json?.data;
    assert(d && typeof d.overallHealthScore === "number", "Overall health score is a valid calculated number", `Score: ${d?.overallHealthScore}/100`);
    assert(d && typeof d.metrics?.lcpSec === "number" && d.metrics.lcpSec >= 0, "LCP metric is present and calculated", `LCP: ${d?.metrics?.lcpSec}s`);
    assert(d && typeof d.metrics?.ttfbMs === "number" && d.metrics.ttfbMs > 0, "TTFB latency is genuinely measured", `TTFB: ${d?.metrics?.ttfbMs}ms`);
    assert(d && typeof d.metrics?.pageSizeKb === "number" && d.metrics.pageSizeKb > 0, "Page size is calculated in KB", `Page Size: ${d?.metrics?.pageSizeKb} KB`);
    assert(d && Array.isArray(d.waterfall) && d.waterfall.length >= 1, "Waterfall contains real request items", `Waterfall items: ${d?.waterfall?.length}`);
    assert(d && Array.isArray(d.faults), "Fault diagnostics list is present", `Faults identified: ${d?.faults?.length}`);
  } catch (err) {
    assert(false, "Data accuracy test failed with exception", err.message);
  }

  // ─────────────────────────────────────────────
  // 2. URL NORMALIZATION & INPUT ROBUSTNESS
  // ─────────────────────────────────────────────
  console.log("\n👉 2. URL NORMALIZATION & INPUT ROBUSTNESS");
  try {
    // Missing protocol
    const resBare = await makeRequest("/api/investigate", "POST", { url: "example.com" });
    assert(resBare.status === 200 && resBare.json?.data?.normalizedUrl === "https://example.com", "Bare hostname auto-normalizes to HTTPS", `Result: ${resBare.json?.data?.normalizedUrl}`);

    // Query parameters and fragment
    const resQuery = await makeRequest("/api/investigate", "POST", { url: "https://httpbin.org/get?test=1&debug=true#section" });
    assert(resQuery.status === 200, "URLs with query parameters and fragments are handled cleanly");

    // Trailing slash
    const resSlash = await makeRequest("/api/investigate", "POST", { url: "example.com/" });
    assert(resSlash.status === 200, "URLs with trailing slashes parsed cleanly");
  } catch (err) {
    assert(false, "URL normalization test failed", err.message);
  }

  // ─────────────────────────────────────────────
  // 3. SECURITY & COMPREHENSIVE SSRF DEFENSE
  // ─────────────────────────────────────────────
  console.log("\n👉 3. SECURITY & SSRF DEFENSE (BLOCKED ATTACK VECTORS)");
  const ssrfVectors = [
    { target: "http://127.0.0.1", label: "IPv4 Loopback (127.0.0.1)" },
    { target: "http://localhost", label: "Localhost hostname" },
    { target: "http://0.0.0.0", label: "0.0.0.0 network" },
    { target: "http://169.254.169.254", label: "Cloud metadata IP (AWS/GCP IMDS)" },
    { target: "http://2130706433", label: "Decimal-encoded IP (127.0.0.1)" },
    { target: "http://0x7f000001", label: "Hex-encoded IP (127.0.0.1)" },
    { target: "http://192.168.1.1", label: "Private IPv4 subnet (192.168.x.x)" },
    { target: "http://10.0.0.1", label: "Private IPv4 subnet (10.x.x.x)" },
    { target: "http://172.16.0.1", label: "Private IPv4 subnet (172.16.x.x)" },
    { target: "http://[::1]", label: "IPv6 Loopback ([::1])" },
    { target: "http://[fe80::1]", label: "IPv6 Link-local ([fe80::1])" },
    { target: "file:///etc/passwd", label: "file:// protocol injection" },
    { target: "javascript:alert(1)", label: "javascript: protocol injection" },
    { target: "ftp://example.com", label: "ftp:// protocol injection" },
    { target: "server.local", label: ".local internal domain suffix" },
    { target: "database.internal", label: ".internal private domain suffix" },
    { target: "backend.corp", label: ".corp corporate intranet suffix" },
  ];

  for (const v of ssrfVectors) {
    try {
      const res = await makeRequest("/api/investigate", "POST", { url: v.target });
      const blocked = res.status === 400 && (res.json?.code === "BLOCKED_HOST" || res.json?.code === "BLOCKED_PROTOCOL");
      assert(blocked, `SSRF Blocked: ${v.label}`, `HTTP ${res.status} | Code: ${res.json?.code}`);
    } catch (err) {
      assert(false, `SSRF test crashed for ${v.label}`, err.message);
    }
  }

  // ─────────────────────────────────────────────
  // 4. ERROR HANDLING & UNREACHABLE SITES
  // ─────────────────────────────────────────────
  console.log("\n👉 4. ERROR HANDLING & UNREACHABLE DOMAINS");
  try {
    // Unreachable / Non-existent domain
    const resUnreachable = await makeRequest("/api/investigate", "POST", { url: "https://this-domain-definitely-does-not-exist-993821.org" });
    assert(resUnreachable.status === 200, "Unreachable host returns diagnostic result with zero server crashes");
    assert(resUnreachable.json?.data?.metrics?.pageSizeKb === 0, "Unreachable host has honest 0 KB page size (no fake data)");
    assert(resUnreachable.json?.data?.overallHealthScore === 0, "Unreachable host has overall health score of 0");
    const hasNetFault = resUnreachable.json?.data?.faults?.some((f) => f.id === "FLT-NET-01");
    assert(hasNetFault, "Unreachable host generates clear FLT-NET-01 fault diagnostic");

    // Invalid JSON body
    const resBadJson = await fetch(`${BASE_URL}/api/investigate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": "198.51.100.99" },
      body: "not-json-data",
    });
    assert(resBadJson.status === 400, "Malformed non-JSON body rejected with HTTP 400");

    // Empty URL string
    const resEmpty = await makeRequest("/api/investigate", "POST", { url: "" });
    assert(resEmpty.status === 400 && resEmpty.json?.code === "EMPTY", "Empty URL rejected with code EMPTY");

    // Method not allowed
    const resGet = await makeRequest("/api/investigate", "GET");
    assert(resGet.status === 405, "GET request to /api/investigate cleanly rejected with HTTP 405");
  } catch (err) {
    assert(false, "Error handling test failed", err.message);
  }

  // ─────────────────────────────────────────────
  // 5. MULTI-SITE COMPARE ENGINE
  // ─────────────────────────────────────────────
  console.log("\n👉 5. MULTI-SITE COMPARISON ENGINE (/api/compare)");
  try {
    // Valid 2-site comparison
    const resCompare = await makeRequest("/api/compare", "POST", {
      urls: ["https://example.com", "https://httpbin.org"],
    });
    assert(resCompare.status === 200 && resCompare.json?.success === true, "POST /api/compare succeeds with 2 valid targets");
    assert(Array.isArray(resCompare.json?.data?.sites) && resCompare.json?.data?.sites?.length === 2, "Returns comparison data for both sites");
    assert(typeof resCompare.json?.data?.summary?.bestOverall === "string", "Summary includes bestOverall winner", `Winner: ${resCompare.json?.data?.summary?.bestOverall}`);

    // Invalid count (1 URL)
    const resSingle = await makeRequest("/api/compare", "POST", { urls: ["https://example.com"] });
    assert(resSingle.status === 400 && resSingle.json?.code === "INVALID_URLS_COUNT", "Single URL comparison rejected with INVALID_URLS_COUNT");

    // Too many URLs (5 URLs)
    const resFive = await makeRequest("/api/compare", "POST", {
      urls: ["https://a.com", "https://b.com", "https://c.com", "https://d.com", "https://e.com"],
    });
    assert(resFive.status === 400 && resFive.json?.code === "INVALID_URLS_COUNT", "5-URL comparison rejected with INVALID_URLS_COUNT");
  } catch (err) {
    assert(false, "Compare API test failed", err.message);
  }

  // ─────────────────────────────────────────────
  // 6. PERSISTENT HISTORY & RETRIEVAL
  // ─────────────────────────────────────────────
  console.log("\n👉 6. PERSISTENT HISTORY API (/api/history)");
  try {
    const resHist = await makeRequest("/api/history", "GET");
    assert(resHist.status === 200 && Array.isArray(resHist.json?.data), "GET /api/history returns array of past audit records", `Records found: ${resHist.json?.data?.length}`);

    // URL filtering
    const resFilter = await makeRequest("/api/history?url=example.com", "GET");
    assert(resFilter.status === 200 && Array.isArray(resFilter.json?.data), "GET /api/history with ?url filter returns matched items");
  } catch (err) {
    assert(false, "History API test failed", err.message);
  }

  // ─────────────────────────────────────────────
  // 7. HIGH CONCURRENCY & RACE CONDITION TEST
  // ─────────────────────────────────────────────
  console.log("\n👉 7. HIGH CONCURRENCY & RACE CONDITION TEST (10 CONCURRENT AUDITS)");
  try {
    const concurrentRequests = Array.from({ length: 10 }, (_, i) =>
      makeRequest("/api/investigate", "POST", { url: "https://example.com" }, `203.0.113.${i + 1}`)
    );

    const concurrentResults = await Promise.all(concurrentRequests);
    const all200 = concurrentResults.every((r) => r.status === 200 && r.json?.success === true);
    assert(all200, "10 concurrent requests to /api/investigate executed with 100% success rate & zero crashes");
  } catch (err) {
    assert(false, "Concurrency test failed", err.message);
  }

  console.log("\n==========================================================================");
  console.log(`   AUDIT COMPLETE: ${passedCount}/${totalCount} TESTS PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log("==========================================================================");

  if (passedCount < totalCount) {
    process.exit(1);
  }
}

runAudit();
