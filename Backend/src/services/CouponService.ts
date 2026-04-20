import Coupon from '../models/Coupon';

/**
 * CouponService — validates and manages coupon codes.
 */
class CouponService {
  /**
   * Validate a coupon code against an order amount.
   * @param {string} code
   * @param {number} orderAmount
   * @returns {Promise<Object>} - { valid, discount, coupon, message }
   */
  async validate(code, orderAmount) {
    const coupon = await Coupon.findByCode(code);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code.' };
    }

    const validation = coupon.checkValidity(orderAmount);
    if (!validation.valid) {
      return { valid: false, discount: 0, message: validation.message };
    }

    const discount = coupon.apply(orderAmount);
    return {
      valid: true,
      discount,
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
      message: `Coupon applied! You save ₹${discount}.`,
    };
  }

  /**
   * Create a coupon for a vendor.
   * @param {string} vendorId
   * @param {Object} data - { code, discountPercent, maxDiscountAmount, minOrderValue }
   */
  async create(vendorId, data) {
    return Coupon.create({
      ...data,
      retailerId: vendorId,
    });
  }

  /**
   * Get coupon for a specific vendor.
   * @param {string} vendorId
   */
  async getByVendor(vendorId) {
    return Coupon.findOne({ retailerId: vendorId });
  }

  /**
   * Update a coupon.
   * @param {string} couponId
   * @param {Object} updates
   */
  async update(couponId, updates) {
    return Coupon.findByIdAndUpdate(couponId, updates, { new: true, runValidators: true });
  }
}

export default new CouponService();
