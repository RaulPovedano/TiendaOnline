import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          message: `Producto no encontrado: ${item.productId}` 
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Stock insuficiente para el producto: ${product.name}` 
        });
      }
      item.price = product.price;
      total += product.price * item.quantity;
    }

    const order = new Order({
      userId: req.user._id,
      items,
      total,
      paymentMethod
    });

    await order.save();

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error crear pedido" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error obtener pedidos" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('items.productId');

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error obtener pedido" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error actualizar estado del pedido" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: "Solo se pueden cancelar pedidos pendientes" 
      });
    }

    order.status = 'canceled';
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({ message: "Pedido cancelado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelar pedido" });
  }
};
