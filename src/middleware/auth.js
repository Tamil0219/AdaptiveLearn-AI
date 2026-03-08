const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
const protect = (req, res, next) => {
  let token;

  // Get token from headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      code: 'NO_TOKEN'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      code: 'UNAUTHORIZED'
    });
  }
};

/**
 * Verify user is a student
 */
const isStudent = (req, res, next) => {
  if (req.user.userType !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'This route is only accessible to students',
      code: 'FORBIDDEN'
    });
  }
  next();
};

/**
 * Verify user is an admin/teacher
 */
const isAdmin = (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'This route is only accessible to admins',
      code: 'FORBIDDEN'
    });
  }
  next();
};

/**
 * Verify user is a super admin
 */
const isSuperAdmin = (req, res, next) => {
  if (req.user.userType !== 'admin' || req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'This route is only accessible to super admins',
      code: 'FORBIDDEN'
    });
  }
  next();
};

module.exports = {
  protect,
  isStudent,
  isAdmin,
  isSuperAdmin
};
