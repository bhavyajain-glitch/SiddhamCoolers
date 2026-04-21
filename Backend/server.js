import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import database from './src/config/database.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import User from './src/models/User.js';
import Seeder from './seed.js';

// Route imports
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import vendorRoutes from './src/routes/vendorRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import couponRoutes from './src/routes/couponRoutes.js';

/**
 * Application class — Express server setup with OOP pattern.
 */
class Application {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
  }

  /**
   * Register all middleware.
   */
  configureMiddleware() {
    this.app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Serve Assets
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    this.app.use('/assets', express.static(path.join(__dirname, '../Assets/Coolers')));
  }

  /**
   * Register all API routes.
   */
  configureRoutes() {
    this.app.get('/api/health', (_req, res) => {
      res.json({ success: true, message: 'Siddham Coolers API is running', timestamp: new Date().toISOString() });
    });

    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/products', productRoutes);
    this.app.use('/api/orders', orderRoutes);
    this.app.use('/api/vendors', vendorRoutes);
    this.app.use('/api/cart', cartRoutes);
    this.app.use('/api/coupons', couponRoutes);

    // 404 handler
    this.app.use((_req, res) => {
      res.status(404).json({ success: false, message: 'Route not found' });
    });

    // Global error handler (must be last)
    this.app.use(errorHandler);
  }

  /**
   * Connect to database and start listening.
   */
  async start() {
    try {
      await database.connect(process.env.MONGO_URI);

      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Database is empty. Running seeder automatically...');
        const seeder = new Seeder();
        await seeder.execute();
      }

      this.configureMiddleware();
      this.configureRoutes();

      this.app.listen(this.port, () => {
        console.log(`\n🚀 Siddham Coolers API running on http://localhost:${this.port}`);
        console.log(`📋 Health check: http://localhost:${this.port}/api/health\n`);
      });
    } catch (error) {
      console.error('Failed to start server:', error.message);
      process.exit(1);
    }
  }
}

// Boot the application
const app = new Application();
app.start();
