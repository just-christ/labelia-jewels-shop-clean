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

    // Let Prisma handle schema creation properly
    // Drop corrupted table and let Prisma recreate with correct types
    await prisma.$executeRaw`DROP TABLE IF EXISTS products CASCADE`;
    
    console.log('✅ Old corrupted table dropped');
    
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
      console.log('🌱 Creating 7 real Labelia products...');
      
      // Insert products using Prisma (not raw SQL) to ensure type consistency
      await prisma.product.createMany({
        data: [
          {
            id: 'prod-1',
            name: 'bague de fiançaille Lumina - Argent pur & diamant Moissanite',
            description: 'Un cadeau romantique parfait, cette bague de fiançailles fine en argent pur avec diamant unique illumine l\'amour. Design simple et original, symbole d\'élégance et d\'éternité.',
            price: 250000,
            category: 'bague',
            colors: ['argent'],
            sizes: ['50', '52', '54', '56'],
            stock: 10,
            images: { argent: ['JH0A9575.jpg', 'JH0A9678.jpg', 'JH0A9690.jpg'] },
            packagingImage: 'JH0A9831.jpg',
            videoUrl: ''
          },
          {
            id: 'prod-2',
            name: 'bague de fiançaille AÏNA - Argent pur & diamant Moissanite & zircon pierre',
            description: 'La bague AÏNA associe un diamant central étincelant à un halo de petites pierres en zircon pour un rendu sophistiqué. Un bijou de luxe en argent pur, parfait pour une demande en mariage ou fiançailles.',
            price: 320000,
            category: 'bague',
            colors: ['argent'],
            sizes: ['50', '52', '54', '56'],
            stock: 8,
            images: { argent: ['JH0A3163_3.jpg', 'JH0A3163_4.jpg', 'JH0A3163_2.jpg'] },
            packagingImage: 'JH0A3163.jpg',
            videoUrl: ''
          },
          {
            id: 'prod-3',
            name: 'bague de fiançaille Héra - bague de fiançaille pour femme',
            description: 'Offrez un cadeau précieux et inoubliable avec la bague Héra, diamant moissanite central et des pierres de zircon dans un design torsadé raffiné. Idéale pour symboliser l\'amour et la douceur féminine.',
            price: 280000,
            category: 'bague',
            colors: ['argent'],
            sizes: ['50', '52', '54', '56'],
            stock: 12,
            images: { argent: ['JH0A9850.jpg', 'JH0A0631.jpg', 'JH0A0060.jpg'] },
            packagingImage: 'JH0A0055.jpg',
            videoUrl: ''
          },
          {
            id: 'prod-4',
            name: 'chaine pour femme Lovéa',
            description: 'Exprimez votre amour avec le collier Lovéa, un bijou élégant où trois diamants scintillants forment un cœur parfait. Idéal comme cadeau pour elle, ce collier en argent pur et diamants Moissanite allie raffinement, amour et luxe discret.',
            price: 180000,
            category: 'chaîne',
            colors: ['argent'],
            sizes: ['40 cm', '45 cm', '50 cm'],
            stock: 15,
            images: { argent: ['JH0A8027.jpg', 'JH0A8027_2.jpg'] },
            packagingImage: '',
            videoUrl: ''
          },
          {
            id: 'prod-5',
            name: 'collier Lys - bijoux original pour femme',
            description: 'Un bijou minimaliste et raffiné avec un diamant rond central comme médaille. Parfait pour les femmes qui aiment les bijoux fins et les bijoux élégants.',
            price: 150000,
            category: 'chaîne',
            colors: ['argent'],
            sizes: ['40 cm', '45 cm', '50 cm'],
            stock: 20,
            images: { argent: ['Image_4.jpg', 'Image_2.jpg'] },
            packagingImage: '',
            videoUrl: ''
          },
          {
            id: 'prod-6',
            name: 'Bracelet Véa - bijoux tendance',
            description: 'Le bracelet Véa séduit par son œil central recouvert de diamants Moissanite, symbole de lumière et protection, un bijou tendance et moderne pour toutes les occasions.',
            price: 120000,
            category: 'bracelet',
            colors: ['argent'],
            sizes: ['16 cm', '18 cm', '20 cm'],
            stock: 25,
            images: { argent: ['JH0A1768.jpg', 'JH0A1768_1.jpg', 'JH0A1768_2.jpg', 'JH0A1768_3.jpg'] },
            packagingImage: '',
            videoUrl: ''
          },
          {
            id: 'prod-7',
            name: 'Bracelet Lys – Éclat et féminité',
            description: 'Offrez le bracelet Lys, un bijou précieux et lumineux avec diamant central et deux diamants secondaires. Idéal comme cadeau romantique ou bijou pour femme élégante.',
            price: 135000,
            category: 'bracelet',
            colors: ['argent'],
            sizes: ['16 cm', '18 cm', '20 cm'],
            stock: 18,
            images: { argent: ['579A6473.jpg', '115A9447.jpg', '2X5A8099.jpg'] },
            packagingImage: '',
            videoUrl: ''
          }
        ]
      });
      
      console.log('✅ 7 real Labelia products created with Prisma!');
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
