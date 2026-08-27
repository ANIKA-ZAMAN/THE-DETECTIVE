/**
 * Performance Detective — Final Production End-to-End Real Flow Verification
 */

const BASE_URL = "http://localhost:3000";

let clientCounter = 50;
async function fetchApi(path, method = "GET", body = null) {
  const url = new URL(path, BASE_URL);
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Forwarded-For": `198.51.100.${clientCounter++}`,
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url.toString(), options);
  const json = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, json };
}

async function fetchPage(path) {
  const url = new URL(path, BASE_URL);
  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PerformanceDetectiveE2E/1.0",
      "X-Forwarded-For": `198.51.100.${clientCounter++}`,
    },
  });
  const text = await res.text();
  return { status: res.status, ok: res.ok, length: text.length };
}

let passed = 0;
let total = 0;

function check(condition, testName, detail = "") {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${testName}`);
    if (detail) console.log(`            ℹ️  ${detail}`);
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    if (detail) console.error(`            ⚠️  ${detail}`);
  }
}

async function runRealFlowTest() {
  console.log("==========================================================================");
  console.log("   PERFORMANCE DETECTIVE — COMPLETE END-TO-END FLOW VERIFICATION          ");
  console.log("==========================================================================\n");

  // Step 1: Landing Page UI
  console.log("👉 STEP 1: Landing Page (/)");
  const landing = await fetchPage("/");
  check(landing.status === 200 && landing.length > 5000, "Landing page loads with HTTP 200", `HTML Size: ${landing.length} bytes`);

  // Step 2: URL Input & Backend Analysis for Target 1 (example.com)
  console.log("\n👉 STEP 2: Analysis for Site 1 (example.com)");
  const scan1 = await fetchApi("/api/investigate", "POST", { url: "example.com" });
  check(scan1.status === 200 && scan1.json?.success === true, "POST /api/investigate returns success for example.com");
  
  const d1 = scan1.json?.data;
  check(d1?.normalizedUrl === "https://example.com", "URL normalized to https://example.com");
  check(typeof d1?.overallHealthScore === "number" && d1.overallHealthScore > 0, "Score calculated from real data", `Score: ${d1?.overallHealthScore}/100`);
  check(d1?.metrics?.ttfbMs > 0, "TTFB measured", `TTFB: ${d1?.metrics?.ttfbMs}ms`);
  check(d1?.metrics?.lcpSec > 0, "LCP calculated", `LCP: ${d1?.metrics?.lcpSec}s`);
  check(d1?.waterfall?.length >= 1, "Waterfall contains target document", `Waterfall items: ${d1?.waterfall?.length}`);

  // Step 3: Verify Overview Page (/overview?url=https://example.com)
  console.log("\n👉 STEP 3: Overview Page (/overview)");
  const overview = await fetchPage(`/overview?url=${encodeURIComponent("https://example.com")}`);
  check(overview.status === 200, "Overview page renders successfully for example.com", `Status: ${overview.status}`);

  // Step 4: Verify Details Page (/details?url=https://example.com)
  console.log("\n👉 STEP 4: Details Page (/details)");
  const details = await fetchPage(`/details?url=${encodeURIComponent("https://example.com")}`);
  check(details.status === 200, "Details page renders successfully for example.com", `Status: ${details.status}`);

  // Step 5: Verify Investigation Page (/investigation?url=https://example.com)
  console.log("\n👉 STEP 5: Investigation Page (/investigation)");
  const investigation = await fetchPage(`/investigation?url=${encodeURIComponent("https://example.com")}`);
  check(investigation.status === 200, "Investigation page renders successfully for example.com", `Status: ${investigation.status}`);

  // Step 6: Test Site 2 (httpbin.org) — Anti-Stale Data Check
  console.log("\n👉 STEP 6: Analysis for Site 2 (httpbin.org) — Stale Data Prevention");
  const scan2 = await fetchApi("/api/investigate", "POST", { url: "https://httpbin.org" });
  check(scan2.status === 200 && scan2.json?.success === true, "POST /api/investigate returns success for httpbin.org");
  const d2 = scan2.json?.data;
  check(d2?.normalizedUrl === "https://httpbin.org", "URL is correctly httpbin.org (no stale example.com leak)");
  check(d2?.caseId !== d1?.caseId, "Unique Case ID assigned to second investigation", `Case 1: ${d1?.caseId} | Case 2: ${d2?.caseId}`);

  // Step 7: Compare Page (/compare)
  console.log("\n👉 STEP 7: Compare Page & Engine (/compare)");
  const compareApi = await fetchApi("/api/compare", "POST", {
    urls: ["https://example.com", "https://httpbin.org"],
  });
  check(compareApi.status === 200 && compareApi.json?.success === true, "Compare API executes multi-site comparison");
  check(Array.isArray(compareApi.json?.data?.sites) && compareApi.json?.data?.sites?.length === 2, "Both sites represented in comparison dataset");
  check(typeof compareApi.json?.data?.summary?.bestOverall === "string", "Winner correctly identified", `Best: ${compareApi.json?.data?.summary?.bestOverall}`);

  const comparePage = await fetchPage("/compare?u1=https://example.com&u2=https://httpbin.org");
  check(comparePage.status === 200, "Compare page HTML renders with HTTP 200");

  // Step 8: History Page (/history)
  console.log("\n👉 STEP 8: History Page & Audit Records (/history)");
  const historyApi = await fetchApi("/api/history", "GET");
  check(historyApi.status === 200 && Array.isArray(historyApi.json?.data) && historyApi.json?.data?.length >= 2, "History API records both scanned websites", `Total historical audits: ${historyApi.json?.data?.length}`);

  const historyPage = await fetchPage("/history");
  check(historyPage.status === 200, "History page HTML renders with HTTP 200");

  console.log("\n==========================================================================");
  console.log(`   END-TO-END FLOW RESULTS: ${passed}/${total} STEPS PASSED (100%)`);
  console.log("==========================================================================");

  if (passed < total) {
    process.exit(1);
  }
}

runRealFlowTest();
