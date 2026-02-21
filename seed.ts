import dbConnect from './src/lib/db';
import Collection from './src/lib/models/Collection';
import Product from './src/lib/models/Product';

async function seed() {
    try {
        console.log('🔌 Connexion à MongoDB Atlas...');
        await dbConnect();
        console.log('✅ Connecté à MongoDB Atlas!');

        // Nettoyer les données existantes
        console.log('🧹 Nettoyage des anciennes données...');
        await Collection.deleteMany({});
        await Product.deleteMany({});
        console.log('✅ Données nettoyées!');

        // Créer les collections
        console.log('📦 Création des collections...');

        const bagues = await Collection.create({
            name: 'Bagues de Fiançailles',
            description: 'Collection élégante de bagues sertis de diamants pour célébrer votre amour éternel',
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        });

        const colliers = await Collection.create({
            name: 'Colliers de Luxe',
            description: 'Colliers raffinés en or et pierres précieuses, symboles de sophistication',
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
        });

        const bracelets = await Collection.create({
            name: 'Bracelets Précieux',
            description: 'Bracelets élégants ornés de pierres fines et métaux nobles',
            image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
        });

        const montres = await Collection.create({
            name: 'Montres de Prestige',
            description: 'Montres de luxe alliant précision horlogère et design exceptionnel',
            image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800',
        });

        console.log('✅ Collections créées:', [bagues.name, colliers.name, bracelets.name, montres.name]);

        // Créer les produits
        console.log('💎 Création des produits...');

        // Bagues
        await Product.create({
            name: 'Bague Solitaire Diamant 1ct',
            description: 'Magnifique bague solitaire en or blanc 18 carats, sertie d\'un diamant taille brillant de 1 carat. Certificat GIA fourni. Pureté VS1, couleur D.',
            price: 8999.00,
            quantity: 3,
            collectionId: bagues._id,
            images: [
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
                'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
            ],
        });

        await Product.create({
            name: 'Alliance Éternité Or Rose',
            description: 'Alliance en or rose 750 sertie de diamants sur tout le tour. Design intemporel et élégant pour symboliser votre union éternelle.',
            price: 2499.00,
            quantity: 10,
            collectionId: bagues._id,
            images: [
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
            ],
        });

        await Product.create({
            name: 'Bague Cocktail Émeraude',
            description: 'Bague cocktail en or jaune 18K ornée d\'une émeraude de Colombie de 3 carats entourée de diamants blancs. Pièce unique.',
            price: 12500.00,
            quantity: 1,
            collectionId: bagues._id,
            images: [
                'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
            ],
        });

        // Colliers
        await Product.create({
            name: 'Collier Rivière Diamants',
            description: 'Collier rivière en or blanc 18 carats serti de 50 diamants taille brillant. Longueur ajustable 40-45cm. Élégance absolue.',
            price: 15999.00,
            quantity: 2,
            collectionId: colliers._id,
            images: [
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
            ],
        });

        await Product.create({
            name: 'Pendentif Saphir Bleu',
            description: 'Pendentif en or blanc avec un saphir bleu du Sri Lanka de 2 carats, entouré d\'un halo de diamants. Chaîne en or blanc incluse.',
            price: 6799.00,
            quantity: 5,
            collectionId: colliers._id,
            images: [
                'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
            ],
        });

        // Bracelets
        await Product.create({
            name: 'Bracelet Tennis Diamants',
            description: 'Bracelet tennis en or blanc 18K serti de 80 diamants taille brillant. Fermoir sécurisé. Longueur 18cm.',
            price: 9999.00,
            quantity: 4,
            collectionId: bracelets._id,
            images: [
                'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
            ],
        });

        await Product.create({
            name: 'Jonc Or Rose et Diamants',
            description: 'Jonc rigide en or rose 750 orné de motifs géométriques sertis de diamants. Design moderne et intemporel.',
            price: 3299.00,
            quantity: 8,
            collectionId: bracelets._id,
            images: [
                'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
            ],
        });

        // Montres
        await Product.create({
            name: 'Montre Élégance Or Jaune',
            description: 'Montre de luxe en or jaune 18K avec mouvement automatique suisse. Cadran argenté, bracelet en cuir d\'alligator. Étanche 50m.',
            price: 18500.00,
            quantity: 2,
            collectionId: montres._id,
            images: [
                'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800',
            ],
        });

        await Product.create({
            name: 'Montre Diamants Femme',
            description: 'Montre pour femme en acier et or blanc, lunette sertie de diamants. Mouvement quartz suisse, bracelet en acier.',
            price: 7999.00,
            quantity: 6,
            collectionId: montres._id,
            images: [
                'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
            ],
        });

        console.log('✅ Produits créés: 10 produits');

        console.log('\n🎉 Base de données peuplée avec succès!');
        console.log('📊 Résumé:');
        console.log('   - 4 collections créées');
        console.log('   - 10 produits créés');
        console.log('\n🌐 Ouvrez http://localhost:3000 pour voir le résultat!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

seed();
