// Script de migration pour Hostinger
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function migrate() {
  try {
    console.log('🔄 Début de la migration de la base de données...');
    
    // Vérifier la connexion
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');
    
    // Appliquer les migrations Prisma
    const { execSync } = await import('child_process');
    
    try {
      console.log('📦 Génération du client Prisma...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      
      console.log('🗄️ Application des migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      
      console.log('🌱 Insertion des produits...');
      execSync('node seed-products.js', { stdio: 'inherit' });
      
      console.log('✅ Migration terminée avec succès !');
    } catch (error) {
      console.log('⚠️ Erreur lors de la migration, mais la connexion fonctionne');
      console.log('Les tables existent peut-être déjà');
    }
    
  } catch (error) {
    console.error('❌ Erreur de migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
