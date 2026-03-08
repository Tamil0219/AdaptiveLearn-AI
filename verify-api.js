const http = require('http');

const testRequests = [
  {
    name: 'Test 1: Short answer',
    data: { question: 'What is AI?', studentAnswer: 'AI is smart', studentId: 'user1', evaluationId: 'eval1' }
  },
  {
    name: 'Test 2: Medium answer',
    data: { question: 'Explain AI', studentAnswer: 'AI is artificial intelligence that can learn and solve problems using various techniques and algorithms', studentId: 'user2', evaluationId: 'eval2' }
  }
];

let completed = 0;

testRequests.forEach((test) => {
  const data = JSON.stringify(test.data);
  
  const options = {
    hostname: 'localhost',
    port: process.env.PORT || 5000,
    path: '/api/ai/evaluate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      console.log(`\n${test.name}:`);
      console.log(`Status: ${res.statusCode}`);
      console.log('Response:', JSON.parse(body));
      completed++;
      if (completed === testRequests.length) process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error(`${test.name} - Error: ${e.message}`);
    completed++;
    if (completed === testRequests.length) process.exit(0);
  });

  req.write(data);
  req.end();
});
