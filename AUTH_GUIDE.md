# SmartEvalAI Authentication API - Usage Guide

## 📊 System Overview

Your SmartEvalAI backend includes a **complete student authentication system** with:

✅ User registration with password hashing (bcryptjs)  
✅ Secure login with JWT token generation  
✅ Protected routes with JWT verification  
✅ Password comparison and validation  
✅ MongoDB persistence  
✅ Error handling and validation  

---

## 🚀 Quick Start

### Start the Server

```bash
npm run dev
```

The server will run on: `http://localhost:5000`

---

## 📝 API Endpoints

### 1. Register User

**Endpoint:**
```
POST http://localhost:5000/api/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Tamil Selvan",
  "email": "tamil@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Tamil Selvan",
    "email": "tamil@example.com",
    "role": "student"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 2. Login User

**Endpoint:**
```
POST http://localhost:5000/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "tamil@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Tamil Selvan",
    "email": "tamil@example.com",
    "role": "student"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User (Protected Route)

**Endpoint:**
```
GET http://localhost:5000/api/auth/me
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Replace `<JWT_TOKEN>` with the token from login/register response**

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Tamil Selvan",
    "email": "tamil@example.com",
    "role": "student",
    "createdAt": "2026-03-06T14:26:13.981Z",
    "updatedAt": "2026-03-06T14:26:13.981Z"
  }
}
```

**Error Response (401 - No Token):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**Error Response (401 - Invalid Token):**
```json
{
  "success": false,
  "message": "Token is invalid or expired"
}
```

---

## 🧪 Using cURL for Testing

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tamil Selvan",
    "email": "tamil@example.com",
    "password": "securePassword123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tamil@example.com",
    "password": "securePassword123"
  }'
```

### Get Current User (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🧪 Using Postman

1. **Create new request** → POST
2. **URL:** `http://localhost:5000/api/auth/register`
3. **Body** → raw JSON → paste request body
4. **Send**

After registration/login, copy the token and use it in the `Authorization` header for protected routes.

---

## 🏗️ File Structure

```
server/
├── models/
│   └── User.js              # User schema with password hashing
├── controllers/
│   └── authController.js    # register, login, getMe functions
├── routes/
│   └── authRoutes.js        # POST /register, /login, GET /me
├── middleware/
│   └── authMiddleware.js    # JWT verification middleware
├── config/
│   └── db.js                # MongoDB connection
└── index.js                 # Main server file
```

---

## 🔐 Security Features

### Password Security
- ✅ Hashed using bcryptjs (10 salt rounds)
- ✅ Never stored in plain text
- ✅ Not returned in API responses

### JWT Token
- ✅ Signed with JWT_SECRET from .env
- ✅ Expires based on JWT_EXPIRE setting
- ✅ Required for protected routes

### Validation
- ✅ Email format validation
- ✅ Password minimum length (6 characters)
- ✅ Email uniqueness check
- ✅ Required field validation

### Error Handling
- ✅ Duplicate email prevention
- ✅ Invalid credentials handling
- ✅ Missing field validation
- ✅ Token verification

---

## 📋 Environment Variables (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smarteval-ai
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

---

## ⚠️ Common Issues

### "Email already registered"
The email is already in the database. Use a different email or login instead.

### "Invalid credentials"
Either the email doesn't exist or the password is wrong.

### "Token is invalid or expired"
The JWT token has expired or is malformed. Login again to get a new token.

### "Not authorized to access this route"
You didn't include the Authorization header with a valid JWT token.

---

## 🧪 Run Authentication Tests

```bash
node test-auth.js
```

This will test:
- User registration
- User login
- Protected routes
- Error handling
- Input validation
- Password hashing

---

## 🎯 Next Steps

1. ✅ Test all endpoints with Postman or cURL
2. ✅ Integrate with your frontend
3. ✅ Store token in localStorage on client
4. ✅ Send token in Authorization header for API calls
5. ✅ Implement logout on frontend (clear token)

---

**Last Updated:** March 6, 2026  
**Status:** ✅ Fully Operational
