// src/config/database.js
import mongoose from "mongoose";
import { config } from "dotenv";

config();

export const connectDB = async () => {
  try {
    console.log("[DEBUG] Intentando conectar a MongoDB con URI:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });

  } catch (error) {
    process.exit(1);
  }
};
