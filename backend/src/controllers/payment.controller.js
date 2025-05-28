import stripe from '../config/stripe.js';
import { Order } from '../models/Order.js';

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, paymentMethod, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "El monto debe ser mayor que 0" });
    }

    if (!orderId) {
      return res.status(400).json({ message: "Se requiere el ID de la orden" });
    }

    // Verificar que la orden existe y pertenece al usuario
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: "La orden ya ha sido procesada" });
    }

    // Crear PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        orderId: orderId,
        userId: req.user._id.toString()
      }
    });

    // Actualizar la orden con el ID del PaymentIntent
    order.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({
      message: "Error al procesar el pago",
      error: error.message
    });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Error de firma webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await Order.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { 
            status: 'paid',
            paymentStatus: 'completed',
            updatedAt: new Date()
          }
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await Order.findOneAndUpdate(
          { paymentIntentId: failedPayment.id },
          { 
            status: 'pending',
            paymentStatus: 'failed',
            updatedAt: new Date()
          }
        );
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
}; 