const mongoose = require('mongoose');

/**
 * Result Schema
 * Stores student evaluation results from the AI evaluation system
 */
const ResultSchema = new mongoose.Schema(
  {
    // Student Information
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null
    },
    
    // Evaluation Information
    evaluation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evaluation',
      default: null
    },
    
    // Question and Answer
    question: {
      type: String,
      required: true
    },
    
    studentAnswer: {
      type: String,
      required: true
    },
    
    // AI Evaluation Results
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    
    feedback: {
      type: String,
      required: true
    },
    
    // Metadata
    submittedAt: {
      type: Date,
      default: Date.now
    },
    
    evaluatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'results'
  }
);

module.exports = mongoose.model('Result', ResultSchema);
