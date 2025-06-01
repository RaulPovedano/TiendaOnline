import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email ya en uso" });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.json(user.toJSON());
  } catch (error) {
    console.error('Error actualizar usuario:', error);
    res.status(500).json({ message: "Error actualizar perfil de usuario" });
  }
};
