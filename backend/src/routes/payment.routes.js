import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas de Stripe
router.post('/stripe/create-payment-intent', authenticateToken, createPaymentIntent);
router.post('/stripe/webhook', express.raw({type: 'application/json'}), handleWebhook);

export default router; 