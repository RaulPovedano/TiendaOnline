export interface OrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    img: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  shippingData?: {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
} 