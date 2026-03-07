import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    priceAtAdd: { type: Number, required: true },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ─── Instance Methods ───

/**
 * Add or update an item in the cart.
 * @param {string} productId
 * @param {number} quantity
 * @param {number} price
 */
cartSchema.methods.addItem = function (productId, quantity, price) {
  const existingIndex = this.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (existingIndex > -1) {
    this.items[existingIndex].quantity += quantity;
    this.items[existingIndex].priceAtAdd = price;
  } else {
    this.items.push({ productId, quantity, priceAtAdd: price });
  }

  this.calculateTotal();
  return this.save();
};

/**
 * Remove an item from the cart.
 * @param {string} productId
 */
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  this.calculateTotal();
  return this.save();
};

/**
 * Update quantity of an item in the cart.
 * @param {string} productId
 * @param {number} quantity
 */
cartSchema.methods.updateQuantity = function (productId, quantity) {
  const item = this.items.find(
    (item) => item.productId.toString() === productId.toString()
  );
  if (!item) {
    const error = new Error('Item not found in cart');
    error.statusCode = 404;
    throw error;
  }
  if (quantity <= 0) {
    return this.removeItem(productId);
  }
  item.quantity = quantity;
  this.calculateTotal();
  return this.save();
};

/**
 * Recalculate the total amount based on items.
 */
cartSchema.methods.calculateTotal = function () {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.priceAtAdd * item.quantity,
    0
  );
};

/**
 * Clear all items from the cart.
 */
cartSchema.methods.clear = function () {
  this.items = [];
  this.totalAmount = 0;
  return this.save();
};

// ─── Static Methods ───

/**
 * Get or create a cart for a user.
 * @param {string} customerId
 */
cartSchema.statics.getOrCreate = async function (customerId) {
  let cart = await this.findOne({ customerId }).populate('items.productId', 'name images price stockQty');
  if (!cart) {
    cart = await this.create({ customerId, items: [], totalAmount: 0 });
  }
  return cart;
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
