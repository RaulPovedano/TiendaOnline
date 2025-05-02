import { Router } from "express";
import { 
  getAllUsers, 
  updateUser, 
  deleteUser,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus
} from "../controllers/admin.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Middleware para verificar si el usuario es administrador
const isAdmin = async (req, res, next) => {
  if (req.user.role !== 'ROLE_ADMIN') {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  next();
};

// Rutas de administración de usuarios
router.get("/users", authenticateToken, isAdmin, getAllUsers);
router.put("/users/:userId", authenticateToken, isAdmin, updateUser);
router.delete("/users/:userId", authenticateToken, isAdmin, deleteUser);

// Rutas de administración de productos
router.get("/products", authenticateToken, isAdmin, getAllProducts);
router.post("/products", authenticateToken, isAdmin, createProduct);
router.put("/products/:productId", authenticateToken, isAdmin, updateProduct);
router.delete("/products/:productId", authenticateToken, isAdmin, deleteProduct);

// Rutas de administración de pedidos
router.get("/orders", authenticateToken, isAdmin, getAllOrders);
router.put("/orders/:orderId/status", authenticateToken, isAdmin, updateOrderStatus);

export default router; 