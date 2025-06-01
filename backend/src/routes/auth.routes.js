import { Router } from "express";
import { login, register, updateUser } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", authenticateToken, updateUser);
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = req.user.toJSON();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
});

export const authRoutes = router;
