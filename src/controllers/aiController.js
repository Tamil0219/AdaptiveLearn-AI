const { evaluateAnswer } = require('../services/aiService');
const Result = require('../models/Result');
const mongoose = require('mongoose');

/**
 * AI Evaluation Controller
 * Handles answer evaluation requests using AI service
 */

/**
 * @route   POST /api/ai/evaluate
 * @desc    Evaluate a student's answer using AI
 * @access  Public
 */
exports.evaluateStudentAnswer = async (req, res) => {
  try {
    const { question, studentAnswer, studentId, evaluationId } = req.body;

    // Validation
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required'
      });
    }

    if (!studentAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Student answer is required'
      });
    }

    // Call AI service to evaluate answer
    const evaluation = evaluateAnswer(question, studentAnswer);

    // Prepare result data
    const resultData = {
      question,
      studentAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback
    };

    // Add optional student and evaluation references if provided
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      resultData.student = studentId;
    }

    if (evaluationId && mongoose.Types.ObjectId.isValid(evaluationId)) {
      resultData.evaluation = evaluationId;
    }

    // Save result to MongoDB
    const result = await Result.create(resultData);

    // Return response
    return res.status(201).json({
      success: true,
      score: evaluation.score,
      feedback: evaluation.feedback,
      resultId: result._id,
      message: 'Answer evaluated successfully'
    });

  } catch (error) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error evaluating answer'
    });
  }
};

/**
 * @route   GET /api/ai/results/:resultId
 * @desc    Get a specific evaluation result
 * @access  Public
 */
exports.getResult = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await Result.findById(resultId)
      .populate('student', 'firstName lastName email')
      .populate('evaluation', 'title description');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching result:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching result'
    });
  }
};

/**
 * @route   GET /api/ai/results
 * @desc    Get all evaluation results (with pagination)
 * @access  Public
 */
exports.getAllResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const results = await Result.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('student', 'firstName lastName email')
      .populate('evaluation', 'title description');

    const total = await Result.countDocuments();

    return res.status(200).json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching results'
    });
  }
};
