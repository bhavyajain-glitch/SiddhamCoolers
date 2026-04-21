import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * CartService — manages shopping cart operations.
 */
class CartService {
  /**
   * Get the user's cart, populated with product details.
   * @param {string} userId
   */
  async getCart(userId) {
    return Cart.getOrCreate(userId);
  }

  /**
   * Add an item to the user's cart.
   * @param {string} userId
   * @param {string} productId
   * @param {number} quantity
   */
  async addItem(userId, productId, quantity = 1) {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      const error = new Error('Product not found or unavailable');
      error.statusCode = 404;
      throw error;
    }
    if (product.stockQty < quantity) {
      const error = new Error('Insufficient stock');
      error.statusCode = 400;
      throw error;
    }

    let cart = await Cart.findOne({ customerId: userId });
    if (!cart) {
      cart = new Cart({ customerId: userId, items: [], totalAmount: 0 });
    }

    await cart.addItem(productId, quantity, product.price);

    // Return populated cart
    return Cart.findById(cart._id).populate('items.productId', 'name images price stockQty');
  }

  /**
   * Remove an item from the cart.
   * @param {string} userId
   * @param {string} productId
   */
  async removeItem(userId, productId) {
    const cart = await Cart.findOne({ customerId: userId });
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      throw error;
    }

    await cart.removeItem(productId);
    return Cart.findById(cart._id).populate('items.productId', 'name images price stockQty');
  }

  /**
   * Update item quantity in the cart.
   * @param {string} userId
   * @param {string} productId
   * @param {number} quantity
   */
  async updateQuantity(userId, productId, quantity) {
    const cart = await Cart.findOne({ customerId: userId });
    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      throw error;
    }

    await cart.updateQuantity(productId, quantity);
    return Cart.findById(cart._id).populate('items.productId', 'name images price stockQty');
  }

  /**
   * Clear the cart.
   * @param {string} userId
   */
  async clearCart(userId) {
    const cart = await Cart.findOne({ customerId: userId });
    if (cart) await cart.clear();
    return { message: 'Cart cleared' };
  }
}

export default new CartService();
