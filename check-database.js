const mongoose = require('mongoose');
require('dotenv').config();

const Result = mongoose.model('Result', new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
  evaluation: { type: mongoose.Schema.Types.ObjectId, ref: 'Evaluation', default: null },
  question: String,
  studentAnswer: String,
  score: Number,
  feedback: String,
  submittedAt: { type: Date, default: Date.now },
  evaluatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}));

const checkDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartevalai';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const resultCount = await Result.countDocuments();
    const recentResults = await Result.find().sort({ createdAt: -1 }).limit(3);

    console.log('📊 DATABASE CHECK\n');
    console.log(`✅ MongoDB Connected to: ${mongoUri}`);
    console.log(`\n📈 Results Collection:`);
    console.log(`   Total Documents: ${resultCount}`);
    
    if (recentResults.length > 0) {
      console.log(`\n📋 Recent Results:`);
      recentResults.forEach((result, idx) => {
        console.log(`   ${idx + 1}. Score: ${result.score}/10`);
        console.log(`      Question: "${result.question.substring(0, 40)}..."`);
        console.log(`      Feedback: "${result.feedback.substring(0, 50)}..."`);
        console.log(`      Saved: ${result.createdAt.toISOString()}`);
      });
    } else {
      console.log('   No results found yet.');
    }

    mongoose.connection.close();
    console.log('\n✅ Database check complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Error:', error.message);
    process.exit(1);
  }
};

checkDatabase();
