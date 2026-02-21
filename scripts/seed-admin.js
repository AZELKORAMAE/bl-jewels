const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement depuis .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI non définie dans .env.local');
    process.exit(1);
}

// Schéma minimal pour l'initialisation
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    mustChangePassword: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: true }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    try {
        console.log('⏳ Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connecté');

        const email = 'azelkoramae@gmail.com';
        const password = '1234';

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log(`ℹ️ L'utilisateur ${email} existe déjà.`);
            const overwrite = process.argv.includes('--force');
            if (overwrite) {
                console.log('🔄 Écrasement du mot de passe (mode force)...');
                const hashedPassword = await bcrypt.hash(password, 12);
                existingUser.password = hashedPassword;
                existingUser.mustChangePassword = true;
                await existingUser.save();
                console.log('✅ Compte réinitialisé avec succès : 1234');
            } else {
                console.log('💡 Utilisez --force pour réinitialiser le mot de passe.');
            }
        } else {
            console.log(`👤 Création de l'utilisateur ${email}...`);
            const hashedPassword = await bcrypt.hash(password, 12);
            await User.create({
                email,
                password: hashedPassword,
                mustChangePassword: true,
                isAdmin: true
            });
            console.log('✅ Compte admin créé avec succès !');
            console.log('📧 Email :', email);
            console.log('🔑 Code temporaire : 1234');
        }

    } catch (error) {
        console.error('❌ Erreur :', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Déconnecté');
    }
}

seed();
