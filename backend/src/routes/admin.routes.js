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
  updateOrderStatus,
  getTopCustomer,
  getTopCustomersBySpent,
  uploadProductsCSV
} from "../controllers/admin.controller.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";
import multer from "multer";

const router = Router();

// Configurar multer para almacenamiento en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // límite de 5MB
  }
});

// Rutas de administración de usuarios
router.get("/users", authenticateToken, isAdmin, getAllUsers);
router.put("/users/:userId", authenticateToken, isAdmin, updateUser);
router.delete("/users/:userId", authenticateToken, isAdmin, deleteUser);

// Rutas de administración de productos
router.get("/products", authenticateToken, isAdmin, getAllProducts);
router.post("/products", authenticateToken, isAdmin, createProduct);
router.put("/products/:productId", authenticateToken, isAdmin, updateProduct);
router.delete("/products/:productId", authenticateToken, isAdmin, deleteProduct);
router.post("/products/upload", authenticateToken, isAdmin, upload.single('file'), uploadProductsCSV);

// Rutas de administración de pedidos
router.get("/orders", authenticateToken, isAdmin, getAllOrders);
router.put("/orders/:orderId/status", authenticateToken, isAdmin, updateOrderStatus);

router.get("/top-customer", authenticateToken, isAdmin, getTopCustomer);
router.get("/top-customers-spent", authenticateToken, isAdmin, getTopCustomersBySpent);

export default router; 