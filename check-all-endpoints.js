const http = require('http');

const tests = [
  { name: 'Root Route', method: 'GET', path: '/', data: null },
  { name: 'Health Check', method: 'GET', path: '/api/health', data: null },
  { name: 'AI Evaluate', method: 'POST', path: '/api/ai/evaluate', data: { question: 'What is AI?', studentAnswer: 'Artificial intelligence is the simulation of human intelligence by machines.' } },
  { name: '404 Test', method: 'GET', path: '/nonexistent', data: null }
];

let completed = 0;

const runTest = (test) => {
  const isPost = test.method === 'POST';
  const jsonData = isPost ? JSON.stringify(test.data) : null;

  const options = {
    hostname: 'localhost',
    port: process.env.PORT || 5000,
    path: test.path,
    method: test.method,
    headers: {
      'Content-Type': 'application/json',
      ...(isPost && { 'Content-Length': jsonData.length })
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log(`\n✓ ${test.name}`);
      console.log(`  Status: ${res.statusCode}`);
      
      try {
        const parsed = JSON.parse(body);
        console.log(`  Response: ${JSON.stringify(parsed).substring(0, 80)}`);
      } catch (e) {
        console.log(`  Response: ${body.substring(0, 80)}`);
      }
      
      completed++;
      if (completed === tests.length) {
        console.log('\n✅ All endpoint tests completed!\n');
        process.exit(0);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`\n❌ ${test.name} - Error: ${e.message}\n`);
    completed++;
    if (completed === tests.length) process.exit(1);
  });

  if (isPost) req.write(jsonData);
  req.end();
};

console.log('🔍 Checking all endpoints for errors...\n');
tests.forEach(runTest);
