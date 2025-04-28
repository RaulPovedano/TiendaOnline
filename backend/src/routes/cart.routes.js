import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkout
} from '../controllers/cart.controller.js';

const router = express.Router();

router.use(authenticateToken);

// Rutas del carrito
router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeFromCart);
router.post('/checkout', checkout);

export default router;