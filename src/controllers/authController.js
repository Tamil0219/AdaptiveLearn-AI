const Student = require('../models/Student');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 */
const generateToken = (id, userType, role = null) => {
  return jwt.sign(
    { 
      id, 
      userType,
      role: role || null 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * @route   POST /api/auth/student/register
 * @desc    Register a new student
 * @access  Public
 */
exports.registerStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, password, rollNumber, grade, section } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (firstName, lastName, email, password)'
      });
    }

    // Check if email already exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create student
    student = await Student.create({
      firstName,
      lastName,
      email,
      password,
      rollNumber: rollNumber || null,
      grade: grade || null,
      section: section || null
    });

    // Generate token
    const token = generateToken(student._id, 'student');

    // Get student profile without password
    const studentProfile = student.getProfile();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      user: studentProfile
    });
  } catch (error) {
    console.error('Register Student Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering student'
    });
  }
};

/**
 * @route   POST /api/auth/student/login
 * @desc    Login student
 * @access  Public
 */
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find student and select password field
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!student.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Update last login
    student.lastLogin = new Date();
    await student.save();

    // Generate token
    const token = generateToken(student._id, 'student');

    // Get student profile
    const studentProfile = student.getProfile();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: studentProfile
    });
  } catch (error) {
    console.error('Login Student Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in'
    });
  }
};

/**
 * @route   POST /api/auth/admin/register
 * @desc    Register a new admin
 * @access  Public (should be restricted in production)
 */
exports.registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, employeeId, department, designation, role } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (firstName, lastName, email, password)'
      });
    }

    // Check if email already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create admin
    admin = await Admin.create({
      firstName,
      lastName,
      email,
      password,
      employeeId: employeeId || null,
      department: department || null,
      designation: designation || 'Teacher',
      role: role || 'teacher'
    });

    // Generate token
    const token = generateToken(admin._id, 'admin', admin.role);

    // Get admin profile
    const adminProfile = admin.getProfile();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      user: adminProfile
    });
  } catch (error) {
    console.error('Register Admin Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering admin'
    });
  }
};

/**
 * @route   POST /api/auth/admin/login
 * @desc    Login admin
 * @access  Public
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find admin and select password field
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, 'admin', admin.role);

    // Get admin profile
    const adminProfile = admin.getProfile();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: adminProfile
    });
  } catch (error) {
    console.error('Login Admin Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in'
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    if (req.user.userType === 'student') {
      const student = await Student.findById(req.user.id);
      return res.status(200).json({
        success: true,
        user: student.getProfile()
      });
    } else if (req.user.userType === 'admin') {
      const admin = await Admin.findById(req.user.id);
      return res.status(200).json({
        success: true,
        user: admin.getProfile()
      });
    }

    res.status(400).json({
      success: false,
      message: 'Invalid user type'
    });
  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user'
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging out'
    });
  }
};
