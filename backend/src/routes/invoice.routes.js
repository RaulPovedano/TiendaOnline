import express from 'express';
import { generateInvoice } from '../controllers/invoice.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticateToken, generateInvoice);

export default router; 