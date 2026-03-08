const mongoose = require('mongoose');
const Result = require('./server/models/Result');
require('dotenv').config();

const checkResults = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartevalai', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const results = await Result.find().limit(5);
    console.log('Results stored in MongoDB:');
    console.log(JSON.stringify(results, null, 2));

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkResults();
