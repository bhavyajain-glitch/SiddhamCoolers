import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema(
  {
    retailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
    },
    orderAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    commissionPercent: {
      type: Number,
      required: true,
      min: 0,
    },
    commissionAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ─── Indexes ───
commissionSchema.index({ retailerId: 1 });
commissionSchema.index({ status: 1 });

// ─── Instance Methods ───

/**
 * Mark this commission as paid.
 */
commissionSchema.methods.markPaid = function () {
  this.status = 'paid';
  this.paidAt = new Date();
  return this.save();
};

// ─── Static Methods ───

/**
 * Calculate and create a commission record.
 * @param {Object} params - { retailerId, orderId, orderAmount, commissionPercent }
 */
commissionSchema.statics.calculate = function ({ retailerId, orderId, orderAmount, commissionPercent }) {
  const commissionAmount = Math.round((orderAmount * commissionPercent) / 100);
  return this.create({
    retailerId,
    orderId,
    orderAmount,
    commissionPercent,
    commissionAmount,
  });
};

/**
 * Get total earnings for a retailer.
 * @param {string} retailerId
 */
commissionSchema.statics.getTotalByRetailer = async function (retailerId) {
  const result = await this.aggregate([
    { $match: { retailerId: new mongoose.Types.ObjectId(retailerId) } },
    {
      $group: {
        _id: null,
        totalEarned: { $sum: '$commissionAmount' },
        totalPending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$commissionAmount', 0] },
        },
        totalPaid: {
          $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$commissionAmount', 0] },
        },
        count: { $sum: 1 },
      },
    },
  ]);
  return result[0] || { totalEarned: 0, totalPending: 0, totalPaid: 0, count: 0 };
};

const Commission = mongoose.model('Commission', commissionSchema);
export default Commission;
