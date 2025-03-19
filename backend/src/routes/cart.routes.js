import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cart.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items", updateCartItem);
router.delete("/items/:productId", removeFromCart);
router.delete("/", clearCart);

export default router;