import dotenv from "dotenv";
import connectDB from "./src/config/database.js";

dotenv.config();

const testConnection = async () => {
  try {
    console.log("🔄 Testing database connection...");
    await connectDB();
    console.log("🎉 Database connection test successful!");
    process.exit(0);
  } catch (error) {
    console.error("💥 Database connection test failed:", error);
    process.exit(1);
  }
};

testConnection();
