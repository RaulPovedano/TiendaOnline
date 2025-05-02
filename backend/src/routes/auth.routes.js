// src/routes/auth.routes.js
import { Router } from "express";
import { login, register, updateUser } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", authenticateToken, updateUser);

export const authRoutes = router;
