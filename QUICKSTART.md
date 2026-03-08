# SmartEvalAI - Quick Setup & Troubleshooting Guide

## ✅ Server Status: RUNNING ON PORT 5000

The SmartEvalAI backend server is fully operational!

### 🚀 Quick Start

```bash
# Start the development server (with auto-reload)
npm run dev

# Or start the production server
npm start
```

The server will be available at: `http://localhost:5000`

---

## 🔧 Troubleshooting: "Port 5000 Already in Use"

If you get this error:
```
Error: listen EADDRINUSE: address already in use :::5000
```

### Solution 1: Use the Kill Script (Easiest)

**On Windows:**
- Double-click `kill-port-5000.bat` in the project folder

**Or in PowerShell:**
```powershell
.\kill-port-5000.ps1
```

### Solution 2: Manual Kill (PowerShell)

```powershell
# Find the process using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Kill the process (replace 1234 with the actual PID)
Stop-Process -Id 1234 -Force

# Wait a moment
Start-Sleep -Seconds 2

# Try starting the server again
npm run dev
```

### Solution 3: Use a Different Port

```bash
PORT=3001 npm run dev
```

Then access the server at: `http://localhost:3001`

---

## 📝 Features & Endpoints

### Root Route
- `GET /` → Web UI (HTML interface)

### Health & Status
- `GET /api/health` → Server health check

### AI Evaluation
- `POST /api/ai/evaluate` → Evaluate student answers
  ```json
  {
    "question": "What is AI?",
    "studentAnswer": "Artificial intelligence is..."
  }
  ```

- `GET /api/ai/results` → Get all evaluation results
- `GET /api/ai/results/:resultId` → Get specific result

### Authentication (if enabled)
- `POST /api/auth/student/register`
- `POST /api/auth/student/login`
- `POST /api/auth/admin/register`
- `POST /api/auth/admin/login`

---

## 🧪 Testing

Run all tests:
```bash
node comprehensive-test.js
```

Run specific tests:
```bash
node test-ai.js
node chrome-compatibility-check.js
node check-database.js
node final-status-report.js
```

---

## 💾 Database

- **MongoDB** is connected to: `mongodb://localhost:27017/smarteval-ai`
- Results are automatically saved to the database

---

## 📱 Web Interface

Open `http://localhost:5000` in your browser to:
- Enter questions
- Submit student answers
- Get AI-powered evaluations
- View scores and feedback

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smarteval-ai
JWT_SECRET=your_super_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

---

## 🛑 Stop the Server

- Press **Ctrl+C** in the terminal
- The connection will be gracefully terminated

---

## Has Issues?

1. ✅ Check if MongoDB is running
2. ✅ Kill existing process on port 5000
3. ✅ Clear node_modules and reinstall: `npm install`
4. ✅ Check `.env` configuration
5. ✅ Review console logs for errors

---

**Last Updated:** March 6, 2026
**Status:** ✅ All Systems Operational
