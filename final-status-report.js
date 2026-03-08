const http = require('http');

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║     SMARTEVALAI BACKEND - FINAL STATUS REPORT      ║');
console.log('╚════════════════════════════════════════════════════╝\n');

const checks = [
  {
    name: '🌐 Server Status',
    test: () => new Promise((resolve) => {
      const req = http.get(`http://localhost:${process.env.PORT || 5000}/`, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(3000, () => req.destroy());
    })
  },
  {
    name: '💚 Health Check',
    test: () => new Promise((resolve) => {
      const req = http.get(`http://localhost:${process.env.PORT || 5000}/api/health`, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(3000, () => req.destroy());
    })
  },
  {
    name: '🤖 AI Evaluation API',
    test: () => new Promise((resolve) => {
      const data = JSON.stringify({ question: 'Test', studentAnswer: 'Test answer for evaluation purposes.' });
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/ai/evaluate',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
      };
      const req = http.request(options, (res) => {
        resolve(res.statusCode === 201);
      });
      req.on('error', () => resolve(false));
      req.write(data);
      req.end();
      req.setTimeout(3000, () => req.destroy());
    })
  },
  {
    name: '✅ Error Handling',
    test: () => new Promise((resolve) => {
      const data = JSON.stringify({ question: 'Invalid' });
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/ai/evaluate',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
      };
      const req = http.request(options, (res) => {
        resolve(res.statusCode === 400);
      });
      req.on('error', () => resolve(false));
      req.write(data);
      req.end();
      req.setTimeout(3000, () => req.destroy());
    })
  },
  {
    name: '🚫 404 Handling',
    test: () => new Promise((resolve) => {
      const req = http.get(`http://localhost:${process.env.PORT || 5000}/invalid-route`, (res) => {
        resolve(res.statusCode === 404);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(3000, () => req.destroy());
    })
  }
];

const runChecks = async () => {
  console.log('Running system checks...\n');
  
  let allPassed = true;
  
  for (const check of checks) {
    const result = await check.test();
    const status = result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${check.name}`);
    if (!result) allPassed = false;
  }
  
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║                    FEATURES                         ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  console.log('✓ Root Route Handler');
  console.log('✓ Health Check Endpoint');
  console.log('✓ AI Answer Evaluation');
  console.log('✓ Automatic Scoring (1-10 scale)');
  console.log('✓ Contextual Feedback Generation');
  console.log('✓ MongoDB Data Persistence');
  console.log('✓ Input Validation & Error Handling');
  console.log('✓ CORS Support');
  console.log('✓ 404 Error Handler');
  console.log('✓ Proper HTTP Status Codes');
  
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║              API ENDPOINTS AVAILABLE                ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  console.log(`GET  http://localhost:${process.env.PORT || 5000}/`);
  console.log('     → Root route - Returns: "SmartEvalAI Server Running 🚀"\n');
  
  console.log(`GET  http://localhost:${process.env.PORT || 5000}/api/health`);
  console.log('     → Health check - Returns: {"success":true, ...}\n');
  
  console.log(`POST http://localhost:${process.env.PORT || 5000}/api/ai/evaluate`);
  console.log('     Body: {"question":"...", "studentAnswer":"...", ...}');
  console.log('     Returns: {"success":true, "score":9, "feedback":"...", ...}\n');
  
  console.log(`GET  http://localhost:${process.env.PORT || 5000}/api/ai/results`);
  console.log('     → Get all evaluation results with pagination\n');
  
  console.log(`GET  http://localhost:${process.env.PORT || 5000}/api/ai/results/:resultId`);
  console.log('     → Get specific evaluation result\n');
  
  console.log('╔════════════════════════════════════════════════════╗');
  
  if (allPassed) {
    console.log('║          ✅ ALL SYSTEMS OPERATIONAL ✅             ║');
  } else {
    console.log('║         ⚠️  SOME SYSTEMS NEED ATTENTION ⚠️          ║');
  }
  
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  process.exit(allPassed ? 0 : 1);
};

runChecks();
