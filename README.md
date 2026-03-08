# SmartEvalAI Backend

Professional Education Assessment Platform Backend built with Node.js, Express, and MongoDB.

## 📋 Project Structure

```
smart education/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── models/
│   │   ├── Student.js           # Student schema and methods
│   │   └── Admin.js             # Admin schema and methods
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   └── routes/
│       └── authRoutes.js        # Auth routes
├── index.js                      # Main server entry point
├── package.json                  # Dependencies & scripts
├── .env                          # Environment variables (development)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14+)
- **MongoDB** (running locally on port 27017)
- **npm**

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - CORS handling
- `dotenv` - Environment variables
- `nodemon` - Development auto-reload

### 2. Configure Environment

The `.env` file is pre-configured for development:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smarteval-ai
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_minimum_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**Change `JWT_SECRET` in production!**

### 3. Ensure MongoDB is Running

```bash
# Windows (if installed with MongoDB installer)
mongod

# Or use MongoDB Atlas cloud instead
```

### 4. Start the Server

**Development (with auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server will run on `http://localhost:5000`

## 📡 API Endpoints

### Health Check

```
GET /api/health
```

### Student Authentication

#### Register Student
```
POST /api/auth/student/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "rollNumber": "CS001",
  "grade": "10A",
  "section": "A"
}

Response: 201 Created
{
  "success": true,
  "message": "Student registered successfully",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

#### Login Student
```
POST /api/auth/student/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### Admin Authentication

#### Register Admin
```
POST /api/auth/admin/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "designation": "Teacher",
  "role": "teacher"
}

Response: 201 Created
```

#### Login Admin
```
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123"
}

Response: 200 OK
```

### Protected Routes

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User registers/logs in
2. Server returns a JWT token
3. Client sends token in `Authorization: Bearer <token>` header
4. Server verifies token and grants access

Tokens expire after **7 days**.

## 🎯 Middleware

### Authentication Middleware (`protect`)
Verifies JWT token and attaches user info to request:
```javascript
app.get('/protected-route', protect, controller);
```

### Role-Based Middleware
```javascript
app.post('/admin-route', protect, isAdmin, controller);
app.post('/student-route', protect, isStudent, controller);
app.post('/super-admin-route', protect, isSuperAdmin, controller);
```

## 📊 Database Models

### Student Schema

- Basic Info: firstName, lastName, email
- Academic: rollNumber, grade, section
- Auth: password (hashed), isActive, isVerified
- Stats: totalAssessmentsTaken, averageScore
- Timestamps: createdAt, updatedAt, lastLogin

### Admin Schema

- Basic Info: firstName, lastName, email
- Professional: employeeId, department, designation
- Auth: password (hashed), isActive, isVerified
- Role: role (teacher/admin/super_admin)
- Permissions: granular permission control
- Stats: totalAssessmentsCreated, totalStudentsManaged

## 🔑 Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `NODE_ENV` | development | Environment |
| `MONGODB_URI` | mongodb://localhost:27017/smarteval-ai | Database URL |
| `JWT_SECRET` | secret_key_here | JWT signing secret |
| `JWT_EXPIRE` | 7d | Token expiration |
| `CORS_ORIGIN` | http://localhost:3000 | Frontend URL |

## 🛠 Development

### Project Scripts

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

### Code Organization

- **Models**: Database schemas with methods
- **Controllers**: Business logic
- **Routes**: API endpoints
- **Middleware**: Request processing
- **Config**: Configuration files

## 🔒 Security Features

✓ Password hashing with bcryptjs
✓ JWT token-based authentication
✓ CORS configuration
✓ Input validation
✓ Error handling
✓ Protected routes
✓ Rate limiting ready (add express-rate-limit)
✓ Field selection (hide password by default)

## 📝 Error Handling

All API responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## 🚀 Production Deployment

Before deploying:

1. ✅ Change `JWT_SECRET` to a strong random string
2. ✅ Set `NODE_ENV=production`
3. ✅ Use MongoDB Atlas or secure MongoDB instance
4. ✅ Configure `CORS_ORIGIN` to your frontend domain
5. ✅ Add rate limiting (optional)
6. ✅ Enable HTTPS
7. ✅ Set up logging
8. ✅ Configure monitoring

## 📚 Next Steps

To extend this project:

1. **Assessment Routes** - Create, read, update, delete assessments
2. **Submission Routes** - Student submissions and grading
3. **Report Routes** - Analytics and performance reports
4. **Notification System** - Email/push notifications
5. **File Upload** - Question images/documents
6. **Caching** - Redis for performance
7. **Testing** - Jest/Mocha test suite
8. **API Documentation** - Swagger/OpenAPI

## 🤝 Contributing

Follow these standards:
- Consistent error responses
- Input validation
- Error handling in try-catch
- Comments for complex logic
- Index database queries

## 📄 License

MIT License - See LICENSE file

## 💬 Support

For issues or questions, refer to the code comments or contact the development team.

---

**Happy Coding!** 🚀

Built with ❤️ for SmartEvalAI
