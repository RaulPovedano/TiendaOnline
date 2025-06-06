import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import mongoose from "mongoose";
import { parse } from 'csv-parse';
import { Readable } from 'stream';

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: "Error getting users" });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const userId = req.params.userId;

    // Verificar si el email ya está en uso por otro usuario
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email ya en uso" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error actualizar usuario:', error);
    res.status(500).json({ message: "Error actualizar usuario" });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error('Error eliminar usuario:', error);
    res.status(500).json({ message: "Error eliminar usuario" });
  }
};

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error obtener productos:', error);
    res.status(500).json({ message: "Error obtener productos" });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, img } = req.body;

    // Validar campos requeridos
    if (!name || !description || !price || !stock || !img) {
      return res.status(400).json({ 
        message: "Todos los campos son requeridos",
        missingFields: {
          name: !name,
          description: !description,
          price: !price,
          stock: !stock,
          img: !img
        }
      });
    }

    // Validar tipos de datos
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: "El precio debe ser un número positivo" });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: "El stock debe ser un número positivo" });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      img
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error crear producto:', error);
    res.status(500).json({ 
      message: "Error crear producto",
      error: error.message 
    });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error actualizar producto:', error);
    res.status(500).json({ message: "Error actualizar producto" });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error('Error eliminar producto:', error);
    res.status(500).json({ message: "Error eliminar producto" });
  }
};

// Obtener todos los pedidos
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error obtener pedidos:', error);
    res.status(500).json({ message: "Error obtener pedidos" });
  }
};

// Actualizar el estado de un pedido
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
    .populate('userId', 'name email')
    .populate('items.productId');

    if (!updatedOrder) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error actualizar estado del pedido:', error);
    res.status(500).json({ message: "Error actualizar estado del pedido" });
  }
};

export const getTopCustomer = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 1 }
    ]);

    if (result.length === 0) {
      return res.json({ user: null, totalOrders: 0 });
    }

    const user = await User.findById(result[0]._id).select("name email");
    res.json({ user, totalOrders: result[0].totalOrders });
  } catch (error) {
    res.status(500).json({ message: "Error obtener cliente top" });
  }
};

export const getTopCustomersBySpent = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$total" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);

    // Poblar los datos de usuario
    const users = await User.find({
      _id: { $in: result.map(r => r._id) }
    }).select("name email");

    // Unir los datos
    const data = result.map(r => {
      const user = users.find(u => u._id.equals(r._id));
      return {
        user,
        totalSpent: r.totalSpent
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching top customers by spent" });
  }
};

// Subir productos desde CSV
export const uploadProductsCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha proporcionado ningún archivo CSV" });
    }

    const products = [];
    const parser = parse({
      columns: true,
      skip_empty_lines: true
    });

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    for await (const record of readableStream.pipe(parser)) {
      const product = new Product({
        name: record.name,
        description: record.description,
        price: parseFloat(record.price),
        stock: parseInt(record.stock),
        img: record.img
      });
      products.push(product);
    }

    await Product.insertMany(products);
    res.status(201).json({ message: "Productos subidos correctamente", count: products.length });
  } catch (error) {
    console.error('Error uploading products from CSV:', error);
    res.status(500).json({ 
      message: "Error uploading products from CSV",
      error: error.message 
    });
  }
};