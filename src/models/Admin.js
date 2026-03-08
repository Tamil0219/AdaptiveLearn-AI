const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin Schema
 * Represents an admin/teacher user in the SmartEvalAI system
 */
const AdminSchema = new mongoose.Schema(
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
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    department: {
      type: String,
      trim: true,
      default: null
    },
    designation: {
      type: String,
      trim: true,
      enum: ['Teacher', 'HOD', 'Principal', 'Super Admin'],
      default: 'Teacher'
    },
    phone: {
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

    // Permissions & Role
    role: {
      type: String,
      enum: ['admin', 'teacher', 'super_admin'],
      default: 'teacher'
    },
    permissions: {
      canCreateAssessment: {
        type: Boolean,
        default: true
      },
      canEditAssessment: {
        type: Boolean,
        default: true
      },
      canDeleteAssessment: {
        type: Boolean,
        default: false
      },
      canViewReports: {
        type: Boolean,
        default: true
      },
      canManageStudents: {
        type: Boolean,
        default: false
      },
      canManageAdmins: {
        type: Boolean,
        default: false
      }
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    verificationToken: {
      type: String,
      select: false
    },

    // Statistics
    totalAssessmentsCreated: {
      type: Number,
      default: 0
    },
    totalStudentsManaged: {
      type: Number,
      default: 0
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
    collection: 'admins'
  }
);

/**
 * Hash password before saving
 */
AdminSchema.pre('save', async function(next) {
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
AdminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Method to get admin profile (without sensitive data)
 */
AdminSchema.methods.getProfile = function() {
  const { password, verificationToken, ...profile } = this.toObject();
  return profile;
};

/**
 * Method to check if admin has specific permission
 */
AdminSchema.methods.hasPermission = function(permissionKey) {
  return this.permissions[permissionKey] === true || this.role === 'super_admin';
};

/**
 * Index for faster queries
 */
AdminSchema.index({ email: 1 });
AdminSchema.index({ employeeId: 1 });
AdminSchema.index({ designation: 1 });
AdminSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Admin', AdminSchema);
