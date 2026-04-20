import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    discountPercent: {
      type: Number,
      required: true,
      min: [1, 'Discount must be at least 1%'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    maxDiscountAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ─── Instance Methods ───

/**
 * Check if this coupon can be applied to an order of given amount.
 * @param {number} orderAmount
 * @returns {{ valid: boolean, message?: string }}
 */
couponSchema.methods.checkValidity = function (orderAmount) {
  if (!this.isActive) {
    return { valid: false, message: 'This coupon is no longer active.' };
  }
  if (orderAmount < this.minOrderValue) {
    return { valid: false, message: `Minimum order value is ₹${this.minOrderValue}.` };
  }
  return { valid: true };
};

/**
 * Calculate the discount amount for a given order amount.
 * @param {number} orderAmount
 * @returns {number} discount amount
 */
couponSchema.methods.apply = function (orderAmount) {
  const discount = (orderAmount * this.discountPercent) / 100;
  return Math.min(discount, this.maxDiscountAmount);
};

/**
 * Increment usage count after successful order.
 */
couponSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  return this.save();
};

// ─── Static Methods ───

/**
 * Find a coupon by its code.
 * @param {string} code
 */
couponSchema.statics.findByCode = function (code) {
  return this.findOne({ code: code.toUpperCase() });
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
