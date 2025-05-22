// src/index.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";

// Cargamos las variables de entorno
dotenv.config();

// Conectamos a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);

// Error handling middleware para manejar errores de rutas no encontradas y errores de servidor 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "¡Ups! Algo salió mal!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
