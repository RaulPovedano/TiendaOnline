import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true }, 
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'test_mode'], required: true }, 
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now } 
});

export const Order = mongoose.model('Order', orderSchema);