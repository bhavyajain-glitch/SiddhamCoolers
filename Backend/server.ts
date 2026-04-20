import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import database from './src/config/database';
import { errorHandler } from './src/middleware/errorHandler';
import User from './src/models/User';
import Seeder from './seed';

// Route imports
import authRoutes from './src/routes/authRoutes';
import productRoutes from './src/routes/productRoutes';
import orderRoutes from './src/routes/orderRoutes';
import vendorRoutes from './src/routes/vendorRoutes';
import cartRoutes from './src/routes/cartRoutes';
import couponRoutes from './src/routes/couponRoutes';

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
    this.app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000', 'https://siddham-coolers.vercel.app'], credentials: true }));
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

      // ─── START TEMP MIGRATION SCRIPT ───
      // Automatically transition any old localhost images to the live Render URL
      const ProductModel = (await import('./src/models/Product')).default;
      const productsToUpdate = await ProductModel.find({ images: { $regex: 'http://localhost:5001' } });
      if (productsToUpdate.length > 0) {
        console.log(`🔄 Migrating ${productsToUpdate.length} product images from localhost to Render URL...`);
        for (const product of productsToUpdate) {
          const newImages = (product as any).images.map((img: string) => 
            img.replace('http://localhost:5001', 'https://siddham-coolers-api.onrender.com')
          );
          await ProductModel.findByIdAndUpdate(product._id, { images: newImages });
        }
        console.log('✅ Image migration complete!');
      }
      // ─── END TEMP MIGRATION SCRIPT ───

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
