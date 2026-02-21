# Bijouterie Luxe - Plateforme E-commerce

Une plateforme e-commerce élégante et complète pour les bijouteries, construite avec Next.js 14 et MongoDB. Design premium inspiré de Cartier avec palette de couleurs or/noir/crème.

## ✨ Fonctionnalités

### 🌐 Site Public
- **Page d'accueil** élégante avec hero section
- **Galerie de collections** avec cartes interactives
- **Pages produits** avec galerie d'images
- **Panier d'achat** avec persistance localStorage
- **Système de commande** complet
- Design responsive (mobile, tablette, desktop)

### 🔧 Interface Admin
- **Gestion des collections** (CRUD complet)
- **Gestion des produits** (multi-images, prix, stock)
- **Visualisation des commandes**
- Gestion automatique du stock

## 🛠️ Technologies

- **Next.js 14+** - Framework React avec App Router
- **MongoDB** + Mongoose - Base de données
- **TypeScript** - Sécurité des types
- **Tailwind CSS** - Styling avec design system personnalisé
- **Google Fonts** - Cormorant Garamond & Inter

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- MongoDB (local ou Atlas)

### Installation

```bash
# Se placer dans le dossier
cd bijouterie-luxe

# Installer les dépendances (déjà fait)
npm install

# Configurer les variables d'environnement
# Éditer .env.local avec votre MongoDB URI

# Démarrer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📂 Structure du Projet

```
bijouterie-luxe/
├── src/
│   ├── app/                 # Pages Next.js
│   │   ├── page.tsx         # Accueil
│   │   ├── collections/     # Collections
│   │   ├── products/        # Produits
│   │   ├── cart/            # Panier
│   │   ├── checkout/        # Commande
│   │   ├── admin/           # Administration
│   │   └── api/             # REST API Routes
│   ├── components/          # Composants React
│   ├── contexts/            # Context (CartContext)
│   └── lib/                 # Modèles et utilitaires
└── .env.local               # Configuration
```

## 🎨 Design System

### Palette de Couleurs
- Fond crème: `#faf8f3`
- Noir profond: `#0a0a0a`
- Or primaire: `#d4af37`
- Or secondaire: `#c9a961`

### Typographie
- Headings: **Cormorant Garamond** (serif élégant)
- Body: **Inter** (sans-serif moderne)

## 📝 Guide d'Utilisation

### 1. Créer des Collections
1. Aller sur `/admin`
2. Cliquer sur "Collections"
3. Créer une nouvelle collection avec nom, description et image

### 2. Ajouter des Produits
1. Aller sur `/admin/products`
2. Créer un produit en sélectionnant une collection
3. Ajouter prix, quantité, description et images

### 3. Gérer les Commandes
1. Les clients passent commande via `/checkout`
2. Voir toutes les commandes sur `/admin/orders`
3. Le stock est automatiquement déduit

## 🔐 Configuration MongoDB

### Option 1: MongoDB Local
```bash
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Créer un compte sur [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Obtenir l'URI de connexion
4. Mettre à jour `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bijouterie-luxe
```

## 🌐 Routes Principales

### Site Public
- `/` - Page d'accueil
- `/collections` - Toutes les collections
- `/collections/[slug]` - Produits d'une collection
- `/products/[slug]` - Détail d'un produit
- `/cart` - Panier
- `/checkout` - Finaliser la commande

### Administration
- `/admin` - Dashboard admin
- `/admin/collections` - Gérer collections
- `/admin/products` - Gérer produits
- `/admin/orders` - Voir commandes

### API
- `GET/POST /api/collections` - Collections
- `GET/PUT/DELETE /api/collections/[slug]` - Collection par slug
- `GET/POST /api/products` - Produits
- `GET/PUT/DELETE /api/products/[slug]` - Produit par slug
- `GET/POST /api/orders` - Commandes

## 🎯 Fonctionnalités Clés

✅ **Design Premium** - Inspiré Cartier  
✅ **Responsive** - Mobile-first  
✅ **Panier Persistant** - localStorage  
✅ **Gestion Stock** - Automatique  
✅ **Multi-Images** - Galeries produits  
✅ **Admin Complet** - CRUD toutes entités  

## 🚧 Améliorations Futures

- 🔐 Authentification (NextAuth.js)
- 💳 Intégration paiement (Stripe)
- 📧 Notifications email
- 🔍 Recherche et filtres
- 🖼️ Upload d'images (Cloudinary)
- 📊 Analytics et dashboard

## 📜 License

Projet créé pour démonstration.

## 🤝 Support

Pour toute question, consultez la documentation complète dans `walkthrough.md`.

---

Créé avec ❤️ par Antigravity
