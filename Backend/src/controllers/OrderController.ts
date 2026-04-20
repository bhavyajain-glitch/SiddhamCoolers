import OrderService from '../services/OrderService';

/**
 * OrderController — handles order-related HTTP requests.
 */
class OrderController {
  /**
   * POST /api/orders — place order from cart
   */
  async create(req, res, next) {
    try {
      const { shippingAddress, couponCode, paymentMethod } = req.body;
      if (!shippingAddress) {
        return res.status(400).json({ success: false, message: 'Shipping address is required' });
      }

      const order = await OrderService.create(
        req.user._id,
        shippingAddress,
        couponCode,
        paymentMethod
      );
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders — list orders (admin: all, customer: own)
   */
  async getAll(req, res, next) {
    try {
      let orders;
      if (req.user.role === 'admin') {
        orders = await OrderService.getAll(req.query);
      } else {
        orders = await OrderService.getByUser(req.user._id);
      }
      res.json({ success: true, data: orders, count: orders.length });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders/:id — single order
   */
  async getById(req, res, next) {
    try {
      const order = await OrderService.getById(req.params.id);

      // Non-admin can only see their own orders
      if (req.user.role !== 'admin' && order.customerId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/orders/:id/status — update status (admin only)
   */
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }
      const order = await OrderService.updateStatus(req.params.id, status);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/orders/analytics — dashboard analytics (admin only)
   */
  async getAnalytics(req, res, next) {
    try {
      const analytics = await OrderService.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
