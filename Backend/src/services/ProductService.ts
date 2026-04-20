import Product from '../models/Product';
import { BaseService } from './BaseService';
import { IProduct } from '../interfaces';

/**
 * ProductService — business logic for product CRUD operations.
 */
class ProductService extends BaseService<IProduct> {
  constructor() {
    super(Product);
  }
  /**
   * Get all active products with optional filters.
   * @param {Object} filters - { category, search, minPrice, maxPrice }
   * @returns {Promise<IProduct[]>}
   */
  public async getAll(filters: any = {}): Promise<IProduct[]> {
    return (Product as any).findActive(filters);
  }

  /**
   * Get all products including inactive (admin view).
   * @returns {Promise<IProduct[]>}
   */
  public async getAllAdmin(): Promise<IProduct[]> {
    return this.model.find().sort({ createdAt: -1 });
  }

  /**
   * Get a single product by ID.
   * @param {string} id
   * @returns {Promise<IProduct>}
   */
  public async getById(id: string): Promise<IProduct> {
    const product = await super.findById(id);
    if (!product) {
      const error: any = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Create a new product.
   * @param {Object} data
   * @returns {Promise<IProduct>}
   */
  public async create(data: Partial<IProduct>): Promise<IProduct> {
    return super.create(data);
  }

  /**
   * Update an existing product.
   * @param {string} id
   * @param {Object} updates
   * @returns {Promise<IProduct>}
   */
  public async update(id: string, updates: Partial<IProduct>): Promise<IProduct> {
    const product = await super.update(id, updates);
    if (!product) {
      const error: any = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  /**
   * Soft-delete a product by marking it inactive.
   * @param {string} id
   */
  public async delete(id: string): Promise<IProduct | null> {
    const product: any = await super.findById(id);
    if (!product) {
      const error: any = new Error('Product not found');
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
  public async updateStock(id: string, delta: number): Promise<IProduct> {
    const product: any = await super.findById(id);
    if (!product) {
      const error: any = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product.updateStock(delta);
  }
}

export default new ProductService();
