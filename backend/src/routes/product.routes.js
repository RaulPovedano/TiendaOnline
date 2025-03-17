// src/routes/product.routes.js
import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticateToken, createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", authenticateToken, updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);

export default router;
