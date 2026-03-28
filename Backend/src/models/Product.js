import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'At least one image is required',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    mrp: {
      type: Number,
      required: [true, 'MRP is required'],
      min: [0, 'MRP cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Desert', 'Tower', 'Personal', 'Industrial', 'Window'],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    stockQty: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Instance Methods ───

/**
 * Update stock quantity by a given delta.
 * @param {number} delta - Positive to add, negative to subtract
 */
productSchema.methods.updateStock = function (delta) {
  this.stockQty = Math.max(0, this.stockQty + delta);
  return this.save();
};

/**
 * Soft-delete: mark product as inactive.
 */
productSchema.methods.deactivate = function () {
  this.isActive = false;
  return this.save();
};

/**
 * Reactivate a previously deactivated product.
 */
productSchema.methods.activate = function () {
  this.isActive = true;
  return this.save();
};

// ─── Static Methods ───

/**
 * Find all active products with optional filters.
 * @param {Object} filters - { category, search, minPrice, maxPrice }
 */
productSchema.statics.findActive = function (filters = {}) {
  const query = { isActive: true };
  if (filters.category) query.category = filters.category;
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }
  if (filters.search) {
    query.name = { $regex: filters.search, $options: 'i' };
  }
  return this.find(query).sort({ createdAt: -1 });
};

const Product = mongoose.model('Product', productSchema);
export default Product;
