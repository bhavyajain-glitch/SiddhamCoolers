import VendorService from '../services/VendorService.js';

/**
 * VendorController — handles vendor management HTTP requests.
 */
class VendorController {
  /**
   * GET /api/vendors — list all vendors (admin only)
   */
  async getAll(req, res, next) {
    try {
      const vendors = await VendorService.getAll();
      res.json({ success: true, data: vendors, count: vendors.length });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vendors/:id — single vendor details
   */
  async getById(req, res, next) {
    try {
      const vendor = await VendorService.getById(req.params.id);
      res.json({ success: true, data: vendor });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/vendors — create a new vendor (admin only)
   */
  async create(req, res, next) {
    try {
      const { name, email, password, phone, couponCode, discountPercent, maxDiscountAmount } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      }

      const vendor = await VendorService.create({
        name,
        email,
        password,
        phone,
        couponCode,
        discountPercent,
        maxDiscountAmount,
      });
      res.status(201).json({ success: true, data: vendor });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/vendors/:id — delete a vendor (admin only)
   */
  async delete(req, res, next) {
    try {
      const result = await VendorService.delete(req.params.id);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vendors/:id/sales — vendor sales data
   */
  async getSales(req, res, next) {
    try {
      // Vendor can only see own data; admin can see any
      const vendorId = req.user.role === 'admin' ? req.params.id : req.user._id;
      const salesData = await VendorService.getSalesData(vendorId);
      res.json({ success: true, data: salesData });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vendors/:id/payouts — vendor payout data
   */
  async getPayouts(req, res, next) {
    try {
      const vendorId = req.user.role === 'admin' ? req.params.id : req.user._id;
      const payouts = await VendorService.getPayouts(vendorId);
      res.json({ success: true, data: payouts });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vendors/me/dashboard — current vendor's full dashboard
   */
  async myDashboard(req, res, next) {
    try {
      const vendorData = await VendorService.getById(req.user._id);
      const salesData = await VendorService.getSalesData(req.user._id);
      res.json({
        success: true,
        data: {
          vendor: vendorData,
          sales: salesData,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new VendorController();
