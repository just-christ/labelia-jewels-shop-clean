import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import customerRoutes from './routes/customer.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Servir les fichiers uploadés statiquement
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and create admin user
async function initializeDatabase() {
  const prisma = new PrismaClient();
  
  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Create tables if they don't exist (using raw SQL for PostgreSQL)
    try {
      // Create users table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      // Create products table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          price INTEGER NOT NULL,
          category TEXT NOT NULL,
          colors TEXT[],
          sizes TEXT[],
          stock INTEGER NOT NULL,
          images JSONB DEFAULT '[]',
          "packagingImage" TEXT,
          "videoUrl" TEXT,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      // Create orders table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          "userId" TEXT,
          status TEXT DEFAULT 'pending',
          total INTEGER NOT NULL,
          items JSONB NOT NULL,
          "shippingAddress" JSONB,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      console.log('✅ Tables created successfully');
    } catch (error) {
      console.log('⚠️ Tables might already exist:', error.message);
    }

    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@labelia.fr' }
    });

    if (!adminUser) {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          email: 'admin@labelia.fr',
          password: hashedPassword,
          role: 'admin'
        }
      });
      console.log('✅ Default admin user created (admin@labelia.fr / admin123)');
    }

    // Check if products exist, if not create sample products
    const productCount = await prisma.product.count();
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'Chaîne Éclat',
          description: 'Une chaîne fine et délicate, parfaite pour un look épuré au quotidien.',
          price: 49,
          category: 'chaîne',
          colors: ['argent', 'doré'],
          sizes: ['40 cm', '45 cm', '50 cm'],
          stock: 25,
          images: []
        },
        {
          name: 'Bracelet Rosée',
          description: 'Un bracelet fin et raffiné, parfait pour sublimer votre poignet.',
          price: 39,
          category: 'bracelet',
          colors: ['argent', 'doré'],
          sizes: ['16 cm', '18 cm', '20 cm'],
          stock: 22,
          images: []
        },
        {
          name: 'Bague Sérénité',
          description: 'Bague fine et épurée, un bijou essentiel pour chaque jour.',
          price: 35,
          category: 'bague',
          colors: ['argent', 'doré'],
          sizes: ['48', '50', '52', '54', '56'],
          stock: 28,
          images: []
        }
      ];

      await prisma.product.createMany({
        data: sampleProducts
      });
      console.log('✅ Sample products created');
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error);
    console.log('⚠️  Make sure MySQL is running and the database exists');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Initialize database
  await initializeDatabase();
});

export default app;
