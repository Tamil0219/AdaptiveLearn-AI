const http = require('http');

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║           EXAM MANAGEMENT SYSTEM TEST              ║');
console.log('╚════════════════════════════════════════════════════╝\n');

let authToken = null;
let testExamId = null;

// Test exam data
const testExam = {
  title: 'AI Fundamentals Test',
  description: 'Basic AI knowledge exam',
  duration: 60,
  totalMarks: 100
};

// Test question data
const testQuestion = {
  questionText: 'What is Artificial Intelligence?',
  options: [
    'Machine Learning',
    'Simulation of human intelligence',
    'Database system',
    'Operating system'
  ],
  correctAnswer: 'Simulation of human intelligence',
  difficultyLevel: 'easy'
};

console.log('📝 Test Exam:', testExam.title);
console.log('📝 Test Question:', testQuestion.questionText, '\n');

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      resolve({ status: 0, error: e.message });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Run tests
(async () => {
  try {
    // First, register and login to get auth token
    console.log('🔐 Setting up authentication...\n');

    const testUser = {
      name: 'Test Teacher',
      email: `teacher${Math.random().toString(36).substring(7)}@example.com`,
      password: 'testPassword123',
      role: 'teacher'
    };

    // Register
    const registerRes = await makeRequest('POST', '/api/auth/register', testUser);
    if (registerRes.status === 201) {
      console.log('   ✅ User registered');
      authToken = registerRes.data.token;
    } else {
      console.log('   ❌ Registration failed:', registerRes.data);
      return;
    }

    console.log('\n---\n');

    // Test 1: Create Exam
    console.log('1️⃣  Testing Exam Creation...\n');
    const createExamRes = await makeRequest('POST', '/api/exams/create', testExam);

    if (createExamRes.status === 201 && createExamRes.data.success) {
      console.log('   ✅ Exam created successfully!');
      console.log(`   Status: ${createExamRes.status}`);
      console.log(`   Message: ${createExamRes.data.message}`);
      console.log(`   Exam ID: ${createExamRes.data.exam._id}`);
      console.log(`   Title: ${createExamRes.data.exam.title}`);
      console.log(`   Duration: ${createExamRes.data.exam.duration} minutes`);
      console.log(`   Total Marks: ${createExamRes.data.exam.totalMarks}`);
      testExamId = createExamRes.data.exam._id;
    } else {
      console.log('   ❌ Exam creation failed!');
      console.log(`   Status: ${createExamRes.status}`);
      console.log(`   Response:`, createExamRes.data);
    }

    console.log('\n---\n');

    // Test 2: Add Question to Exam
    if (testExamId) {
      console.log('2️⃣  Testing Add Question...\n');
      const addQuestionRes = await makeRequest('POST', `/api/exams/${testExamId}/add-question`, testQuestion);

      if (addQuestionRes.status === 201 && addQuestionRes.data.success) {
        console.log('   ✅ Question added successfully!');
        console.log(`   Status: ${addQuestionRes.status}`);
        console.log(`   Message: ${addQuestionRes.data.message}`);
        console.log(`   Question: ${addQuestionRes.data.question.questionText}`);
        console.log(`   Options: ${addQuestionRes.data.question.options.length}`);
        console.log(`   Difficulty: ${addQuestionRes.data.question.difficultyLevel}`);
      } else {
        console.log('   ❌ Add question failed!');
        console.log(`   Status: ${addQuestionRes.status}`);
        console.log(`   Response:`, addQuestionRes.data);
      }

      console.log('\n---\n');
    }

    // Test 3: Get All Exams
    console.log('3️⃣  Testing Get All Exams...\n');
    const getExamsRes = await makeRequest('GET', '/api/exams');

    if (getExamsRes.status === 200 && getExamsRes.data.success) {
      console.log('   ✅ Get exams successful!');
      console.log(`   Status: ${getExamsRes.status}`);
      console.log(`   Total Exams: ${getExamsRes.data.count}`);
      if (getExamsRes.data.exams.length > 0) {
        console.log(`   Latest Exam: ${getExamsRes.data.exams[0].title}`);
      }
    } else {
      console.log('   ❌ Get exams failed!');
      console.log(`   Status: ${getExamsRes.status}`);
      console.log(`   Response:`, getExamsRes.data);
    }

    console.log('\n---\n');

    // Test 4: Get Exam Questions
    if (testExamId) {
      console.log('4️⃣  Testing Get Exam Questions...\n');
      const getQuestionsRes = await makeRequest('GET', `/api/exams/${testExamId}/questions`);

      if (getQuestionsRes.status === 200 && getQuestionsRes.data.success) {
        console.log('   ✅ Get questions successful!');
        console.log(`   Status: ${getQuestionsRes.status}`);
        console.log(`   Exam: ${getQuestionsRes.data.exam.title}`);
        console.log(`   Total Questions: ${getQuestionsRes.data.count}`);
        if (getQuestionsRes.data.questions.length > 0) {
          console.log(`   First Question: ${getQuestionsRes.data.questions[0].questionText}`);
        }
      } else {
        console.log('   ❌ Get questions failed!');
        console.log(`   Status: ${getQuestionsRes.status}`);
        console.log(`   Response:`, getQuestionsRes.data);
      }
    }

    console.log('\n🎉 Exam Management System Test Complete!\n');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
})();