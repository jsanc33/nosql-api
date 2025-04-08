import mongoose from "mongoose";
const dbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialnetwork";
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export default connectDB;

