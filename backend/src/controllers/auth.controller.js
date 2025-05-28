// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Todos los campos son requeridos",
        details: { name, email, password: password ? "****" : undefined }
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const user = new User({ 
      name,
      email,
      password
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({ 
      token, 
      user: user.toJSON() 
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: "Error al crear usuario",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Check if email is being changed and if it's already taken
    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Find the user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's fields
    user.name = name;
    user.email = email;

    // Save the changes
    await user.save();

    // Return the updated user without the password
    res.json(user.toJSON());
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Error updating user profile" });
  }
};
