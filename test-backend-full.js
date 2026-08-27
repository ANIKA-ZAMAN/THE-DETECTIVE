const http = require('http');

async function makeRequest(path, method = 'POST', body = null) {
  return new Promise((resolve) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 25000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ status: 0, error: e.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 408, error: 'Request timeout' });
    });

    if (body) {
      req.write(postData);
    }
    req.end();
  });
}

async function runFullBackendTestSuite() {
  console.log('================================================================');
  console.log('   PERFORMANCE DETECTIVE — FULL 6-PAGE BACKEND TEST SUITE       ');
  console.log('================================================================\n');

  const tests = [
    {
      name: '1. POST /api/investigate — Full Data Requirements (Overview, Details, Investigation)',
      run: async () => {
        const res = await makeRequest('/api/investigate', 'POST', { url: 'https://example.com' });
        if (res.status !== 200 || !res.data.success) return { pass: false, msg: 'Invalid status or failure response' };
        const d = res.data.data;
        const hasOverviewMetrics = d.metrics.ttfbMs > 0 && d.metrics.fcpSec > 0 && d.metrics.lcpSec > 0 && d.overallHealthScore > 0;
        const hasDetailsData = Array.isArray(d.thirdPartyResources) && Array.isArray(d.opportunities) && d.resourceBreakdown.counts != null;
        const hasWaterfall = Array.isArray(d.waterfall) && d.waterfall.length > 0 && d.waterfall[0].type === 'document';
        const hasFaults = Array.isArray(d.faults) && d.faults.length > 0;

        if (hasOverviewMetrics && hasDetailsData && hasWaterfall && hasFaults) {
          return { pass: true, extra: `Waterfall: ${d.waterfall.length} items | Opportunities: ${d.opportunities.length} | Score: ${d.overallHealthScore}/100` };
        }
        return { pass: false, msg: 'Missing required 6-page fields in AnalysisResult' };
      }
    },
    {
      name: '2. POST /api/investigate — Bare domain normalization (auto-prepends https://)',
      run: async () => {
        const res = await makeRequest('/api/investigate', 'POST', { url: 'example.com' });
        if (res.status === 200 && res.data.data.normalizedUrl === 'https://example.com') {
          return { pass: true };
        }
        return { pass: false, msg: JSON.stringify(res) };
      }
    },
    {
      name: '3. POST /api/investigate — Graceful Handling of Unreachable / Timeout Websites',
      run: async () => {
        const res = await makeRequest('/api/investigate', 'POST', { url: 'https://nonexistent-domain-xyz-404-test.org' });
        if (res.status === 200 && res.data.success && res.data.data.faults.some(f => f.id === 'FLT-NET-01')) {
          return { pass: true, extra: 'Diagnostic fallback returned with FLT-NET-01 fault' };
        }
        return { pass: false, msg: JSON.stringify(res) };
      }
    },
    {
      name: '4. POST /api/investigate — SSRF Security & Blocked Hostnames',
      run: async () => {
        const res = await makeRequest('/api/investigate', 'POST', { url: 'http://127.0.0.1:8080/admin' });
        if (res.status === 400 && res.data.code === 'BLOCKED_HOST') {
          return { pass: true, extra: '127.0.0.1 correctly rejected with BLOCKED_HOST' };
        }
        return { pass: false, msg: JSON.stringify(res) };
      }
    },
    {
      name: '5. GET /api/history — Scan History Retrieval (History Page)',
      run: async () => {
        const res = await makeRequest('/api/history', 'GET');
        if (res.status === 200 && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          return { pass: true, extra: `Retrieved ${res.data.data.length} recorded scans` };
        }
        return { pass: false, msg: JSON.stringify(res) };
      }
    },
    {
      name: '6. POST /api/compare — Multi-Site Comparison (Compare Page)',
      run: async () => {
        const res = await makeRequest('/api/compare', 'POST', {
          urls: ['https://example.com', 'https://example.org']
        });
        if (res.status === 200 && res.data.success && res.data.data.sites?.length === 2 && res.data.data.summary?.bestOverall) {
          return { pass: true, extra: `Best overall: ${res.data.data.summary.bestOverall}` };
        }
        return { pass: false, msg: JSON.stringify(res) };
      }
    },
    {
      name: '7. POST /api/compare — Invalid URLs Count Validation',
      run: async () => {
        const res = await makeRequest('/api/compare', 'POST', { urls: ['https://single-site.com'] });
        if (res.status === 400 && res.data.code === 'INVALID_URLS_COUNT') {
          return { pass: true, extra: 'Rejected single URL comparison cleanly' };
        }
        return { pass: false, msg: JSON.stringify(res) };
      }
    },
    {
      name: '8. DELETE /api/history — Clear History Log',
      run: async () => {
        const delRes = await makeRequest('/api/history', 'DELETE');
        const getRes = await makeRequest('/api/history', 'GET');
        if (delRes.status === 200 && getRes.status === 200 && getRes.data.data.length === 0) {
          return { pass: true, extra: 'History cleared successfully' };
        }
        return { pass: false, msg: `del: ${JSON.stringify(delRes)}, get: ${JSON.stringify(getRes)}` };
      }
    },
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      const outcome = await t.run();
      if (outcome.pass) {
        passed++;
        console.log(`✅ [PASS] ${t.name}`);
        if (outcome.extra) console.log(`          ℹ️  ${outcome.extra}`);
      } else {
        console.log(`❌ [FAIL] ${t.name}`);
        console.log(`          ⚠️  ${outcome.msg}`);
      }
    } catch (err) {
      console.log(`❌ [ERROR] ${t.name}:`, err.message);
    }
  }

  console.log('\n================================================================');
  console.log(`Test Results: ${passed}/${tests.length} tests passed successfully.`);
  console.log('================================================================\n');

  process.exit(passed === tests.length ? 0 : 1);
}

runFullBackendTestSuite();
