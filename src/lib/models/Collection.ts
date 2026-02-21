import mongoose, { Schema, Model, models } from 'mongoose';

export interface ICollection {
    _id: string;
    name: string;
    description: string;
    image?: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const CollectionSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Le nom de la collection est requis'],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: [true, 'La description est requise'],
            trim: true,
        },
        image: {
            type: String,
            default: '',
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Génération automatique du slug (Syntaxe async pour éviter les erreurs de callback next)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
CollectionSchema.pre('save', async function (this: any) {
    if (this.isModified('name') || !this.slug) {
        this.slug = (this.name as string)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    }
});

const Collection: Model<ICollection> =
    models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;
