const http = require('http');

const data = JSON.stringify({
  question: 'What is AI',
  studentAnswer: 'AI is smart machines.',
  studentId: '507f1f77bcf86cd799439011',
  evaluationId: '507f1f77bcf86cd799439012'
});

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
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(body));
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
