const mongoose = require('mongoose');

/**
 * Configure and connect to MongoDB
 */
const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smarteval-ai';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB Connected Successfully');
    console.log(`  Database: ${mongoUri}`);
    
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB Disconnected Successfully');
  } catch (error) {
    console.error('✗ MongoDB Disconnection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase
};
