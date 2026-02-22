import CartService from '../services/CartService.js';

/**
 * CartController — handles shopping cart HTTP requests.
 */
class CartController {
  /**
   * GET /api/cart — get current user's cart
   */
  async getCart(req, res, next) {
    try {
      const cart = await CartService.getCart(req.user._id);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/cart/items — add item to cart
   */
  async addItem(req, res, next) {
    try {
      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }
      const cart = await CartService.addItem(req.user._id, productId, quantity || 1);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/cart/items/:productId — update item quantity
   */
  async updateItem(req, res, next) {
    try {
      const { quantity } = req.body;
      const cart = await CartService.updateQuantity(req.user._id, req.params.productId, quantity);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/cart/items/:productId — remove item from cart
   */
  async removeItem(req, res, next) {
    try {
      const cart = await CartService.removeItem(req.user._id, req.params.productId);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/cart — clear entire cart
   */
  async clearCart(req, res, next) {
    try {
      const result = await CartService.clearCart(req.user._id);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
