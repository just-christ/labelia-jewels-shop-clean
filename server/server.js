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

    // Vérifier si les tables existent (PRODUCTION SAFE)
    const tablesExist = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      ) as exists
    `;

    // Créer les tables seulement si elles n'existent pas
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

    // Admin user (créé seulement s'il n'existe pas)
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

    // Produits (créés seulement s'ils n'existent pas)
    const productsCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM products
    `;

    if (productsCount[0]?.count === 0) {
      console.log('🌱 Creating 7 real Labelia products...');
      
      // Création des produits avec Prisma Client (plus sûr que SQL brut)
      const products = [
      {
        id: 'prod-1',
        name: 'bague de fiançaille Lumina - Argent pur & diamant Moissanite',
        description: 'Un cadeau romantique parfait, cette bague de fiançailles fine en argent pur avec diamant unique illumine l\'amour. Design simple et original, symbole d\'élégance et d\'éternité.',
        price: 45000,
        category: 'bague',
        colors: ['argent'],
        sizes: ['6', '7', '8', '9'],
        stock: 10,
        images: { argent: ['JH0A9575.jpg', 'JH0A9678.jpg', 'JH0A9690.jpg'] },
        packagingImage: 'packaging.png',
        videoUrl: ''
      },
      {
        id: 'prod-2',
        name: 'bague de fiançaille AÏNA- Argent pur & diamant Moissanite & zircon',
        description: 'La bague AÏNA associe un diamant central étincelant à un halo de petites pierres en zircon pour un rendu sophistiqué. Un bijou de luxe en argent pur, parfait pour une demande en mariage ou fiançailles.',
        price: 50000,
        category: 'bague',
        colors: ['argent'],
        sizes: ['6', '7'],
        stock: 8,
        images: { argent: ['JH0A3163_3.jpg', 'JH0A3163_4.jpg', 'JH0A3163_2.jpg'] },
        packagingImage: 'packaging.png',
        videoUrl: ''
      },
      {
        id: 'prod-3',
        name: 'bague de fiancaille Hera - bague de fiancaille pour femme',
        description: 'Offrez un cadeau précieux et inoubliable avec la bague Héra, diamant moissanite central et des pierres de zircon dans un design torsadé raffiné. Idéale pour symboliser l\'amour et la douceur féminine.',
        price: 50000,
        category: 'bague',
        colors: ['argent'],
        sizes: ['8'],
        stock: 12,
        images: { argent: ['JH0A9850.jpg', 'JH0A0631.jpg', 'JH0A0060.jpg'] },
        packagingImage: 'packaging.png',
        videoUrl: ''
      },
      {
        id: 'prod-4',
        name: 'chaine pour femme Lovéa',
        description: 'Exprimez votre amour avec le collier Lovéa, un bijou élégant où trois diamants scintillants forment un cœur parfait. Idéal comme cadeau pour elle, ce collier en argent pur et diamants Moissanite allie raffinement, amour et luxe discret.',
        price: 40000,
        category: 'chaîne',
        colors: ['argent'],
        sizes: ['40 cm', '45 cm', '50 cm'],
        stock: 15,
        images: { argent: ['JH0A8027.jpg', 'JH0A8027_2.jpg'] },
        packagingImage: 'packaging.png',
        videoUrl: ''
      },
      {
        id: 'prod-5',
        name: 'collier Lys - bijoux original pour femme',
        description: 'Un bijou minimaliste et raffiné avec un diamant rond central comme médaille. Parfait pour les femmes qui aiment les bijoux fins et les bijoux élégants.',
        price: 35000,
        category: 'chaîne',
        colors: ['argent'],
        sizes: ['40 cm', '45 cm', '50 cm'],
        stock: 20,
        images: { argent: ['image_4.jpg', 'image_2.jpg'] },
        packagingImage: 'packaging.png',
        videoUrl: ''
      },
      {
        id: 'prod-6',
        name: 'Bracelet Véa- bijoux tendance',
        description: 'Le bracelet Véa séduit par son œil central recouvert de diamants Moissanite, symbole de lumière et protection, un bijou tendance et moderne pour toutes les occasions.',
        price: 35000,
        category: 'bracelet',
        colors: ['argent'],
        sizes: ['16 cm', '18 cm', '20 cm'],
        stock: 25,
        images: { argent: ['JH0A1768.jpg', 'JH0A1768_1.jpg', 'JH0A1768_2.jpg', 'JH0A1768_3.jpg'] },
        packagingImage: 'packaging.png',
        videoUrl: ''
      },
      {
        id: 'prod-7',
        name: 'Bracelet Lys – Éclat et féminité',
        description: 'Offrez le bracelet Lys, un bijou précieux et lumineux avec diamant central et deux diamants secondaires. Idéal comme cadeau romantique ou bijou pour femme élégante.',
        price: 35000,
        category: 'bracelet',
        colors: ['argent'],
        sizes: ['16 cm', '18 cm', '20 cm'],
        stock: 18,
        images: { argent: ['579A6473.jpg', '115A9447.jpg', '2X5A8099.jpg'] },
        packagingImage: 'packaging.png',
        videoUrl: ''
      }
    ];

    // Insérer les produits un par un avec Prisma
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

app.listen(PORT, async () => {
  console.log(`🚀 Server running on https://labelia-backend.onrender.com:${PORT}`);
  await initializeDatabase();
});

export default app;