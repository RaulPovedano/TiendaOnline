export interface CartItem {
  _id: string;
  productId: string | {
    _id: string;
    name: string;
    price: number;
    img: string;
    stock: number;
  };
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
