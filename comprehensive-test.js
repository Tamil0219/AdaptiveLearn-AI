const http = require('http');

console.log('🚀 SMARTEVALAI BACKEND - COMPREHENSIVE TEST SUITE\n');
console.log('═'.repeat(50));

const comprehensiveTests = [
  {
    category: 'Root & Health',
    tests: [
      { name: 'Root Route', method: 'GET', path: '/', expectedCode: 200 },
      { name: 'Health Check API', method: 'GET', path: '/api/health', expectedCode: 200 }
    ]
  },
  {
    category: 'AI Evaluation - Scoring Tiers',
    tests: [
      { 
        name: 'Short Answer (Score: 1-3)', 
        method: 'POST', 
        path: '/api/ai/evaluate', 
        data: { question: 'What is AI?', studentAnswer: 'Smart machines' },
        expectedCode: 201
      },
      { 
        name: 'Medium Answer (Score: 6)', 
        method: 'POST', 
        path: '/api/ai/evaluate', 
        data: { question: 'Explain AI', studentAnswer: 'Artificial intelligence is technology that enables computers to learn and make decisions from data using various algorithms and techniques.' },
        expectedCode: 201
      },
      { 
        name: 'Long Answer (Score: 9)', 
        method: 'POST', 
        path: '/api/ai/evaluate', 
        data: { question: 'Explain AI comprehensively', studentAnswer: 'Artificial intelligence is the simulation of human intelligence by machines. Machine learning enables systems to learn from experience. Deep learning uses neural networks. AI includes natural language processing, computer vision, robotics, and expert systems. The field has evolved significantly since the 1950s with modern applications in healthcare, finance, transportation, and education.' },
        expectedCode: 201
      }
    ]
  },
  {
    category: 'Error Handling',
    tests: [
      { 
        name: 'Missing Question', 
        method: 'POST', 
        path: '/api/ai/evaluate', 
        data: { studentAnswer: 'answer' },
        expectedCode: 400
      },
      { 
        name: 'Missing Answer', 
        method: 'POST', 
        path: '/api/ai/evaluate', 
        data: { question: 'question' },
        expectedCode: 400
      },
      { 
        name: 'Route Not Found (404)', 
        method: 'GET', 
        path: '/api/nonexistent', 
        expectedCode: 404
      }
    ]
  }
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

const runTest = (test, callback) => {
  const isPost = test.method === 'POST';
  const jsonData = isPost ? JSON.stringify(test.data || {}) : null;

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
      totalTests++;
      const passed = res.statusCode === test.expectedCode;
      
      if (passed) {
        passedTests++;
        console.log(`  ✅ ${test.name} [${res.statusCode}]`);
      } else {
        failedTests++;
        console.log(`  ❌ ${test.name} [Expected: ${test.expectedCode}, Got: ${res.statusCode}]`);
      }
      
      callback();
    });
  });

  req.on('error', (e) => {
    totalTests++;
    failedTests++;
    console.log(`  ❌ ${test.name} - Connection Error: ${e.message}`);
    callback();
  });

  if (isPost) req.write(jsonData);
  req.end();
};

// Run all tests sequentially
let currentCategory = 0;
let currentTest = 0;

const runNext = () => {
  if (currentCategory >= comprehensiveTests.length) {
    console.log('\n' + '═'.repeat(50));
    console.log(`\n📊 TEST SUMMARY:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    
    if (failedTests === 0) {
      console.log(`\n🎉 ALL TESTS PASSED! SmartEvalAI Backend is working perfectly!\n`);
    } else {
      console.log(`\n⚠️  ${failedTests} test(s) failed. Please review.\n`);
    }
    process.exit(failedTests > 0 ? 1 : 0);
    return;
  }

  const category = comprehensiveTests[currentCategory];
  
  if (currentTest === 0) {
    console.log(`\n${category.category}:`);
  }

  if (currentTest >= category.tests.length) {
    currentCategory++;
    currentTest = 0;
    runNext();
    return;
  }

  const test = category.tests[currentTest];
  currentTest++;
  runTest(test, runNext);
};

runNext();
