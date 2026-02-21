import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

// GET - Récupérer tous les produits (avec filtre optionnel par collection)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const collectionId = searchParams.get('collectionId');

        const query = collectionId ? { collectionId } : {};
        const products = await Product.find(query)
            .populate('collectionId', 'name slug')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des produits' },
            { status: 500 }
        );
    }
}

// POST - Créer un nouveau produit
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
                .replace(/\s+/g, '-') + '-' + Date.now();
        }

        const product = await Product.create(body);

        return NextResponse.json({
            success: true,
            data: product,
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating product:', error);
        const err = error as { message?: string };
        return NextResponse.json(
            { success: false, error: err.message || 'Erreur lors de la création du produit' },
            { status: 500 }
        );
    }
}
