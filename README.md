# 🛍️ Labélia - Bijoux minimalistes et élégants

Site e-commerce de bijoux minimalistes avec dashboard administrateur complet, gestion des promotions et cartes cadeaux.

---

## 📋 Table des matières

- [🚀 Démarrage rapide](#démarrage-rapide)
- [🏗️ Architecture technique](#architecture-technique)
- [📦 Structure du projet](#structure-du-projet)
- [⚙️ Configuration](#configuration)
- [🔐 Gestion admin](#gestion-admin)
- [💳 Fonctionnalités](#fonctionnalités)
- [🌐 Déploiement](#déploiement)
- [🔧 Maintenance](#maintenance)

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ 
- npm ou yarn
- MongoDB (via Prisma)

### Installation

```bash
# Cloner le projet
git clone [URL_REPO]
cd labelia-jewels-shop

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés

# Générer Prisma Client
npx prisma generate

# Démarrer en développement
npm run dev
```

### URLs par défaut

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **Admin Dashboard** : http://localhost:5173/admin/login

---

## 🏗️ Architecture technique

### Frontend (React + Vite)
```
src/
├── components/          # Composants réutilisables
├── context/            # Contexte React (Auth, Cart)
├── lib/               # Utils et API client
├── pages/              # Pages du site
│   ├── admin/         # Dashboard admin
│   └── ...           # Pages publiques
└── utils/              # Fonctions utilitaires
```

### Backend (Node.js + Express + Prisma)
```
server/
├── controllers/        # Logique métier
├── routes/            # Routes API
├── middleware/        # Middlewares (auth, etc.)
├── config/            # Configuration base de données
└── prisma/           # Schéma de base de données
```

### Base de données

**Collections principales** :
- `users` - Utilisateurs et administrateurs
- `products` - Catalogue produits avec variants
- `orders` - Commandes clients
- `promotions` - Codes promo
- `gift_cards` - Cartes cadeaux

---

## 📦 Structure du projet

```
labelia-jewels-shop/
├── public/                 # Fichiers statiques
│   ├── .htaccess          # Configuration Apache
│   └── index.html          # HTML principal
├── src/                    # Code source React
├── server/                 # Backend Node.js
├── dist/                   # Build de production
├── package.json            # Dépendances et scripts
└── README.md              # Ce fichier
```

---

## ⚙️ Configuration

### Variables d'environnement (.env)

```env
# Base de données
DATABASE_URL="mongodb://localhost:27017/labelia"

# JWT
JWT_SECRET="votre-secret-super-securise"

# Cloudinary (images)
CLOUDINARY_CLOUD_NAME="votre-cloud-name"
CLOUDINARY_API_KEY="votre-api-key"
CLOUDINARY_API_SECRET="votre-secret"

# Serveur
PORT=5000
NODE_ENV=production
```

### Configuration Cloudinary

1. Créer un compte Cloudinary
2. Créer un "cloud" pour les images produits
3. Ajouter les clés dans `.env`
4. Les images sont automatiquement uploadées via l'admin

---

## 🔐 Gestion admin

### Accès admin

1. **URL** : `/admin/login`
2. **Identifiants par défaut** :
   - Email : ``
   - Mot de passe : ``

> ⚠️ **Important** : Changer les identifiants par défaut en production !

### Fonctionnalités admin

- **📊 Dashboard** : Statistiques en temps réel
- **📦 Produits** : CRUD complet avec images Cloudinary
- **📝 Commandes** : Gestion des commandes clients
- **👥 Clients** : Liste des clients uniques
- **🎁 Promotions** : Codes promo avec dates
- **💳 Cartes cadeaux** : Création et suivi
- **👤 Admins** : Gestion des comptes administrateurs

---

## 💳 Fonctionnalités

### Pour les clients

- **🛒 Panier** : Ajout/modification/suppression
- **💳 Checkout** : Paiement à la livraison
- **🎁 Codes promo** : Réduction automatique
- **💸 Cartes cadeaux** : Usage unique
- **📱 Responsive** : Mobile-first design

### Pour les administrateurs

- **📈 Statistiques** : Chiffres d'affaires, ventes
- **🔄 Lazy loading** : Performance optimisée
- **🖼️ Upload images** : Cloudinary intégré
- **🔒 Sécurité** : JWT + middleware admin

---

## 🌐 Déploiement

### Build de production

```bash
# Build frontend
npm run build

# Lancer en production
npm start
```

### Configuration Apache (.htaccess)

Le `.htaccess` inclus configure :
- **Routing SPA** : Toutes les routes vers index.html
- **Cache** : Assets avec hash (1 an)
- **Compression** : Gzip activé
- **Sécurité** : Headers de sécurité

### Hébergement recommandé

- **Serveur** : Apache avec Node.js
- **Base de données** : MongoDB Atlas ou local
- **CDN** : Cloudinary pour les images
- **Domaine** : HTTPS obligatoire

---

## 🔧 Maintenance

### Mises à jour

```bash
# Mettre à jour les dépendances
npm update

# Mettre à jour Prisma
npx prisma db push

# Redémarrer le serveur
npm restart
```

### Sauvegardes

- **Base de données** : Export MongoDB régulier
- **Images** : Synchronisées via Cloudinary
- **Code** : Git avec tags de version

### Monitoring

- **Logs** : Console serveur et erreurs client
- **Performance** : Build Vite optimisé
- **Sécurité** : Tokens JWT expirent

---

## 📞 Support

### Problèmes courants

| Problème | Solution |
|-----------|----------|
| Images ne s'affichent pas | Vérifier Cloudinary keys |
| Admin inaccessible | Vérifier JWT_SECRET |
| Panier vide au refresh | Vérifier localStorage |
| Build échoue | `npx vite build --force` |

### Contact

Pour toute question technique ou besoin d'assistance :

- **Développeur original** : christkouassi.dev@gmail.com 
- **Documentation** : Ce README
- **Issues** : GitHub 

---

## 📄 Licence

Ce projet est la propriété de **Labélia**. Toute reproduction ou utilisation sans autorisation est interdite.

---

**Dernière mise à jour** : 15 Avril 2026
**Version** : 1.2.0

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

