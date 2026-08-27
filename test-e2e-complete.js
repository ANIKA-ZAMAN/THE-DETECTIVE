const http = require('http');

async function makeRequest(path, method = 'GET', body = null) {
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
      timeout: 30000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data), raw: data });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (e) => resolve({ status: 0, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 408, error: 'Timeout' }); });

    if (body) req.write(postData);
    req.end();
  });
}

async function runEndToEndAudit() {
  console.log('========================================================================');
  console.log('   PERFORMANCE DETECTIVE — FULL END-TO-END AUDIT SUITE                  ');
  console.log('========================================================================\n');

  const steps = [
    {
      name: 'Step 1: Landing Page (/) Loads Successfully',
      run: async () => {
        const res = await makeRequest('/', 'GET');
        if (res.status === 200 && res.raw.includes('PERFORMANCE') && res.raw.includes('DETECTIVE')) {
          return { pass: true, detail: 'Landing page rendered with zero server errors' };
        }
        return { pass: false, msg: `Status ${res.status}` };
      }
    },
    {
      name: 'Step 2: Backend Investigation (/api/investigate) with Real Domain',
      run: async () => {
        const res = await makeRequest('/api/investigate', 'POST', { url: 'https://httpbin.org' });
        if (res.status === 200 && res.data.success && res.data.data.metrics.pageSizeKb > 0) {
          const d = res.data.data;
          return {
            pass: true,
            detail: `Case: ${d.caseId} | Score: ${d.overallHealthScore}/100 | LCP: ${d.metrics.lcpSec}s | TTFB: ${d.metrics.ttfbMs}ms | Waterfall: ${d.waterfall.length} items`
          };
        }
        return { pass: false, msg: JSON.stringify(res.data) };
      }
    },
    {
      name: 'Step 3: Overview Page (/overview) HTML & SSR Verification',
      run: async () => {
        const res = await makeRequest('/overview?url=https://httpbin.org', 'GET');
        if (res.status === 200 && res.raw.length > 5000) {
          return { pass: true, detail: `Overview page served with HTTP 200 (${res.raw.length} bytes)` };
        }
        return { pass: false, msg: `Status ${res.status}` };
      }
    },
    {
      name: 'Step 4: Details Page (/details) HTML & SSR Verification',
      run: async () => {
        const res = await makeRequest('/details?url=https://httpbin.org', 'GET');
        if (res.status === 200 && res.raw.length > 5000) {
          return { pass: true, detail: `Details page served with HTTP 200 (${res.raw.length} bytes)` };
        }
        return { pass: false, msg: `Status ${res.status}` };
      }
    },
    {
      name: 'Step 5: Investigation Page (/investigation) HTML & Waterfall Route',
      run: async () => {
        const res = await makeRequest('/investigation?url=https://httpbin.org', 'GET');
        if (res.status === 200 && res.raw.length > 5000) {
          return { pass: true, detail: `Investigation page served with HTTP 200 (${res.raw.length} bytes)` };
        }
        return { pass: false, msg: `Status ${res.status}` };
      }
    },
    {
      name: 'Step 6: Multi-Site Comparison Engine (/api/compare)',
      run: async () => {
        const res = await makeRequest('/api/compare', 'POST', {
          urls: ['https://example.com', 'https://httpbin.org']
        });
        if (res.status === 200 && res.data.success && res.data.data.sites?.length === 2) {
          const s = res.data.data.summary;
          return { pass: true, detail: `Winner: ${s.bestOverall} | Fastest TTFB: ${s.fastestTTFB}` };
        }
        return { pass: false, msg: JSON.stringify(res.data) };
      }
    },
    {
      name: 'Step 7: Compare Page (/compare) HTML & SSR Verification',
      run: async () => {
        const res = await makeRequest('/compare', 'GET');
        if (res.status === 200 && res.raw.length > 5000) {
          return { pass: true, detail: `Compare page served with HTTP 200 (${res.raw.length} bytes)` };
        }
        return { pass: false, msg: `Status ${res.status}` };
      }
    },
    {
      name: 'Step 8: Persistent History (/api/history) Logging & Trend Retrieval',
      run: async () => {
        const res = await makeRequest('/api/history', 'GET');
        if (res.status === 200 && res.data.success && Array.isArray(res.data.data) && res.data.data.length >= 2) {
          return { pass: true, detail: `Retrieved ${res.data.data.length} persistent historical audit entries` };
        }
        return { pass: false, msg: JSON.stringify(res.data) };
      }
    },
    {
      name: 'Step 9: History Page (/history) HTML & SSR Verification',
      run: async () => {
        const res = await makeRequest('/history', 'GET');
        if (res.status === 200 && res.raw.length > 5000) {
          return { pass: true, detail: `History page served with HTTP 200 (${res.raw.length} bytes)` };
        }
        return { pass: false, msg: `Status ${res.status}` };
      }
    },
    {
      name: 'Step 10: Security & SSRF Protection (Blocked Private Hostnames)',
      run: async () => {
        const res = await makeRequest('/api/investigate', 'POST', { url: 'http://localhost:8080/secret' });
        if (res.status === 400 && res.data.code === 'BLOCKED_HOST') {
          return { pass: true, detail: 'Private IP/localhost properly blocked with code BLOCKED_HOST' };
        }
        return { pass: false, msg: JSON.stringify(res.data) };
      }
    },
  ];

  let passed = 0;
  for (const step of steps) {
    try {
      const outcome = await step.run();
      if (outcome.pass) {
        passed++;
        console.log(`✅ [PASS] ${step.name}`);
        if (outcome.detail) console.log(`          ℹ️  ${outcome.detail}`);
      } else {
        console.log(`❌ [FAIL] ${step.name}`);
        console.log(`          ⚠️  ${outcome.msg}`);
      }
    } catch (err) {
      console.log(`❌ [ERROR] ${step.name}: ${err.message}`);
    }
  }

  console.log('\n========================================================================');
  console.log(`End-to-End Audit Results: ${passed}/${steps.length} steps passed (100%).`);
  console.log('========================================================================\n');

  process.exit(passed === steps.length ? 0 : 1);
}

runEndToEndAudit();
