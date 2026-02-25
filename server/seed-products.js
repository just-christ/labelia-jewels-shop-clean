// Configuration
const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@labelia.fr';
const ADMIN_PASSWORD = 'admin123'; // À modifier selon votre configuration

// Produits à créer
const products = [
  {
    name: "bague de fiançaille Lumina - Argent pur & diamant Moissanite",
    description: "Un cadeau romantique parfait, cette bague de fiançailles fine en argent pur avec diamant unique illumine l'amour. Design simple et original, symbole d'élégance et d'éternité.",
    category: "bague",
    price: 250000,
    colors: ["argent"],
    sizes: ["50", "52", "54", "56"],
    stock: 10,
    images: {
      argent: ["JH0A9575.jpg", "JH0A9678.jpg", "JH0A9690.jpg"]
    },
    packagingImage: "JH0A9831.jpg",
    videoUrl: ""
  },
  {
    name: "bague de fiançaille AÏNA - Argent pur & diamant Moissanite & zircon pierre",
    description: "La bague AÏNA associe un diamant central étincelant à un halo de petites pierres en zircon pour un rendu sophistiqué. Un bijou de luxe en argent pur, parfait pour une demande en mariage ou fiançailles.",
    category: "bague",
    price: 320000,
    colors: ["argent"],
    sizes: ["50", "52", "54", "56"],
    stock: 8,
    images: {
      argent: ["JH0A3163_3.jpg", "JH0A3163_4.jpg", "JH0A3163_2.jpg"]
    },
    packagingImage: "JH0A3163.jpg",
    videoUrl: ""
  },
  {
    name: "bague de fiançaille Héra - bague de fiançaille pour femme",
    description: "Offrez un cadeau précieux et inoubliable avec la bague Héra, diamant moissanite central et des pierres de zircon dans un design torsadé raffiné. Idéale pour symboliser l'amour et la douceur féminine.",
    category: "bague",
    price: 280000,
    colors: ["argent"],
    sizes: ["50", "52", "54", "56"],
    stock: 12,
    images: {
      argent: ["JH0A9850.jpg", "JH0A0631.jpg", "JH0A0060.jpg"]
    },
    packagingImage: "JH0A0055.jpg",
    videoUrl: ""
  },
  {
    name: "chaine pour femme Lovéa",
    description: "Exprimez votre amour avec le collier Lovéa, un bijou élégant où trois diamants scintillants forment un cœur parfait. Idéal comme cadeau pour elle, ce collier en argent pur et diamants Moissanite allie raffinement, amour et luxe discret.",
    category: "chaîne",
    price: 180000,
    colors: ["argent"],
    sizes: ["40 cm", "45 cm", "50 cm"],
    stock: 15,
    images: {
      argent: ["JH0A8027.jpg", "JH0A8027_2.jpg"]
    },
    packagingImage: "",
    videoUrl: ""
  },
  {
    name: "collier Lys - bijoux original pour femme",
    description: "Un bijou minimaliste et raffiné avec un diamant rond central comme médaille. Parfait pour les femmes qui aiment les bijoux fins et les bijoux élégants.",
    category: "chaîne",
    price: 150000,
    colors: ["argent"],
    sizes: ["40 cm", "45 cm", "50 cm"],
    stock: 20,
    images: {
      argent: ["Image_4.jpg", "Image_2.jpg"]
    },
    packagingImage: "",
    videoUrl: ""
  },
  {
    name: "Bracelet Véa - bijoux tendance",
    description: "Le bracelet Véa séduit par son œil central recouvert de diamants Moissanite, symbole de lumière et protection, un bijou tendance et moderne pour toutes les occasions.",
    category: "bracelet",
    price: 120000,
    colors: ["argent"],
    sizes: ["16 cm", "18 cm", "20 cm"],
    stock: 25,
    images: {
      argent: ["JH0A1768.jpg", "JH0A1768_1.jpg", "JH0A1768_2.jpg", "JH0A1768_3.jpg"]
    },
    packagingImage: "",
    videoUrl: ""
  },
  {
    name: "Bracelet Lys – Éclat et féminité",
    description: "Offrez le bracelet Lys, un bijou précieux et lumineux avec diamant central et deux diamants secondaires. Idéal comme cadeau romantique ou bijou pour femme élégante.",
    category: "bracelet",
    price: 135000,
    colors: ["argent"],
    sizes: ["16 cm", "18 cm", "20 cm"],
    stock: 18,
    images: {
      argent: ["579A6473.jpg", "115A9447.jpg", "2X5A8099.jpg"]
    },
    packagingImage: "",
    videoUrl: ""
  }
];

// Fonction pour se connecter et obtenir le token
async function login() {
  try {
    console.log('🔐 Connexion à l\'API admin...');
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur de connexion: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Connexion réussie');
    return data.token;
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    throw error;
  }
}

// Fonction pour créer un produit
async function createProduct(token, product) {
  try {
    console.log(`📦 Création du produit: ${product.name}`);
    
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erreur de création: ${response.status} ${response.statusText} - ${errorData.error || ''}`);
    }

    const createdProduct = await response.json();
    console.log(`✅ Produit créé avec succès: ${createdProduct.name} (ID: ${createdProduct.id})`);
    return createdProduct;
  } catch (error) {
    console.error(`❌ Erreur lors de la création du produit "${product.name}":`, error.message);
    throw error;
  }
}

// Fonction principale
async function seedProducts() {
  console.log('🚀 Démarrage du script de seed des produits DIAMOND UNIVERS...\n');
  
  try {
    // 1. Connexion
    const token = await login();
    
    // 2. Création des produits
    console.log(`\n📋 Création de ${products.length} produits...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        await createProduct(token, product);
        successCount++;
      } catch (error) {
        console.error(`⚠️  Échec de la création du produit ${i + 1}/${products.length}`);
        errorCount++;
      }
      
      // Petit délai pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 3. Résumé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DU SEED');
    console.log('='.repeat(60));
    console.log(`✅ Produits créés avec succès: ${successCount}/${products.length}`);
    console.log(`❌ Produits en échec: ${errorCount}/${products.length}`);
    
    if (successCount === products.length) {
      console.log('🎉 Tous les produits DIAMOND UNIVERS ont été créés avec succès !');
      console.log('🌐 Vous pouvez maintenant les voir sur: http://localhost:5173/produits');
    } else {
      console.log('⚠️  Certains produits n\'ont pas pu être créés. Vérifiez les erreurs ci-dessus.');
    }
    
    console.log('\n🏁 Fin du script de seed');
    
  } catch (error) {
    console.error('\n💥 Erreur critique lors du seed:', error.message);
    process.exit(1);
  }
}

// Vérification que le serveur est accessible
async function checkServer() {
  try {
    console.log('🔍 Vérification de la disponibilité du serveur...');
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      timeout: 5000
    });
    
    if (response.ok) {
      console.log('✅ Serveur accessible');
      return true;
    }
  } catch (error) {
    console.error('❌ Serveur inaccessible. Assurez-vous que le backend est démarré sur http://localhost:5000');
    return false;
  }
}

// Exécution du script
async function main() {
  const serverOk = await checkServer();
  if (!serverOk) {
    process.exit(1);
  }
  
  await seedProducts();
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Erreur non capturée:', reason);
  process.exit(1);
});

main();
