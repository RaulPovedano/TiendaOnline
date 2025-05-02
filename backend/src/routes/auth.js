import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ... existing auth routes ...

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user.toJSON();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
});

export default router;