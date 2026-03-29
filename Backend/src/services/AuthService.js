import User from '../models/User.js';

/**
 * AuthService — handles user registration, authentication, and profile management.
 */
class AuthService {
  /**
   * Register a new user.
   * @param {Object} data - { name, email, password, phone, role }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async register({ name, email, password, phone, role = 'customer' }) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password, // pre-save hook will hash it
      phone: phone || '',
      role,
    });

    const token = user.generateToken();
    return { user: user.toSafeObject(), token };
  }

  /**
   * Authenticate a user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = user.generateToken();
    return { user: user.toSafeObject(), token };
  }

  /**
   * Get user by ID (without password hash).
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update user profile fields.
   * @param {string} userId
   * @param {Object} updates - { name, phone, avatar }
   */
  async updateProfile(userId, updates) {
    const allowedUpdates = ['name', 'phone', 'avatar'];
    const sanitized = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) sanitized[key] = updates[key];
    }

    const user = await User.findByIdAndUpdate(userId, sanitized, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

export default new AuthService();
