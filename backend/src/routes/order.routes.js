import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} from "../controllers/order.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getOrders);
router.get("/:id", authenticateToken, getOrder);
router.put("/:id/status", authenticateToken, updateOrderStatus);
router.put("/:id/cancel", authenticateToken, cancelOrder);

export default router;