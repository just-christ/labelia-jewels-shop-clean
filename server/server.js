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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://labelia-jewel.com',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

async function initializeDatabase() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // DROP toutes les tables pour repartir propre
    await prisma.$executeRaw`DROP TABLE IF EXISTS products CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS orders CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS users CASCADE`;

    // Recréer avec les bons types (JSONB pour colors, sizes, images)
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

    // Admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminId = 'admin-' + Date.now();
    await prisma.$executeRaw`
      INSERT INTO users (id, email, password, role) 
      VALUES (${adminId}, 'admin@labelia.fr', ${hashedPassword}, 'admin')
      ON CONFLICT (email) DO NOTHING
    `;
    console.log('✅ Admin user ready');

    // Produits avec JSONB — pas de TEXT[], plus de bug
    console.log('🌱 Creating 7 real Labelia products...');

    await prisma.$executeRaw`
      INSERT INTO products (id, name, description, price, category, colors, sizes, stock, images, "packagingImage", "videoUrl")
      VALUES 
        ('prod-1', 'bague de fiancaille Lumina - Argent pur & diamant Moissanite',
          'Un cadeau romantique parfait, cette bague de fiancailles fine en argent pur avec diamant unique illumine l''amour.',
          250000, 'bague', '["argent"]'::jsonb, '["50","52","54","56"]'::jsonb, 10,
          '{"argent": ["JH0A9575.jpg", "JH0A9678.jpg", "JH0A9690.jpg"]}'::jsonb, 'JH0A9831.jpg', ''),

        ('prod-2', 'bague de fiancaille AINA - Argent pur & diamant Moissanite & zircon',
          'La bague AINA associe un diamant central etincelant a un halo de petites pierres en zircon.',
          320000, 'bague', '["argent"]'::jsonb, '["50","52","54","56"]'::jsonb, 8,
          '{"argent": ["JH0A3163_3.jpg", "JH0A3163_4.jpg", "JH0A3163_2.jpg"]}'::jsonb, 'JH0A3163.jpg', ''),

        ('prod-3', 'bague de fiancaille Hera - bague de fiancaille pour femme',
          'Offrez un cadeau precieux et inoubliable avec la bague Hera, diamant moissanite central.',
          280000, 'bague', '["argent"]'::jsonb, '["50","52","54","56"]'::jsonb, 12,
          '{"argent": ["JH0A9850.jpg", "JH0A0631.jpg", "JH0A0060.jpg"]}'::jsonb, 'JH0A0055.jpg', ''),

        ('prod-4', 'chaine pour femme Lovea',
          'Exprimez votre amour avec le collier Lovea, un bijou elegant.',
          180000, 'chaîne', '["argent"]'::jsonb, '["40 cm","45 cm","50 cm"]'::jsonb, 15,
          '{"argent": ["JH0A8027.jpg", "JH0A8027_2.jpg"]}'::jsonb, '', ''),

        ('prod-5', 'collier Lys - bijoux original pour femme',
          'Un bijou minimaliste et raffine avec un diamant rond central comme medaille.',
          150000, 'chaîne', '["argent"]'::jsonb, '["40 cm","45 cm","50 cm"]'::jsonb, 20,
          '{"argent": ["Image_4.jpg", "Image_2.jpg"]}'::jsonb, '', ''),

        ('prod-6', 'Bracelet Vea - bijoux tendance',
          'Le bracelet Vea seduit par son oeil central recouvert de diamants Moissanite.',
          120000, 'bracelet', '["argent"]'::jsonb, '["16 cm","18 cm","20 cm"]'::jsonb, 25,
          '{"argent": ["JH0A1768.jpg", "JH0A1768_1.jpg", "JH0A1768_2.jpg", "JH0A1768_3.jpg"]}'::jsonb, '', ''),

        ('prod-7', 'Bracelet Lys - Eclat et feminite',
          'Offrez le bracelet Lys, un bijou precieux et lumineux avec diamant central.',
          135000, 'bracelet', '["argent"]'::jsonb, '["16 cm","18 cm","20 cm"]'::jsonb, 18,
          '{"argent": ["579A6473.jpg", "115A9447.jpg", "2X5A8099.jpg"]}'::jsonb, '', '')
    `;

    console.log('✅ 7 real Labelia products created!');

  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

app.listen(PORT, async () => {
  console.log(`🚀 Server running on https://labelia-backend.onrender.com:${PORT}`);
  await initializeDatabase();
});

export default app;