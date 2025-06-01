import mongoose from 'mongoose';

const shippingDataSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true }
});

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
  updatedAt: { type: Date, default: Date.now },
  shippingData: { type: shippingDataSchema, required: true }
});

export const Order = mongoose.model('Order', orderSchema);