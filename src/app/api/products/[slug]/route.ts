import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

// GET - Récupérer un produit par slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;

        const product = await Product.findOne({ slug }).populate('collectionId', 'name slug');

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Produit non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération du produit' },
            { status: 500 }
        );
    }
}

// PUT - Mettre à jour un produit
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;
        const body = await request.json();

        const product = await Product.findOneAndUpdate(
            { slug },
            body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Produit non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la mise à jour du produit' },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer un produit
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const { slug } = await params;

        const product = await Product.findOneAndDelete({ slug });

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Produit non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {},
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la suppression du produit' },
            { status: 500 }
        );
    }
}
