const mongoose = require('mongoose');

// Connects to MongoDB using the URI supplied in the environment.
// In production this should point to a MongoDB Atlas cluster.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern mongoose (v8) no longer needs useNewUrlParser/useUnifiedTopology,
      // they are kept here as harmless no-ops for clarity of intent.
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
