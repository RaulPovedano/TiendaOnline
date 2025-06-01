import { Product } from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
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

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error obtener productos:', error);
    res.status(500).json({ 
      message: "Error obtener productos",
      error: error.message 
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({
      name: { $regex: name, $options: 'i' }
    });
    res.json(products);
  } catch (error) {
    console.error('Error buscar productos:', error);
    res.status(500).json({ 
      message: "Error buscar productos",
      error: error.message 
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Obteniendo producto con ID:', id);

    if (!id) {
      return res.status(400).json({ 
        message: "ID del producto es requerido",
        receivedId: id 
      });
    }

    const product = await Product.findById(id);
    console.log('Producto encontrado:', product);

    if (!product) {
      return res.status(404).json({ 
        message: "Producto no encontrado",
        requestedId: id 
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Error obtener producto:', error);
    res.status(500).json({ 
      message: "Error obtener producto",
      error: error.message,
      requestedId: req.params.id 
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.error('Error actualizar producto:', error);
    res.status(500).json({ 
      message: "Error actualizar producto",
      error: error.message 
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error('Error eliminar producto:', error);
    res.status(500).json({ 
      message: "Error eliminar producto",
      error: error.message 
    });
  }
};
