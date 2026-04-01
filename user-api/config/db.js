import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/users_db";
    
    console.log(`🔌 Connecting to MongoDB: ${mongoURI.replace(/:[^:]*@/, ':***@')}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected successfully`);
    return mongoose.connection;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB:`, error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log(`✅ MongoDB Disconnected`);
  } catch (error) {
    console.error(`❌ Error disconnecting from MongoDB:`, error.message);
    process.exit(1);
  }
};
