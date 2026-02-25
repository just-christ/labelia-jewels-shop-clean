// SCRIPT ORGANISÉ POUR PUSH SUR GITHUB
// À exécuter quand GitHub fonctionnera

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SCRIPT ORGANISÉ POUR PUSH LABELIA\n');

// Étape 1: Push du code (déjà fait)
console.log('✅ Étape 1: Code déjà commité et prêt à push');
console.log('   Commande: git push origin main\n');

// Étape 2: Organiser les images par lots de 10
console.log('📦 Étape 2: Organisation des images par lots\n');

const imagesDir = path.join(__dirname, '../public/Images');
const imageFiles = fs.readdirSync(imagesDir).filter(file => 
  file.match(/\.(jpg|jpeg|png|mp4)$/i)
);

console.log(`📊 Total images: ${imageFiles.length}`);

// Créer des lots de 10 images
const batchSize = 10;
const batches = [];
for (let i = 0; i < imageFiles.length; i += batchSize) {
  batches.push(imageFiles.slice(i, i + batchSize));
}

console.log(`📦 Création de ${batches.length} lots de ${batchSize} images maximum\n`);

// Générer les commandes pour chaque lot
console.log('📋 COMMANDES À EXÉCUTER SÉQUEENTIELLEMENT:\n');

batches.forEach((batch, index) => {
  console.log(`--- LOT ${index + 1}/${batches.length} ---`);
  console.log(`Images: ${batch.join(', ')}`);
  console.log('Commandes:');
  console.log(`git add public/Images/${batch.join(' public/Images/')}`);
  console.log(`git commit -m "📦 Lot ${index + 1}/${batches.length}: Images ${batch[0]}..."`);
  console.log(`git push origin main`);
  console.log('⏱️  Attendre 30 secondes entre chaque lot...\n');
});

// Étape 3: Instructions finales
console.log('🎯 INSTRUCTIONS FINALES:\n');
console.log('1. Attendre que GitHub soit stable');
console.log('2. Exécuter: git push origin main (pour le code)');
console.log('3. Exécuter chaque lot d\'images ci-dessus');
console.log('4. Tester le site sur Hostinger');
console.log('5. Configurer les variables d\'environnement Hostinger\n');

console.log('🚀 PROJET LABELIA PRÊT POUR DÉPLOIEMENT !');
