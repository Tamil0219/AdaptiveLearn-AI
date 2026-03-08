const http = require('http');

const data = JSON.stringify({
  question: 'Explain Artificial Intelligence in detail',
  studentAnswer: 'Artificial intelligence is the simulation of human intelligence processes by computer systems. Machine learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. Deep learning uses neural networks with multiple layers to process data. AI applications include natural language processing, computer vision, robotics, expert systems, and predictive analytics. The field originated in the 1950s and has evolved significantly with advances in computing power and big data. Modern AI systems use techniques like supervised learning, unsupervised learning, and reinforcement learning to solve complex problems effectively.',
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
