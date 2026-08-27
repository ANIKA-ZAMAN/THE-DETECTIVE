const http = require('http');

async function makeRequest(url, method = 'POST', body = null) {
  return new Promise((resolve) => {
    const postData = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/investigate',
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 15000,
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

async function runSuite() {
  console.log('--- RUNNING PERFORMANCE DETECTIVE TEST SUITE ---\n');

  const testCases = [
    {
      name: '1. Standard URL (example.com)',
      method: 'POST',
      body: { url: 'https://example.com' },
      validate: (r) => r.status === 200 && r.data.success === true && r.data.data.overallHealthScore > 0,
    },
    {
      name: '2. Auto-normalized bare domain (example.com without protocol)',
      method: 'POST',
      body: { url: 'example.com' },
      validate: (r) => r.status === 200 && r.data.success === true && r.data.data.normalizedUrl === 'https://example.com',
    },
    {
      name: '3. Empty URL string',
      method: 'POST',
      body: { url: '' },
      validate: (r) => r.status === 400 && r.data.success === false && r.data.code === 'EMPTY',
    },
    {
      name: '4. Missing URL property in payload',
      method: 'POST',
      body: {},
      validate: (r) => r.status === 400 && r.data.success === false,
    },
    {
      name: '5. Dangerous protocol (file://)',
      method: 'POST',
      body: { url: 'file:///etc/passwd' },
      validate: (r) => r.status === 400 && r.data.success === false && r.data.code === 'BLOCKED_PROTOCOL',
    },
    {
      name: '6. SSRF Protection: localhost blocked',
      method: 'POST',
      body: { url: 'http://localhost:3000' },
      validate: (r) => r.status === 400 && r.data.success === false && r.data.code === 'BLOCKED_HOST',
    },
    {
      name: '7. SSRF Protection: Private IPv4 blocked (127.0.0.1)',
      method: 'POST',
      body: { url: 'http://127.0.0.1:8080' },
      validate: (r) => r.status === 400 && r.data.success === false && r.data.code === 'BLOCKED_HOST',
    },
    {
      name: '8. SSRF Protection: Private Class C IPv4 blocked (192.168.1.1)',
      method: 'POST',
      body: { url: 'http://192.168.1.1' },
      validate: (r) => r.status === 400 && r.data.success === false && r.data.code === 'BLOCKED_HOST',
    },
    {
      name: '9. Unreachable / non-existent domain graceful diagnostic',
      method: 'POST',
      body: { url: 'https://domainthatdefinitelydoesnotexistxyz999.org' },
      validate: (r) => r.status === 200 && r.data.success === true && r.data.data.faults.some(f => f.id === 'FLT-NET-01'),
    },
    {
      name: '10. HTTP Method check (GET should return 405)',
      method: 'GET',
      body: null,
      validate: (r) => r.status === 405 && r.data.success === false && r.data.code === 'METHOD_NOT_ALLOWED',
    },
  ];

  let passed = 0;
  for (const tc of testCases) {
    const res = await makeRequest(tc.body?.url, tc.method, tc.body);
    const ok = tc.validate(res);
    if (ok) {
      passed++;
      console.log(`✅ [PASS] ${tc.name}`);
    } else {
      console.log(`❌ [FAIL] ${tc.name}`);
      console.log('   Response:', JSON.stringify(res, null, 2));
    }
  }

  console.log(`\nResults: ${passed}/${testCases.length} tests passed.`);
  process.exit(passed === testCases.length ? 0 : 1);
}

runSuite();
