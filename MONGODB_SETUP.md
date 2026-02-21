# 🗄️ Guide de Configuration MongoDB

Ce guide vous explique comment connecter votre site à une vraie base de données MongoDB.

## 🌟 Option 1 : MongoDB Atlas (Cloud - RECOMMANDÉ)

**Gratuit, rapide, aucune installation nécessaire**

### Étape 1 : Créer un compte
1. Allez sur https://www.mongodb.com/cloud/atlas/register
2. Inscrivez-vous avec votre email
3. Vérifiez votre email

### Étape 2 : Créer un cluster gratuit
1. Cliquez sur "Build a Database"
2. Choisissez **"M0 FREE"** (gratuit pour toujours)
3. Sélectionnez une région proche (ex: Paris, Frankfurt, Amsterdam)
4. Donnez un nom à votre cluster (ex: "bijouterie-cluster")
5. Cliquez "Create"

### Étape 3 : Configurer l'accès
1. **Créer un utilisateur de base de données** :
   - Username: `bijouterie_admin` (par exemple)
   - Password: Créez un mot de passe fort - **NOTEZ-LE !**
   - Cliquez "Create User"

2. **Autoriser les connexions** :
   - IP Access List → "Add IP Address"
   - Sélectionnez "Allow Access from Anywhere" (0.0.0.0/0)
   - Cliquez "Add Entry"

### Étape 4 : Obtenir l'URI de connexion
1. Cliquez sur "Connect" (bouton sur votre cluster)
2. Choisissez "Connect your application"
3. Sélectionnez "Node.js" et version "4.1 or later"
4. Copiez l'URI qui ressemble à :
   ```
   mongodb+srv://bijouterie_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Étape 5 : Configurer votre application
1. Ouvrez le fichier `.env.local` dans votre projet
2. Trouvez la ligne `MONGODB_URI=...`
3. Remplacez-la par votre URI Atlas :
   ```env
   MONGODB_URI=mongodb+srv://bijouterie_admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/bijouterie-luxe?retryWrites=true&w=majority
   ```
   ⚠️ **Important** : Remplacez `<password>` par votre vrai mot de passe !

4. Sauvegardez le fichier

### Étape 6 : Redémarrer le serveur
1. Dans le terminal, arrêtez le serveur (Ctrl+C)
2. Redémarrez : `npm run dev`
3. Le site est maintenant connecté à MongoDB Atlas ! ✅

---

## 💻 Option 2 : MongoDB Local

**Pour développement hors ligne**

### Sur Windows

1. **Télécharger MongoDB Community Server**
   - Allez sur : https://www.mongodb.com/try/download/community
   - Choisissez "Windows x64"
   - Téléchargez et installez

2. **Démarrer MongoDB**
   - Ouvrez PowerShell ou CMD en tant qu'administrateur
   - Tapez : `mongod`
   - Laissez cette fenêtre ouverte

3. **Votre `.env.local` est déjà configuré**
   ```env
   MONGODB_URI=mongodb://localhost:27017/bijouterie-luxe
   ```

4. **Redémarrer le serveur Next.js**
   - Ctrl+C dans le terminal
   - `npm run dev`

---

## ✅ Vérifier la Connexion

Une fois configuré, testez votre connexion :

1. Ouvrez http://localhost:3000/admin/collections
2. Créez une collection de test
3. Si ça fonctionne → Connexion réussie ! 🎉
4. Si erreur → Vérifiez votre URI et mot de passe

---

## 🔍 Dépannage

### Erreur "MongoServerError: Authentication failed"
→ Vérifiez votre mot de passe dans l'URI

### Erreur "Connection timeout"
→ Vérifiez que vous avez autorisé l'IP 0.0.0.0/0 dans MongoDB Atlas

### Erreur "ECONNREFUSED"
→ Si MongoDB local : vérifiez que `mongod` est bien démarré

---

## 📊 Visualiser vos Données

**MongoDB Atlas** :
- Allez sur atlas.mongodb.com
- Cliquez sur "Browse Collections"
- Vous verrez vos collections, produits et commandes !

**MongoDB Local** :
- Installez MongoDB Compass : https://www.mongodb.com/try/download/compass
- Connectez-vous à `mongodb://localhost:27017`

---

## 🎯 Prochaines Étapes

Une fois MongoDB configuré :
1. Créez des collections via `/admin/collections`
2. Ajoutez des produits via `/admin/products`
3. Testez une commande sur le site public
4. Vérifiez les commandes dans `/admin/orders`

Tout fonctionne automatiquement avec la vraie base de données ! 🚀
