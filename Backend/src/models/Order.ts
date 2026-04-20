import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'Order must have at least one item',
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },
    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
    trackingId: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'upi', 'card'],
      default: 'cod',
    },
  },
  { timestamps: true }
);

// ─── Indexes ───
orderSchema.index({ customerId: 1 });
orderSchema.index({ retailerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// ─── Instance Methods ───

/**
 * Update order status with validation for allowed transitions.
 * @param {string} newStatus
 */
orderSchema.methods.updateStatus = function (newStatus) {
  const allowedTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };

  const allowed = allowedTransitions[this.status];
  if (!allowed || !allowed.includes(newStatus)) {
    const error = new Error(`Cannot transition from '${this.status}' to '${newStatus}'`);
    error.statusCode = 400;
    throw error;
  }

  this.status = newStatus;
  return this.save();
};

/**
 * Cancel this order.
 */
orderSchema.methods.cancel = function () {
  return this.updateStatus('cancelled');
};

const Order = mongoose.model('Order', orderSchema);
export default Order;
