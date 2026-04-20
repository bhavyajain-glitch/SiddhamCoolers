import ProductService from '../services/ProductService';

/**
 * ProductController — handles product CRUD HTTP requests.
 */
class ProductController {
  /**
   * GET /api/products — public listing
   */
  async getAll(req, res, next) {
    try {
      const products = await ProductService.getAll(req.query);
      res.json({ success: true, data: products, count: products.length });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/admin — admin listing (includes inactive)
   */
  async getAllAdmin(req, res, next) {
    try {
      const products = await ProductService.getAllAdmin();
      res.json({ success: true, data: products, count: products.length });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/:id — single product
   */
  async getById(req, res, next) {
    try {
      const product = await ProductService.getById(req.params.id);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/products — create (admin only)
   */
  async create(req, res, next) {
    try {
      const product = await ProductService.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/products/:id — update (admin only)
   */
  async update(req, res, next) {
    try {
      const product = await ProductService.update(req.params.id, req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/products/:id — soft delete (admin only)
   */
  async delete(req, res, next) {
    try {
      await ProductService.delete(req.params.id);
      res.json({ success: true, message: 'Product deactivated' });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
