---
description: Accéder à l'administration de Labelia
---

# Accéder à l'administration Labelia

## Étapes pour accéder au panneau d'administration

### 1. Démarrer les serveurs

#### Backend (API)
```bash
cd server
npm start
```
Le backend démarrera sur `http://localhost:5000`

#### Frontend (Application)
```bash
cd p:\labelia-jewels-shop
npm run dev
```
Le frontend démarrera sur `http://localhost:5173`

### 2. Accéder à l'administration

Une fois les deux serveurs démarrés :

1. **Ouvrir votre navigateur**
2. **Aller à l'adresse** : `http://localhost:5173/admin`
3. **Connexion** avec vos identifiants administrateur

### 3. Redirection automatique

- Si vous êtes déjà connecté en tant qu'admin, vous serez redirigé automatiquement vers : `http://localhost:5173/admin/dashboard`
- Si vous n'êtes pas connecté, vous serez redirigé vers la page de login

### 4. Fonctionnalités disponibles

Depuis le dashboard, vous pouvez accéder à :
- 📊 **Tableau de bord** : Statistiques en temps réel
- 📦 **Gestion des produits** : CRUD complet avec multi-images et vidéos
- 📋 **Gestion des commandes** : Suivi des commandes clients
- 👥 **Gestion des clients** : Base de données clients
- 🔧 **Gestion des admins** : Création et suppression de comptes admin

### 5. Structure des URLs

- **Login admin** : `http://localhost:5173/admin/login`
- **Dashboard** : `http://localhost:5173/admin/dashboard`
- **Produits** : `http://localhost:5173/admin/produits`
- **Commandes** : `http://localhost:5173/admin/commandes`
- **Clients** : `http://localhost:5173/admin/clients`

### 6. Dépannage

#### Si le frontend ne démarre pas :
```bash
# Vérifier les dépendances
npm install

# Nettoyer et relancer
npm run dev
```

#### Si le backend ne démarre pas :
```bash
# Vérifier la base de données
cd server
npx prisma migrate dev

# Vérifier les variables d'environnement
cat .env
```

#### Si erreur de connexion :
1. Vérifier que le backend est bien démarré sur `localhost:5000`
2. Vérifier vos identifiants dans la base de données
3. Vider le cache du navigateur

### 7. Notes importantes

- L'admin est **100% responsive** et fonctionne sur mobile
- Le dashboard s'affiche **automatiquement** en accédant à `/admin`
- Les modifications sont **sauvegardées en temps réel**
- Support **multi-images**, **vidéos** et **packaging** pour les produits