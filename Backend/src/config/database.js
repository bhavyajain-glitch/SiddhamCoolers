import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Database class — connects to MongoDB (local or in-memory fallback).
 */
class Database {
  constructor() {
    this.connection = null;
    this.memoryServer = null;
  }

  /**
   * Connect to MongoDB. Falls back to in-memory server if local connection fails.
   * @param {string} uri - MongoDB connection URI
   */
  async connect(uri) {
    try {
      // Try connecting to the provided URI first
      this.connection = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ MongoDB connected: ${this.connection.connection.host}`);
      return this.connection;
    } catch (error) {
      console.log('⚠️  Local MongoDB not available. Starting in-memory server...');
      return this.connectMemory();
    }
  }

  /**
   * Start and connect to an in-memory MongoDB server.
   */
  async connectMemory() {
    try {
      this.memoryServer = await MongoMemoryServer.create();
      const memoryUri = this.memoryServer.getUri();
      this.connection = await mongoose.connect(memoryUri);
      console.log(`✅ MongoDB Memory Server running at: ${memoryUri}`);
      console.log('   ⚠️  Data will be lost when server stops.');
      return this.connection;
    } catch (error) {
      console.error(`❌ Failed to start memory server: ${error.message}`);
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
    }
    if (this.memoryServer) {
      await this.memoryServer.stop();
    }
    console.log('MongoDB disconnected');
  }
}

export default new Database();
