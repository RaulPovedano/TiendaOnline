import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate({
        path: 'items.productId',
        model: 'Product', // Asegurar que usa el modelo correcto
        select: 'name price img stock' // Selecciona solo estos campos
      });

    if (!cart) {
      cart = new Cart({ 
        userId: req.user._id, 
        items: [],
        total: 0
      });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Buscar o crear el carrito del usuario
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
        total: 0
      });
    }

    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity
      });
    }

    // Guardar el carrito
    await cart.save();
    
    // Poblar el carrito con los datos del producto
    await cart.populate({
      path: 'items.productId',
      model: 'Product',
      select: 'name price img stock'
    });

    // Calcular el total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { quantity } = req.body;

    // Validar que quantity es un número positivo
    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ 
        message: "Quantity must be a positive integer" 
      });
    }

    // Buscar el producto primero
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verificar stock disponible
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.stock}` 
      });
    }

    // Buscar el carrito del usuario
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Encontrar el ítem en el carrito
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Actualizar o eliminar el ítem
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Guardar y poblar el carrito
    await cart.save();
    await cart.populate({
      path: 'items.productId',
      select: 'name price img stock' // Seleccionar solo los campos necesarios
    });
    
    // Calcular el total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: "Error updating cart item" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate({
      path: 'items.productId',
      select: 'name price img stock'
    });

    // Recalcular el total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    await cart.save();
    
    res.json(cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
};

export const checkout = async (req, res) => {
  try {
    const { shippingData, paymentMethod } = req.body;
    
    // Obtener el carrito del usuario
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    // Verificar stock y preparar items para la orden
    const orderItems = [];
    let total = 0;

    for (const item of cart.items) {
      const product = item.productId;
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
        });
      }

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });

      total += product.price * item.quantity;
    }

    // Crear la orden
    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      total,
      paymentMethod,
      shippingData,
      status: 'pending'
    });

    await order.save();

    // Actualizar stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Limpiar carrito
    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.status(200).json({
      message: "Pedido creado con éxito",
      order,
      cart
    });

  } catch (error) {
    console.error('Error durante el checkout:', error);
    res.status(500).json({ message: "Error al procesar el pedido" });
  }
};