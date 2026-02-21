import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Commande non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la mise à jour de la commande' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const order = await Order.findByIdAndDelete(id);

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Commande non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la suppression de la commande' },
            { status: 500 }
        );
    }
}
