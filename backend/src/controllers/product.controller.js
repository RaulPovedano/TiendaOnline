// src/controllers/product.controller.js
import { Product } from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      message: "Error creating product",
      error: error.message 
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: "Error fetching products",
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
    console.error('Error searching products:', error);
    res.status(500).json({ 
      message: "Error searching products",
      error: error.message 
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching product with ID:', id);

    if (!id) {
      return res.status(400).json({ 
        message: "Product ID is required",
        receivedId: id 
      });
    }

    const product = await Product.findById(id);
    console.log('Found product:', product);

    if (!product) {
      return res.status(404).json({ 
        message: "Product not found",
        requestedId: id 
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ 
      message: "Error fetching product",
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
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      message: "Error updating product",
      error: error.message 
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      message: "Error deleting product",
      error: error.message 
    });
  }
};
