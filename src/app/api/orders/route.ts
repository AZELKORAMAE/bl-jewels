import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

// GET - Récupérer toutes les commandes
export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des commandes' },
            { status: 500 }
        );
    }
}

// POST - Créer une nouvelle commande
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        // Vérifier la disponibilité des produits et déduire du stock
        for (const item of body.items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return NextResponse.json(
                    { success: false, error: `Produit ${item.productName} non trouvé` },
                    { status: 404 }
                );
            }

            if (product.quantity < item.quantity) {
                return NextResponse.json(
                    { success: false, error: `Stock insuffisant pour ${item.productName}` },
                    { status: 400 }
                );
            }

            // Déduire du stock
            product.quantity -= item.quantity;
            await product.save();
        }

        const order = await Order.create(body);

        return NextResponse.json({
            success: true,
            data: order,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la création de la commande' },
            { status: 500 }
        );
    }
}
