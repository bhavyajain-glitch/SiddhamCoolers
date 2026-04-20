import 'dotenv/config';
import mongoose from 'mongoose';
import database from './src/config/database';
import User from './src/models/User';
import Product from './src/models/Product';
import Coupon from './src/models/Coupon';
import Order from './src/models/Order';
import Commission from './src/models/Commission';
import Cart from './src/models/Cart';

/**
 * Seeder class — populates the database with initial data.
 */
class Seeder {
  constructor() {
    this.adminUser = null;
    this.vendors = [];
    this.products = [];
    this.customers = [];
  }

  async execute() {
    console.log('🗑️  Clearing existing data...');
    await this.clearAll();

    console.log('👤 Creating admin user...');
    await this.seedAdmin();

    console.log('🛍️  Creating vendors...');
    await this.seedVendors();

    console.log('📦 Creating products...');
    await this.seedProducts();

    console.log('👥 Creating customers...');
    await this.seedCustomers();

    console.log('🛒 Creating sample orders...');
    await this.seedOrders();

    console.log('\n✅ Seed complete!\n');
    this.printCredentials();
  }

  async run() {
    try {
      await database.connect(process.env.MONGO_URI);
      await this.execute();
      process.exit(0);
    } catch (error) {
      console.error('❌ Seed failed:', error.message);
      process.exit(1);
    }
  }

  async clearAll() {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await Order.deleteMany({});
    await Commission.deleteMany({});
    await Cart.deleteMany({});
  }

  async seedAdmin() {
    this.adminUser = await User.create({
      name: 'Siddham Admin',
      email: 'admin@siddham.com',
      passwordHash: 'admin123',
      phone: '+91 98765 00001',
      role: 'admin',
    });
  }

  async seedVendors() {
    const vendorData = [
      { name: 'Rajesh Sharma', email: 'rajesh@vendor.com', password: 'vendor123', phone: '+91 98765 10001', couponCode: 'RAJESH10', discount: 10, maxDiscount: 500 },
      { name: 'Priya Patel', email: 'priya@vendor.com', password: 'vendor123', phone: '+91 98765 10002', couponCode: 'PRIYA15', discount: 15, maxDiscount: 750 },
    ];

    for (const v of vendorData) {
      const vendor = await User.create({
        name: v.name,
        email: v.email,
        passwordHash: v.password,
        phone: v.phone,
        role: 'retailer',
      });

      await Coupon.create({
        code: v.couponCode,
        retailerId: vendor._id,
        discountPercent: v.discount,
        maxDiscountAmount: v.maxDiscount,
        minOrderValue: 1000,
      });

      this.vendors.push(vendor);
    }
  }

  async seedProducts() {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const assetsDir = path.join(__dirname, '../Assets/Coolers');
    
    let imageFiles = [];
    try {
      const files = fs.readdirSync(assetsDir);
      imageFiles = files.filter(f => f.match(/\.(png|jpg|jpeg)$/i) && !f.startsWith('.'));
    } catch (err) {
      console.warn('⚠️  Assets directory not found, skipping dynamic image loading.');
    }

    const productsData = imageFiles.map(file => {
      // e.g. "Airmax 75.png" -> "Airmax 75"
      const name = file.replace(/\.[^/.]+$/, "").trim();
      
      // Extract capacity
      const capacityMatch = name.match(/\d+/);
      const capacityNum = capacityMatch ? parseInt(capacityMatch[0], 10) : 50;
      
      let category = 'Desert';
      if (name.toLowerCase().includes('tower')) {
        category = 'Tower';
      } else if (name.toLowerCase().includes('window')) {
        category = 'Window';
      } else if (capacityNum <= 40) {
        category = 'Personal';
      } else if (capacityNum >= 100) {
        category = 'Industrial';
      }

      const price = capacityNum * 120 + 3999;
      
      return {
        name: name,
        description: `Premium smart cooling experience with the ${name}. Powerful airflow, high-density honeycomb pads, and robust build quality designed for maximum efficiency.`,
        images: [`https://siddham-coolers-api.onrender.com/assets/${encodeURIComponent(file)}`],
        price: price,
        mrp: Math.floor(price * 1.3),
        category: category,
        specifications: { 
          capacity: `${capacityNum}L`, 
          airThrow: `${Math.floor(capacityNum * 0.8)} ft`, 
          power: `${capacityNum * 2}W`, 
          coverage: `${capacityNum * 10} sq.ft` 
        },
        stockQty: Math.floor(Math.random() * 50) + 10,
        avgRating: Number((Math.random() * 1 + 4).toFixed(1)), // 4.0 to 5.0
        reviewCount: Math.floor(Math.random() * 200) + 15,
        isActive: true
      };
    });

    if (productsData.length > 0) {
      this.products = await Product.insertMany(productsData);
      console.log(`📦 Seeded ${productsData.length} dynamic products from Assets folder.`);
    } else {
      console.log('📦 No products seeded (no images found).');
      this.products = [];
    }
  }

  async seedCustomers() {
    const customersData = [
      { name: 'Amit Kumar', email: 'amit@customer.com', password: 'customer123', phone: '+91 98765 20001' },
      { name: 'Sneha Gupta', email: 'sneha@customer.com', password: 'customer123', phone: '+91 98765 20002' },
    ];

    for (const c of customersData) {
      const customer = await User.create({
        name: c.name,
        email: c.email,
        passwordHash: c.password,
        phone: c.phone,
        role: 'customer',
      });
      this.customers.push(customer);
    }
  }

  async seedOrders() {
    const vendor = this.vendors[0];
    const coupon = await Coupon.findOne({ retailerId: vendor._id });

    // Order 1: With coupon (generates commission)
    const order1 = await Order.create({
      customerId: this.customers[0]._id,
      items: [
        { productId: this.products[0]._id, productName: this.products[0].name, quantity: 1, priceAtPurchase: this.products[0].price, image: this.products[0].images[0] },
      ],
      shippingAddress: { fullName: 'Amit Kumar', phone: '+91 98765 20001', line1: '402, Skyline Apartments', city: 'Bangalore', state: 'Karnataka', pincode: '560038' },
      subtotal: 24500,
      discount: 500,
      totalAmount: 24000,
      couponId: coupon._id,
      retailerId: vendor._id,
      status: 'delivered',
      paymentMethod: 'cod',
    });

    await Commission.calculate({ retailerId: vendor._id, orderId: order1._id, orderAmount: 24000, commissionPercent: 10 });
    await coupon.incrementUsage();

    // Order 2: Without coupon
    await Order.create({
      customerId: this.customers[1]._id,
      items: [
        { productId: this.products[1]._id, productName: this.products[1].name, quantity: 2, priceAtPurchase: this.products[1].price, image: this.products[1].images[0] },
        { productId: this.products[5]._id, productName: this.products[5].name, quantity: 1, priceAtPurchase: this.products[5].price, image: this.products[5].images[0] },
      ],
      shippingAddress: { fullName: 'Sneha Gupta', phone: '+91 98765 20002', line1: '12B, Green Valley', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      subtotal: 21497,
      discount: 0,
      totalAmount: 21497,
      status: 'processing',
      paymentMethod: 'cod',
    });

    // Order 3: With second vendor's coupon
    const vendor2 = this.vendors[1];
    const coupon2 = await Coupon.findOne({ retailerId: vendor2._id });

    const order3 = await Order.create({
      customerId: this.customers[0]._id,
      items: [
        { productId: this.products[3]._id, productName: this.products[3].name, quantity: 1, priceAtPurchase: this.products[3].price, image: this.products[3].images[0] },
      ],
      shippingAddress: { fullName: 'Amit Kumar', phone: '+91 98765 20001', line1: '402, Skyline Apartments', city: 'Bangalore', state: 'Karnataka', pincode: '560038' },
      subtotal: 14999,
      discount: 750,
      totalAmount: 14249,
      couponId: coupon2._id,
      retailerId: vendor2._id,
      status: 'shipped',
      paymentMethod: 'upi',
    });

    await Commission.calculate({ retailerId: vendor2._id, orderId: order3._id, orderAmount: 14249, commissionPercent: 10 });
    await coupon2.incrementUsage();
  }

  printCredentials() {
    console.log('┌─────────────────────────────────────────────┐');
    console.log('│         LOGIN CREDENTIALS                   │');
    console.log('├─────────────────────────────────────────────┤');
    console.log('│  Admin:                                     │');
    console.log('│    Email:    admin@siddham.com               │');
    console.log('│    Password: admin123                        │');
    console.log('│                                             │');
    console.log('│  Vendor 1:                                  │');
    console.log('│    Email:    rajesh@vendor.com               │');
    console.log('│    Password: vendor123                       │');
    console.log('│    Coupon:   RAJESH10 (10% off)              │');
    console.log('│                                             │');
    console.log('│  Vendor 2:                                  │');
    console.log('│    Email:    priya@vendor.com                │');
    console.log('│    Password: vendor123                       │');
    console.log('│    Coupon:   PRIYA15 (15% off)               │');
    console.log('│                                             │');
    console.log('│  Customer:                                  │');
    console.log('│    Email:    amit@customer.com               │');
    console.log('│    Password: customer123                     │');
    console.log('└─────────────────────────────────────────────┘');
  }
}

export default Seeder;

// Run automatically if this script is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const seeder = new Seeder();
  seeder.run();
}
