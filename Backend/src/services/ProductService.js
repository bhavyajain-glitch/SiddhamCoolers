import Product from '../models/Product.js';

/**
 * ProductService — business logic for product CRUD operations.
 */
class ProductService {
  /**
   * Get all active products with optional filters.
   * @param {Object} filters - { category, search, minPrice, maxPrice }
   * @returns {Promise<Product[]>}
   */
  async getAll(filters = {}) {
    return Product.findActive(filters);
  }

  /**
   * Get all products including inactive (admin view).
   * @returns {Promise<Product[]>}
   */
  async getAllAdmin() {
    return Product.find().sort({ createdAt: -1 });
  }

  /**
   * Get a single product by ID.
   * @param {string} id
   * @returns {Promise<Product>}
   */
  async getById(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Create a new product.
   * @param {Object} data
   * @returns {Promise<Product>}
   */
  async create(data) {
    return Product.create(data);
  }

  /**
   * Update an existing product.
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<Product>}
   */
  async update(id, updates) {
    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Soft-delete a product by marking it inactive.
   * @param {string} id
   */
  async delete(id) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product.deactivate();
  }

  /**
   * Update stock quantity.
   * @param {string} id
   * @param {number} delta
   */
  async updateStock(id, delta) {
    const product = await Product.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product.updateStock(delta);
  }
}

export default new ProductService();
