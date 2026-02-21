import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Collection from '@/lib/models/Collection';

// GET - Récupérer toutes les collections
export async function GET() {
    try {
        await dbConnect();
        const collections = await Collection.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: collections,
        });
    } catch (error) {
        console.error('Error fetching collections:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des collections' },
            { status: 500 }
        );
    }
}

// POST - Créer une nouvelle collection
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        // Générer le slug à partir du nom
        if (body.name) {
            body.slug = body.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
        }

        const collection = await Collection.create(body);

        return NextResponse.json({
            success: true,
            data: collection,
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating collection:', error);
        const err = error as { code?: number; message?: string };

        if (err.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Une collection avec ce nom existe déjà' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: err.message || 'Erreur lors de la création de la collection' },
            { status: 500 }
        );
    }
}
