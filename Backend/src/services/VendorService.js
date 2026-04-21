import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Commission from '../models/Commission.js';
import Order from '../models/Order.js';

/**
 * VendorService — manages vendor (retailer) lifecycle and data.
 */
class VendorService {
  /**
   * Get all vendors.
   * @returns {Promise<User[]>}
   */
  async getAll() {
    const vendors = await User.find({ role: 'retailer' }).select('-passwordHash').sort({ createdAt: -1 });
    // Attach coupon data to each vendor
    const vendorsWithCoupons = await Promise.all(
      vendors.map(async (vendor) => {
        const coupon = await Coupon.findOne({ retailerId: vendor._id });
        const earnings = await Commission.getTotalByRetailer(vendor._id);
        return {
          ...vendor.toObject(),
          coupon: coupon ? coupon.toObject() : null,
          earnings,
        };
      })
    );
    return vendorsWithCoupons;
  }

  /**
   * Get a single vendor by ID with full sales data.
   * @param {string} vendorId
   */
  async getById(vendorId) {
    const vendor = await User.findById(vendorId).select('-passwordHash');
    if (!vendor || vendor.role !== 'retailer') {
      const error = new Error('Vendor not found');
      error.statusCode = 404;
      throw error;
    }

    const coupon = await Coupon.findOne({ retailerId: vendorId });
    const earnings = await Commission.getTotalByRetailer(vendorId);

    return {
      ...vendor.toObject(),
      coupon: coupon ? coupon.toObject() : null,
      earnings,
    };
  }

  /**
   * Create a new vendor with an associated coupon code.
   * @param {Object} data - { name, email, password, phone, couponCode, discountPercent, maxDiscountAmount }
   */
  async create({ name, email, password, phone, couponCode, discountPercent = 10, maxDiscountAmount = 500 }) {
    // Check for existing email
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    // Create user with retailer role
    const vendor = await User.create({
      name,
      email,
      passwordHash: password,
      phone: phone || '',
      role: 'retailer',
    });

    // Create associated coupon
    const code = couponCode || `SIDDHAM-${name.toUpperCase().replace(/\s+/g, '-').slice(0, 10)}`;
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      retailerId: vendor._id,
      discountPercent,
      maxDiscountAmount,
      minOrderValue: 0,
    });

    return {
      ...vendor.toSafeObject(),
      coupon: coupon.toObject(),
    };
  }

  /**
   * Delete a vendor and their associated coupon.
   * @param {string} vendorId
   */
  async delete(vendorId) {
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== 'retailer') {
      const error = new Error('Vendor not found');
      error.statusCode = 404;
      throw error;
    }

    await Coupon.deleteMany({ retailerId: vendorId });
    await User.findByIdAndDelete(vendorId);

    return { message: 'Vendor deleted successfully' };
  }

  /**
   * Get sales data for a specific vendor.
   * @param {string} vendorId
   */
  async getSalesData(vendorId) {
    const orders = await Order.find({ retailerId: vendorId })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });

    const commissions = await Commission.find({ retailerId: vendorId })
      .populate('orderId', 'totalAmount status createdAt')
      .sort({ createdAt: -1 });

    const earnings = await Commission.getTotalByRetailer(vendorId);
    const coupon = await Coupon.findOne({ retailerId: vendorId });

    return {
      orders,
      commissions,
      earnings,
      coupon: coupon ? coupon.toObject() : null,
    };
  }

  /**
   * Get payout information for a vendor.
   * @param {string} vendorId
   */
  async getPayouts(vendorId) {
    const commissions = await Commission.find({ retailerId: vendorId })
      .populate('orderId', 'totalAmount status items createdAt')
      .sort({ createdAt: -1 });

    const earnings = await Commission.getTotalByRetailer(vendorId);

    return {
      commissions,
      ...earnings,
    };
  }
}

export default new VendorService();
