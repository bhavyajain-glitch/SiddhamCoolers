import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  stockQty: number;
  features: string[];
  isActive: boolean;
  createdBy?: Types.ObjectId;
}

export interface IOrderItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  image: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  customerId: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  discount: number;
  totalAmount: number;
  couponId?: Types.ObjectId;
  retailerId?: Types.ObjectId;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingId?: string;
  paymentMethod: 'cod' | 'upi' | 'card';
  createdAt: Date;
  updatedAt: Date;
}
