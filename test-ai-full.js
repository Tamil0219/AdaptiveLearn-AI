const http = require('http');

const testCases = [
  {
    name: 'Short Answer',
    data: {
      question: "What is Artificial Intelligence?",
      studentAnswer: "AI is smart machines",
      studentId: "507f1f77bcf86cd799439011",
      evaluationId: "507f1f77bcf86cd799439012"
    }
  },
  {
    name: 'Medium Answer (20-60 words)',
    data: {
      question: "Explain what Artificial Intelligence is",
      studentAnswer: "Artificial intelligence is technology that enables computers to learn from data. It uses machine learning algorithms to recognize patterns in information and make intelligent decisions. AI is changing industries worldwide.",
      studentId: "507f1f77bcf86cd799439011",
      evaluationId: "507f1f77bcf86cd799439012"
    }
  },
  {
    name: 'Long Answer (60+ words)',
    data: {
      question: "Explain Artificial Intelligence comprehensively",
      studentAnswer: "Artificial intelligence is the simulation of human intelligence processes by computer systems. Machine learning is a subset that enables systems to learn from data. Deep learning uses neural networks with multiple layers. AI applications include natural language processing, computer vision, robotics, and expert systems. The field originated in the 1950s and has evolved significantly with advances in computing power and big data technology.",
      studentId: "507f1f77bcf86cd799439011",
      evaluationId: "507f1f77bcf86cd799439012"
    }
  }
];

let completed = 0;

const runTest = (testCase) => {
  const jsonData = JSON.stringify(testCase.data);

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
        console.log(`\n📊 Test: ${testCase.name}`);
        console.log(`Status: ${res.statusCode}`);
        if (response.success) {
          console.log(`Score: ${response.score}/10`);
          console.log(`Feedback: ${response.feedback}`);
        } else {
          console.log(`Error: ${response.message}`);
        }
      } catch (e) {
        console.error(`Error in test ${testCase.name}:`, e.message);
      }
      
      completed++;
      if (completed === testCases.length) {
        console.log('\n✅ All tests completed!\n');
        process.exit(0);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Error in test ${testCase.name}:`, e.message);
    completed++;
    if (completed === testCases.length) process.exit(1);
  });

  req.write(jsonData);
  req.end();
};

console.log('🧪 Running AI Evaluation Tests...\n');
testCases.forEach(runTest);
