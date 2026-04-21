import CouponService from '../services/CouponService.js';

/**
 * CouponController — handles coupon validation HTTP requests.
 */
class CouponController {
  /**
   * POST /api/coupons/validate — validate a coupon code
   */
  async validate(req, res, next) {
    try {
      const { code, orderAmount } = req.body;
      if (!code || !orderAmount) {
        return res.status(400).json({ success: false, message: 'Code and order amount are required' });
      }
      const result = await CouponService.validate(code, orderAmount);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new CouponController();
