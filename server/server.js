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
    if (productCount > 0) {
      console.log('🗑️ Deleting existing products...');
      await prisma.$executeRaw`DELETE FROM products`;
      console.log('✅ Existing products deleted');
    }
    
    console.log('🌱 Creating 7 real Labelia products...');
    
    // Insert the 7 real products with correct PostgreSQL syntax
    await prisma.$executeRaw`
      INSERT INTO products (id, name, description, price, category, colors, sizes, stock, images, "packagingImage", "videoUrl", "createdAt", "updatedAt")
        VALUES 
          ('prod-1', 'bague de fiançaille Lumina - Argent pur & diamant Moissanite', 'Un cadeau romantique parfait, cette bague de fiançailles fine en argent pur avec diamant unique illumine l''amour. Design simple et original, symbole d''élégance et d''éternité.', 250000, 'bague', ARRAY['argent'], ARRAY['50', '52', '54', '56'], 10, '{"argent": ["JH0A9575.jpg", "JH0A9678.jpg", "JH0A9690.jpg"]}', 'JH0A9831.jpg', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('prod-2', 'bague de fiançaille AÏNA - Argent pur & diamant Moissanite & zircon pierre', 'La bague AÏNA associe un diamant central étincelant à un halo de petites pierres en zircon pour un rendu sophistiqué. Un bijou de luxe en argent pur, parfait pour une demande en mariage ou fiançailles.', 320000, 'bague', ARRAY['argent'], ARRAY['50', '52', '54', '56'], 8, '{"argent": ["JH0A3163_3.jpg", "JH0A3163_4.jpg", "JH0A3163_2.jpg"]}', 'JH0A3163.jpg', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('prod-3', 'bague de fiançaille Héra - bague de fiançaille pour femme', 'Offrez un cadeau précieux et inoubliable avec la bague Héra, diamant moissanite central et des pierres de zircon dans un design torsadé raffiné. Idéale pour symboliser l''amour et la douceur féminine.', 280000, 'bague', ARRAY['argent'], ARRAY['50', '52', '54', '56'], 12, '{"argent": ["JH0A9850.jpg", "JH0A0631.jpg", "JH0A0060.jpg"]}', 'JH0A0055.jpg', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('prod-4', 'chaine pour femme Lovéa', 'Exprimez votre amour avec le collier Lovéa, un bijou élégant où trois diamants scintillants forment un cœur parfait. Idéal comme cadeau pour elle, ce collier en argent pur et diamants Moissanite allie raffinement, amour et luxe discret.', 180000, 'chaîne', ARRAY['argent'], ARRAY['40 cm', '45 cm', '50 cm'], 15, '{"argent": ["JH0A8027.jpg", "JH0A8027_2.jpg"]}', '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('prod-5', 'collier Lys - bijoux original pour femme', 'Un bijou minimaliste et raffiné avec un diamant rond central comme médaille. Parfait pour les femmes qui aiment les bijoux fins et les bijoux élégants.', 150000, 'chaîne', ARRAY['argent'], ARRAY['40 cm', '45 cm', '50 cm'], 20, '{"argent": ["Image_4.jpg", "Image_2.jpg"]}', '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('prod-6', 'Bracelet Véa - bijoux tendance', 'Le bracelet Véa séduit par son œil central recouvert de diamants Moissanite, symbole de lumière et protection, un bijou tendance et moderne pour toutes les occasions.', 120000, 'bracelet', ARRAY['argent'], ARRAY['16 cm', '18 cm', '20 cm'], 25, '{"argent": ["JH0A1768.jpg", "JH0A1768_1.jpg", "JH0A1768_2.jpg", "JH0A1768_3.jpg"]}', '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('prod-7', 'Bracelet Lys – Éclat et féminité', 'Offrez le bracelet Lys, un bijou précieux et lumineux avec diamant central et deux diamants secondaires. Idéal comme cadeau romantique ou bijou pour femme élégante.', 135000, 'bracelet', ARRAY['argent'], ARRAY['16 cm', '18 cm', '20 cm'], 18, '{"argent": ["579A6473.jpg", "115A9447.jpg", "2X5A8099.jpg"]}', '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO NOTHING
      `;
      
      console.log('✅ 7 real Labelia products created with all images!');

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
