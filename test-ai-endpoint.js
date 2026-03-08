const http = require('http');

const testData = {
  question: "What is AI?",
  studentAnswer: "Artificial intelligence is the simulation of human intelligence by machines.",
  studentId: "507f1f77bcf86cd799439011",
  evaluationId: "507f1f77bcf86cd799439012"
};

const jsonData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/ai/evaluate',
  method: 'POST',
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
    try {
      const response = JSON.parse(body);
      console.log('\n✅ AI Evaluation Test Results:');
      console.log('Status Code:', res.statusCode);
      console.log('\nResponse:');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('\n✓ Endpoint is working correctly!');
        console.log(`✓ Score: ${response.score}/10`);
        console.log(`✓ Feedback: ${response.feedback}`);
        console.log(`✓ Result saved with ID: ${response.resultId}`);
      }
    } catch (e) {
      console.error('Error parsing response:', e.message);
      console.log('Raw response:', body);
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});

console.log('📝 Testing AI Evaluation Endpoint...');
console.log(`Sending request to: POST http://localhost:${process.env.PORT || 5000}/api/ai/evaluate`);
console.log('Test data:', testData);

req.write(jsonData);
req.end();
