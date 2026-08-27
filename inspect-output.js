const http = require('http');

async function testUrl(target) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ url: target });
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/investigate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });
    req.write(postData);
    req.end();
  });
}

async function runDetailedInspection() {
  const result = await testUrl('https://example.com');
  console.log('--- DETAILED INSPECTION RESULT FOR example.com ---');
  console.log('Status:', result.status);
  console.log('Success:', result.body.success);
  console.log('Case ID:', result.body.data.caseId);
  console.log('Overall Health Score:', result.body.data.overallHealthScore);
  console.log('Category Scores:', JSON.stringify(result.body.data.categoryScores));
  console.log('Metrics:', JSON.stringify(result.body.data.metrics));
  console.log('Resource Breakdown:', JSON.stringify(result.body.data.resourceBreakdown));
  console.log(`Faults Detected (${result.body.data.faults.length}):`);
  result.body.data.faults.forEach((f, i) => {
    console.log(`  ${i + 1}. [${f.impact}] ${f.id} - ${f.title} (${f.category})`);
    console.log(`     Recommendation: ${f.recommendation}`);
    if (f.clueCode) console.log(`     Clue: ${f.clueCode.replace(/\n/g, ' ')}`);
  });
}

runDetailedInspection();
