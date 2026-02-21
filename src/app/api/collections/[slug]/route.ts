import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Collection from '@/lib/models/Collection';

// GET - Récupérer une collection par slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;

        const collection = await Collection.findOne({ slug });

        if (!collection) {
            return NextResponse.json(
                { success: false, error: 'Collection non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: collection,
        });
    } catch (error) {
        console.error('Error fetching collection:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération de la collection' },
            { status: 500 }
        );
    }
}

// PUT - Mettre à jour une collection
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const collection = await Collection.findOneAndUpdate(
            { slug },
            body,
            { new: true, runValidators: true }
        );

        if (!collection) {
            return NextResponse.json(
                { success: false, error: 'Collection non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: collection,
        });
    } catch (error) {
        console.error('Error updating collection:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la mise à jour de la collection' },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer une collection
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;

        const collection = await Collection.findOneAndDelete({ slug });

        if (!collection) {
            return NextResponse.json(
                { success: false, error: 'Collection non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {},
        });
    } catch (error) {
        console.error('Error deleting collection:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la suppression de la collection' },
            { status: 500 }
        );
    }
}
