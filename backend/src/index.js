// src/index.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

// Cargamos las variables de entorno
dotenv.config();
// Creamos la app
const app = express();

// Middlewares para parsear el body y cors
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Error handling middleware para manejar errores de rutas no encontradas y errores de servidor 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "¡Ups! Algo salió mal!" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
