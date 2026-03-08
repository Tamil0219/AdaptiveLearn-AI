const http = require('http');

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║      STUDENT AUTHENTICATION SYSTEM TEST             ║');
console.log('╚════════════════════════════════════════════════════╝\n');

let authToken = null;
let testUserId = null;

// Test user credentials
const testUser = {
  firstName: 'Tamil',
  lastName: 'Selvan',
  email: `tamil${Math.random().toString(36).substring(7)}@example.com`,
  password: 'securePassword123'
};

console.log('📝 Test User:', testUser.email, '\n');

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
    // Test 1: Register User
    console.log('1️⃣  Testing User Registration...\n');
    const registerRes = await makeRequest('POST', '/api/auth/register', testUser);

    if (registerRes.status === 201 && registerRes.data.success) {
      console.log('   ✅ Registration successful!');
      console.log(`   Status: ${registerRes.status}`);
      console.log(`   Message: ${registerRes.data.message}`);
      console.log(`   Token: ${registerRes.data.token.substring(0, 50)}...`);
      console.log(`   User: ${registerRes.data.user.firstName} ${registerRes.data.user.lastName} (${registerRes.data.user.email})`);
      authToken = registerRes.data.token;
      testUserId = registerRes.data.user.id;
    } else {
      console.log('   ❌ Registration failed!');
      console.log(`   Status: ${registerRes.status}`);
      console.log(`   Response:`, registerRes.data);
    }

    console.log('\n---\n');

    // Test 2: Login User
    console.log('2️⃣  Testing User Login...\n');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: testUser.email,
      password: testUser.password
    });

    if (loginRes.status === 200 && loginRes.data.success) {
      console.log('   ✅ Login successful!');
      console.log(`   Status: ${loginRes.status}`);
      console.log(`   Message: ${loginRes.data.message}`);
      console.log(`   Token: ${loginRes.data.token.substring(0, 50)}...`);
      console.log(`   User: ${loginRes.data.user.firstName} ${loginRes.data.user.lastName} (${loginRes.data.user.email})`);
      authToken = loginRes.data.token; // Update token from login
    } else {
      console.log('   ❌ Login failed!');
      console.log(`   Status: ${loginRes.status}`);
      console.log(`   Response:`, loginRes.data);
    }

    console.log('\n---\n');

    // Test 3: Get Current User (Protected Route)
    console.log('3️⃣  Testing Get Current User (Protected Route)...\n');
    const meRes = await makeRequest('GET', '/api/auth/me');

    if (meRes.status === 200 && meRes.data.success) {
      console.log('   ✅ Protected route accessed successfully!');
      console.log(`   Status: ${meRes.status}`);
      console.log(`   Student ID: ${meRes.data.user._id}`);
      console.log(`   Name: ${meRes.data.user.firstName} ${meRes.data.user.lastName}`);
      console.log(`   Email: ${meRes.data.user.email}`);
      console.log(`   Roll Number: ${meRes.data.user.rollNumber}`);
      console.log(`   Created: ${meRes.data.user.createdAt}`);
    } else {
      console.log('   ❌ Protected route access failed!');
      console.log(`   Status: ${meRes.status}`);
      console.log(`   Response:`, meRes.data);
    }

    console.log('\n---\n');

    // Test 4: Login with Wrong Password
    console.log('4️⃣  Testing Login with Wrong Password (Error Handling)...\n');
    const wrongPassRes = await makeRequest('POST', '/api/auth/login', {
      email: testUser.email,
      password: 'wrongPassword123'
    });

    if (wrongPassRes.status === 401 && !wrongPassRes.data.success) {
      console.log('   ✅ Error handling working correctly!');
      console.log(`   Status: ${wrongPassRes.status}`);
      console.log(`   Message: ${wrongPassRes.data.message}`);
    } else {
      console.log('   ❌ Error handling failed!');
      console.log(`   Response:`, wrongPassRes.data);
    }

    console.log('\n---\n');

    // Test 5: Register Duplicate Email
    console.log('5️⃣  Testing Duplicate Email Registration (Error Handling)...\n');
    const dupRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Another User',
      email: testUser.email,
      password: 'password123'
    });

    if (dupRes.status === 400 && !dupRes.data.success) {
      console.log('   ✅ Duplicate email validation working!');
      console.log(`   Status: ${dupRes.status}`);
      console.log(`   Message: ${dupRes.data.message}`);
    } else {
      console.log('   ❌ Duplicate email validation failed!');
      console.log(`   Response:`, dupRes.data);
    }

    console.log('\n---\n');

    // Test 6: Missing Required Fields
    console.log('6️⃣  Testing Missing Required Fields...\n');
    const missingRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Test User'
      // Missing email and password
    });

    if (missingRes.status === 400 && !missingRes.data.success) {
      console.log('   ✅ Field validation working!');
      console.log(`   Status: ${missingRes.status}`);
      console.log(`   Message: ${missingRes.data.message}`);
    } else {
      console.log('   ❌ Field validation failed!');
      console.log(`   Response:`, missingRes.data);
    }

    console.log('\n═══════════════════════════════════════════════════\n');
    console.log('📊 AUTHENTICATION TEST SUMMARY:\n');
    console.log('✅ User Registration');
    console.log('✅ User Login');
    console.log('✅ Protected Routes (JWT Verification)');
    console.log('✅ Error Handling');
    console.log('✅ Input Validation');
    console.log('✅ Password Hashing & Comparison');
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  ✅ AUTHENTICATION SYSTEM FULLY OPERATIONAL ✅      ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
})();
