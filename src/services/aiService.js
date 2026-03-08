/**
 * AI Service
 * Evaluates student answers using keyword matching and word count analysis
 */

const evaluateAnswer = (question, studentAnswer) => {
  try {
    // Validate inputs
    if (!studentAnswer || typeof studentAnswer !== 'string') {
      return {
        score: 0,
        feedback: 'Invalid answer provided'
      };
    }

    // Count words in student answer
    const wordCount = studentAnswer.trim().split(/\s+/).length;

    let score = 0;
    let feedback = '';

    // Calculate score based on answer length
    if (wordCount < 20) {
      score = 3;
      feedback = 'Answer too short. Please provide more detailed explanation.';
    } else if (wordCount >= 20 && wordCount <= 60) {
      score = 6;
      feedback = 'Good effort, but needs more explanation and examples.';
    } else if (wordCount > 60) {
      score = 9;
      feedback = 'Very detailed answer with excellent explanation.';
    }

    // Bonus: Check for keyword relevance (simple keyword matching)
    const questionKeywords = extractKeywords(question);
    const answerKeywords = extractKeywords(studentAnswer);
    const relevanceScore = calculateRelevance(questionKeywords, answerKeywords);

    // Adjust score based on relevance
    if (relevanceScore < 0.3) {
      score = Math.max(1, score - 2);
      feedback = feedback.replace(/\./, '. Note: Answer may not directly address the question.');
    } else if (relevanceScore > 0.7) {
      score = Math.min(10, score + 1);
      feedback = feedback.replace(/\./, '. Good relevance to the question.');
    }

    return {
      score: Math.min(10, Math.max(0, Math.round(score))),
      feedback: feedback
    };
  } catch (error) {
    console.error('Error in evaluateAnswer:', error);
    return {
      score: 0,
      feedback: 'Error evaluating answer: ' + error.message
    };
  }
};

/**
 * Extract keywords from text (removes common words)
 */
const extractKeywords = (text) => {
  if (!text) return [];
  
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'can', 'may', 'might', 'must', 'shall', 'by', 'from', 'up',
    'about', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'between', 'out', 'what', 'which', 'who', 'whom', 'why', 'how'
  ]);

  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word));
};

/**
 * Calculate relevance between question and answer keywords
 */
const calculateRelevance = (questionKeywords, answerKeywords) => {
  if (questionKeywords.length === 0) return 1;

  const matchedKeywords = questionKeywords.filter(keyword =>
    answerKeywords.some(ansKeyword => 
      ansKeyword.includes(keyword) || keyword.includes(ansKeyword)
    )
  );

  return matchedKeywords.length / questionKeywords.length;
};

module.exports = {
  evaluateAnswer
};
