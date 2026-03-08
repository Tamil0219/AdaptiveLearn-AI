const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

/**
 * AI Evaluation Routes
 */

// Evaluate a student's answer
router.post('/evaluate', aiController.evaluateStudentAnswer);

// Get a specific evaluation result
router.get('/results/:resultId', aiController.getResult);

// Get all evaluation results
router.get('/results', aiController.getAllResults);

module.exports = router;
