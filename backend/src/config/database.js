// src/config/database.js
import mongoose from "mongoose";
import { config } from "dotenv";

config();

export const connectDB = async () => {
  try {
    console.log("[DEBUG] Intentando conectar a MongoDB con URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s instead of 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log("[DEBUG] MongoDB connected successfully");
  } catch (error) {
    console.error("[DEBUG] Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
