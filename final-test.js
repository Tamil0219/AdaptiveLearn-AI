const http = require('http');

const tests = [
  {
    name: '📊 Test 1: Very Short Answer',
    data: {
      question: 'What is AI?',
      studentAnswer: 'Smart machines',
      studentId: '507f1f77bcf86cd799439011',
      evaluationId: '507f1f77bcf86cd799439012'
    }
  },
  {
    name: '📊 Test 2: Medium Answer (20-60 words)',
    data: {
      question: 'Explain artificial intelligence',
      studentAnswer: 'Artificial intelligence is a technology that enables computers to learn from data and make intelligent decisions. It uses machine learning and deep learning techniques to analyze patterns.',
      studentId: '507f1f77bcf86cd799439011',
      evaluationId: '507f1f77bcf86cd799439012'
    }
  },
  {
    name: '📊 Test 3: Long Detailed Answer (60+ words)',
    data: {
      question: 'Explain artificial intelligence comprehensively',
      studentAnswer: 'Artificial intelligence is the simulation of human intelligence by machines. It encompasses machine learning where systems learn from data patterns, deep learning which uses neural networks with multiple layers, and natural language processing for understanding text. AI is applied in robotics, computer vision, expert systems, recommendation engines, autonomous vehicles, and many other domains. Modern AI systems use supervised learning, unsupervised learning, and reinforcement learning algorithms to solve complex problems effectively and efficiently.',
      studentId: '507f1f77bcf86cd799439011',
      evaluationId: '507f1f77bcf86cd799439012'
    }
  }
];

let completed = 0;

tests.forEach((test) => {
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
      const response = JSON.parse(body);
      console.log(`\n${test.name}`);
      console.log(`Status: ${res.statusCode}`);
      console.log(`Score: ${response.score}/10`);
      console.log(`Feedback: ${response.feedback}`);
      console.log(`Saved: ${response.resultId}`);
      completed++;
      if (completed === tests.length) {
        console.log('\n✅ All tests completed successfully!\n');
        process.exit(0);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ ${test.name} - Error: ${e.message}`);
    completed++;
    if (completed === tests.length) process.exit(1);
  });

  req.write(data);
  req.end();
});
