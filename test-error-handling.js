const http = require('http');

const errorTests = [
  {
    name: 'Missing Question Field',
    path: '/api/ai/evaluate',
    method: 'POST',
    data: { studentAnswer: 'Test answer' }
  },
  {
    name: 'Missing Answer Field',
    path: '/api/ai/evaluate',
    method: 'POST',
    data: { question: 'What is AI?' }
  },
  {
    name: 'Empty Answer',
    path: '/api/ai/evaluate',
    method: 'POST',
    data: { question: 'What is AI?', studentAnswer: '' }
  },
  {
    name: 'Null Question',
    path: '/api/ai/evaluate',
    method: 'POST',
    data: { question: null, studentAnswer: 'Test' }
  },
  {
    name: 'Valid Request',
    path: '/api/ai/evaluate',
    method: 'POST',
    data: { question: 'What is AI?', studentAnswer: 'AI is a technology that enables machines to learn and make intelligent decisions.' }
  }
];

let completed = 0;

const runTest = (test) => {
  const jsonData = JSON.stringify(test.data);

  const options = {
    hostname: 'localhost',
    port: process.env.PORT || 5000,
    path: test.path,
    method: test.method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': jsonData.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    
    res.on('data', (chunk) => {
      body += chunk;
    });
    
    res.on('end', () => {
      console.log(`\n📋 Test: ${test.name}`);
      console.log(`   Status: ${res.statusCode}`);
      
      try {
        const parsed = JSON.parse(body);
        if (parsed.success === false) {
          console.log(`   ⚠️  Error: ${parsed.message}`);
        } else {
          console.log(`   ✓ Success: ${parsed.message || 'Request processed'}`);
        }
      } catch (e) {
        console.log(`   Response: ${body.substring(0, 60)}`);
      }
      
      completed++;
      if (completed === errorTests.length) {
        console.log('\n✅ Error handling tests completed!\n');
        process.exit(0);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`\n❌ ${test.name} - Connection Error: ${e.message}\n`);
    completed++;
    if (completed === errorTests.length) process.exit(1);
  });

  req.write(jsonData);
  req.end();
};

console.log('🧪 Testing Error Handling & Validation...\n');
errorTests.forEach(runTest);
