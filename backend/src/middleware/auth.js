import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'ROLE_ADMIN') {
      return res.status(403).json({ message: "Acceso denegado. Rol de administrador requerido." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error verificar rol de administrador" });
  }
};