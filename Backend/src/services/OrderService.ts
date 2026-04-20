import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import Coupon from '../models/Coupon';
import Commission from '../models/Commission';

/**
 * OrderService — handles order creation, status updates, and querying.
 */
class OrderService {
  /**
   * Create a new order from a user's cart.
   * @param {string} userId
   * @param {Object} shippingAddress
   * @param {string} couponCode - optional coupon code
   * @param {string} paymentMethod
   * @returns {Promise<Order>}
   */
  async create(userId, shippingAddress, couponCode = null, paymentMethod = 'cod') {
    // 1. Get user's cart
    const cart = await Cart.findOne({ customerId: userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      const error = new Error('Cart is empty');
      error.statusCode = 400;
      throw error;
    }

    // 2. Validate stock and build order items
    const orderItems = [];
    for (const cartItem of cart.items) {
      const product = cartItem.productId;
      if (!product || !product.isActive) {
        const error = new Error(`Product "${cartItem.productId}" is no longer available`);
        error.statusCode = 400;
        throw error;
      }
      if (product.stockQty < cartItem.quantity) {
        const error = new Error(`Insufficient stock for "${product.name}"`);
        error.statusCode = 400;
        throw error;
      }

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: cartItem.quantity,
        priceAtPurchase: product.price,
        image: product.images[0] || '',
      });
    }

    // 3. Calculate subtotal
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    // 4. Apply coupon if provided
    let discount = 0;
    let couponId = null;
    let retailerId = null;

    if (couponCode) {
      const coupon = await Coupon.findByCode(couponCode);
      if (!coupon) {
        const error = new Error('Invalid coupon code');
        error.statusCode = 400;
        throw error;
      }

      const validation = coupon.checkValidity(subtotal);
      if (!validation.valid) {
        const error = new Error(validation.message);
        error.statusCode = 400;
        throw error;
      }

      discount = coupon.apply(subtotal);
      couponId = coupon._id;
      retailerId = coupon.retailerId;

      await coupon.incrementUsage();
    }

    const totalAmount = subtotal - discount;

    // 5. Create order
    const order = await Order.create({
      customerId: userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      discount,
      totalAmount,
      couponId,
      retailerId,
      paymentMethod,
      status: 'confirmed',
    });

    // 6. Deduct stock for each product
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQty: -item.quantity },
      });
    }

    // 7. Create commission if retailer-linked
    if (retailerId) {
      await Commission.calculate({
        retailerId,
        orderId: order._id,
        orderAmount: totalAmount,
        commissionPercent: 10, // 10% default commission
      });
    }

    // 8. Clear cart
    await cart.clear();

    return order;
  }

  /**
   * Get all orders (admin view) with optional status filter.
   * @param {Object} filters - { status }
   */
  async getAll(filters = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    return Order.find(query)
      .populate('customerId', 'name email')
      .populate('retailerId', 'name email')
      .sort({ createdAt: -1 });
  }

  /**
   * Get orders for a specific customer.
   * @param {string} userId
   */
  async getByUser(userId) {
    return Order.find({ customerId: userId }).sort({ createdAt: -1 });
  }

  /**
   * Get orders linked to a specific vendor (retailer).
   * @param {string} vendorId
   */
  async getByVendor(vendorId) {
    return Order.find({ retailerId: vendorId })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });
  }

  /**
   * Get a single order by ID.
   * @param {string} id
   */
  async getById(id) {
    const order = await Order.findById(id)
      .populate('customerId', 'name email')
      .populate('retailerId', 'name email');
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }
    return order;
  }

  /**
   * Update order status (admin).
   * @param {string} id
   * @param {string} newStatus
   */
  async updateStatus(id, newStatus) {
    const order = await Order.findById(id);
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }
    return order.updateStatus(newStatus);
  }

  /**
   * Get analytics data for admin dashboard.
   */
  async getAnalytics() {
    const [totalOrders, totalRevenue, statusCounts] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
    };
  }
}

export default new OrderService();
