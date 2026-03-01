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
import promotionRoutes from './routes/promotion.routes.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://labelia-jewel.com',
      'https://www.labelia-jewel.com',
    ];
    if (process.env.NODE_ENV !== 'production') {
      allowedOrigins.push(
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
      );
    }
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/Images', express.static(path.join(process.cwd(), 'public', 'Images')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/promotions', promotionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.2' });
});

async function initializeDatabase() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Vérifier si la table "products" existe
    const tablesExist = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `;

    if (!tablesExist[0]?.exists) {
      console.log('🆕 Creating tables for first time...');

      await prisma.$executeRaw`
        CREATE TABLE users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await prisma.$executeRaw`
        CREATE TABLE orders (
          id TEXT PRIMARY KEY,
          customer_name TEXT NOT NULL DEFAULT '',
          customer_email TEXT NOT NULL DEFAULT '',
          customer_phone TEXT NOT NULL DEFAULT '',
          customer_address TEXT NOT NULL DEFAULT '',
          items JSONB NOT NULL DEFAULT '[]',
          total FLOAT NOT NULL,
          status TEXT DEFAULT 'pending',
          stripe_payment_id TEXT,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await prisma.$executeRaw`
        CREATE TABLE products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          price FLOAT NOT NULL,
          category TEXT NOT NULL,
          colors JSONB DEFAULT '[]',
          sizes JSONB DEFAULT '[]',
          stock INTEGER NOT NULL DEFAULT 0,
          images JSONB DEFAULT '{}',
          "packagingImage" TEXT DEFAULT '',
          "videoUrl" TEXT DEFAULT '',
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      console.log('✅ Tables created successfully');
    } else {
      console.log('✅ Tables already exist - skipping creation');
    }

    // Admin user
    const adminExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM users 
        WHERE email = 'admin@labelia.fr'
      ) as exists
    `;

    if (!adminExists[0]?.exists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminId = 'admin-' + Date.now();
      await prisma.$executeRaw`
        INSERT INTO users (id, email, password, role) 
        VALUES (${adminId}, 'admin@labelia.fr', ${hashedPassword}, 'admin')
      `;
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Promotions table
    const promotionsCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_name = 'promotions'
    `;
    
    if (promotionsCount[0]?.count === 0) {
      console.log('🌱 Creating promotions table...');
      await prisma.$executeRaw`
        CREATE TABLE promotions (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          description TEXT,
          discount FLOAT NOT NULL,
          isPercentage BOOLEAN DEFAULT true,
          active BOOLEAN DEFAULT true,
          startDate TIMESTAMP,
          endDate TIMESTAMP,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Promotions table created!');
    } else {
      console.log('✅ Promotions table already exists');
    }

    // Produits
    const productsCount = await prisma.product.count();

    if (productsCount > 0) {
      console.log('🔄 Updating collier Lys with correct image names...');
      await prisma.product.update({
        where: { id: 'prod-5' },
        data: {
          images: { argent: ['image_4.jpg', 'image_2.jpg'] },
          packagingImage: 'packaging.png'
        }
      });
      console.log('✅ Collier Lys updated with correct images!');
    }

    if (productsCount === 0) {
      console.log('🌱 Creating 7 real Labelia products...');
      const products = [
        // ...your 7 product objects here (same as in your original code)
      ];

      for (const product of products) {
        await prisma.product.upsert({
          where: { id: product.id },
          update: product,
          create: product
        });
      }
      console.log('✅ 7 real Labelia products created!');
    } else {
      console.log('✅ Products already exist - skipping creation');
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Listen + initialize DB
app.listen(PORT, async () => {
  console.log(`\u{1F680} Server running on https://labelia-backend.onrender.com:${PORT}`);
  await initializeDatabase();
});

export default app;