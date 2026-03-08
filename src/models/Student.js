const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Student Schema
 * Represents a student user in the SmartEvalAI system
 */
const StudentSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    grade: {
      type: String,
      trim: true,
      default: null
    },
    section: {
      type: String,
      trim: true,
      default: null
    },

    // Authentication
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      select: false
    },

    // Assessment Related
    totalAssessmentsTaken: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    // Account Management
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    lastLogin: Date
  },
  {
    timestamps: true,
    collection: 'students'
  }
);

/**
 * Hash password before saving
 */
StudentSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare passwords
 */
StudentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Method to get student profile (without sensitive data)
 */
StudentSchema.methods.getProfile = function() {
  const { password, verificationToken, ...profile } = this.toObject();
  return profile;
};

/**
 * Index for faster queries
 */
StudentSchema.index({ email: 1 });
StudentSchema.index({ rollNumber: 1 });
StudentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Student', StudentSchema);
