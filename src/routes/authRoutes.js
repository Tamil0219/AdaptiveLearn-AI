const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, isStudent, isAdmin } = require('../middleware/auth');

/**
 * Simple student authentication routes (unified)
 */

// Register student (unified - works as both /register and /student/register)
router.post('/register', authController.registerStudent);
router.post('/student/register', authController.registerStudent);

// Login student (unified - works as both /login and /student/login)
router.post('/login', authController.loginStudent);
router.post('/student/login', authController.loginStudent);

/**
 * Admin Authentication Routes
 */

// Register admin
router.post('/admin/register', authController.registerAdmin);

// Login admin
router.post('/admin/login', authController.loginAdmin);

/**
 * Protected Routes
 */

// Get current user (requires authentication)
router.get('/me', protect, authController.getCurrentUser);

// Logout
router.post('/logout', protect, authController.logout);

module.exports = router;
