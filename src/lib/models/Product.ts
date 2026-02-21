import mongoose, { Schema, Model, models } from 'mongoose';

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    images: string[];
    collectionId: mongoose.Types.ObjectId;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Le nom du produit est requis'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'La description est requise'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Le prix est requis'],
            min: [0, 'Le prix ne peut pas être négatif'],
        },
        quantity: {
            type: Number,
            required: [true, 'La quantité est requise'],
            min: [0, 'La quantité ne peut pas être négative'],
            default: 0,
        },
        images: {
            type: [String],
            default: [],
        },
        collectionId: {
            type: Schema.Types.ObjectId,
            ref: 'Collection',
            required: [true, 'La collection est requise'],
        },
        slug: {
            type: String,
            lowercase: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Index pour améliorer les performances de recherche
ProductSchema.index({ collectionId: 1 });
ProductSchema.index({ slug: 1 });

// Génération automatique du slug (Syntaxe async pour éviter les erreurs de callback next)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
ProductSchema.pre('save', async function (this: any) {
    if (this.isModified('name') || !this.slug) {
        this.slug = (this.name as string)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-') + '-' + Date.now();
    }
});

const Product: Model<IProduct> =
    models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
