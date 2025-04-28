import stripe from '../config/stripe.js';
import paypal from '@paypal/checkout-server-sdk';

// Configuración de PayPal
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let paypalClient = new paypal.core.PayPalHttpClient(environment);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (paymentMethod === 'credit_card') {
      // Crear PaymentIntent para tarjeta de crédito
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe usa centavos
        currency: 'eur',
        payment_method_types: ['card'],
        metadata: {
          userId: req.user._id.toString()
        }
      });

      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } else if (paymentMethod === 'paypal') {
      // Crear orden de PayPal
      let request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "EUR",
            value: amount.toString()
          }
        }]
      });

      const order = await paypalClient.execute(request);
      
      res.json({
        orderId: order.result.id
      });
    }
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({
      message: "Error al procesar el pago"
    });
  }
}; 