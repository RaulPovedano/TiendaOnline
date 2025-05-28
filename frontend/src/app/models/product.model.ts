export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  img: string;
  createdAt?: Date;
  updatedAt?: Date;
} 