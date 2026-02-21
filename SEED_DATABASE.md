# 🌱 Guide pour Peupler la Base de Données

Ce guide vous explique comment remplir automatiquement votre base de données MongoDB Atlas avec des collections et produits de démonstration.

## 🚨 Problème Possible : Whitelist IP

Si vous obtenez une erreur "Erreur lors de la création de la collection", c'est probablement parce que votre **adresse IP n'est pas autorisée** sur MongoDB Atlas.

### ✅ Solution : Autoriser votre IP

1. **Allez sur MongoDB Atlas** : https://cloud.mongodb.com
2. **Connectez-vous** à votre compte
3. **Cliquez sur "Network Access"** (dans le menu de gauche)
4. **Cliquez sur "Add IP Address"**
5. **Sélectionnez "Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Pour production, limitez à votre IP spécifique
   - ✅ Pour développement, 0.0.0.0/0 est acceptable
6. **Cliquez "Confirm"**
7. **Attendez 1-2 minutes** que les changements prennent effet

---

## 🌱 Option 1 : Script Automatique (RECOMMANDÉ)

J'ai créé un script qui va automatiquement peupler votre base de données avec :
- **4 collections** (Bagues, Colliers, Bracelets, Montres)
- **10 produits** de luxe avec images et descriptions

### Étapes :

1. **Ouvrez un nouveau terminal** (PowerShell ou CMD)

2. **Naviguez vers le projet** :
   ```bash
   cd C:\Users\azelk\Desktop\ProjetStructurer\bijouterie-luxe
   ```

3. **Exécutez le script** :
   ```bash
   npx tsx seed.ts
   ```

4. **Attendez le message de succès** :
   ```
   🎉 Base de données peuplée avec succès!
   📊 Résumé:
      - 4 collections créées
      - 10 produits créés
   ```

5. **Rechargez votre navigateur** sur http://localhost:3000

6. **Vous verrez** :
   - Les 4 collections sur `/collections`
   - Les produits sur chaque page de collection
   - Tout fonctionne !

---

## 🖱️ Option 2 : Manuel via l'Admin

Si le script ne fonctionne pas, vous pouvez ajouter manuellement :

### Créer une Collection

1. Allez sur http://localhost:3000/admin/collections
2. Cliquez "+ Nouvelle Collection"
3. Remplissez :
   ```
   Nom: Bagues de Fiançailles
   Description: Collection élégante de bagues sertis de diamants
   Image: https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800
   ```
4. Cliquez "Créer la Collection"

### Créer un Produit

1. Allez sur http://localhost:3000/admin/products
2. Cliquez "+ Nouveau Produit"
3. Remplissez :
   ```
   Nom: Bague Solitaire Diamant
   Collection: Bagues de Fiançailles
   Prix: 8999.00
   Quantité: 5
   Description: Magnifique bague en or blanc...
   Image 1: https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800
   ```
4. Cliquez "Créer le Produit"

---

## 🔍 Vérifier les Données sur MongoDB Atlas

1. Allez sur https://cloud.mongodb.com
2. Connectez-vous
3. Cliquez sur votre cluster "Cluster0"
4. Cliquez "Browse Collections"
5. Sélectionnez la base "bijouterie-luxe"
6. Vous verrez 3 collections :
   - **collections** - Vos collections
   - **products** - Vos produits
   - **orders** - Les commandes (vide pour l'instant)

---

## ⚠️ Dépannage

### "MongoServerError: bad auth"
→ Vérifiez le mot de passe dans `.env.local`

### "MongoServerError: IP not whitelisted"
→ Suivez les étapes ci-dessus pour autoriser votre IP

### "Connection timeout"
→ Vérifiez votre connexion internet

### "Error: Cannot find module 'tsx'"
→ Installez tsx : `npm install -D tsx`

---

## 🎯 Après le Peuplement

Une fois les données ajoutées :
1. ✅ Allez sur http://localhost:3000
2. ✅ Cliquez sur "Collections"
3. ✅ Vous verrez toutes vos collections !
4. ✅ Cliquez sur une collection pour voir ses produits
5. ✅ Testez d'ajouter un produit au panier

**Votre boutique de luxe est prête ! 🎉**
