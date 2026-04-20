import axios, { AxiosInstance } from 'axios';

const API_BASE = 'https://siddham-coolers-api.onrender.com/api';

/**
 * ApiService — OOP wrapper around Axios for all API calls.
 */
class ApiService {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      headers: { 'Content-Type': 'application/json' },
    });

    // Attach JWT token to every request
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('siddham_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 responses globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('siddham_token');
          localStorage.removeItem('siddham_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url, params = {}) {
    const res = await this.client.get(url, { params });
    return res.data;
  }

  async post(url, data = {}) {
    const res = await this.client.post(url, data);
    return res.data;
  }

  async put(url, data = {}) {
    const res = await this.client.put(url, data);
    return res.data;
  }

  async patch(url, data = {}) {
    const res = await this.client.patch(url, data);
    return res.data;
  }

  async delete(url) {
    const res = await this.client.delete(url);
    return res.data;
  }
}

const api = new ApiService();

// ─── Auth API ───
export class AuthApi {
  static login(email, password) { return api.post('/auth/login', { email, password }); }
  static register(data) { return api.post('/auth/register', data); }
  static getMe() { return api.get('/auth/me'); }
  static updateProfile(data) { return api.put('/auth/profile', data); }
}

// ─── Product API ───
export class ProductApi {
  static getAll(filters = {}) { return api.get('/products', filters); }
  static getAllAdmin() { return api.get('/products/admin'); }
  static getById(id: string) { return api.get(`/products/${id}`); }
  static create(data: any) { return api.post('/products', data); }
  static update(id: string, data: any) { return api.put(`/products/${id}`, data); }
  static delete(id: string) { return api.delete(`/products/${id}`); }
}

// ─── Order API ───
export class OrderApi {
  static create(data: any) { return api.post('/orders', data); }
  static getAll(filters = {}) { return api.get('/orders', filters); }
  static getById(id: string) { return api.get(`/orders/${id}`); }
  static updateStatus(id: string, status: string) { return api.patch(`/orders/${id}/status`, { status }); }
  static getAnalytics() { return api.get('/orders/analytics'); }
}

// ─── Vendor API ───
export class VendorApi {
  static getAll() { return api.get('/vendors'); }
  static getById(id) { return api.get(`/vendors/${id}`); }
  static create(data) { return api.post('/vendors', data); }
  static delete(id) { return api.delete(`/vendors/${id}`); }
  static getSales(id) { return api.get(`/vendors/${id}/sales`); }
  static getPayouts(id) { return api.get(`/vendors/${id}/payouts`); }
  static myDashboard() { return api.get('/vendors/me/dashboard'); }
}

// ─── Cart API ───
export class CartApi {
  static get() { return api.get('/cart'); }
  static addItem(productId, quantity = 1) { return api.post('/cart/items', { productId, quantity }); }
  static updateItem(productId, quantity) { return api.put(`/cart/items/${productId}`, { quantity }); }
  static removeItem(productId) { return api.delete(`/cart/items/${productId}`); }
  static clear() { return api.delete('/cart'); }
}

// ─── Coupon API ───
export class CouponApi {
  static validate(code, orderAmount) { return api.post('/coupons/validate', { code, orderAmount }); }
}

export default api;
