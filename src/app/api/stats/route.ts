import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Collection from '@/lib/models/Collection';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';

// GET - Récupérer les statistiques du dashboard
export async function GET() {
    try {
        await dbConnect();

        const [collectionsCount, productsCount, ordersCount, recentOrders] = await Promise.all([
            Collection.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
        ]);

        // Calculer le revenu total (uniquement payé, livré, expédié ou confirmé)
        const revenueFilter = { status: { $in: ['confirmed', 'shipped', 'delivered', 'paid'] } };

        const orders = await Order.find(revenueFilter).lean();
        const totalRevenue = orders.reduce((sum: number, order: { total?: number }) => sum + (order.total || 0), 0);

        // Aggregation pour le revenu par jour (30 derniers jours)
        const revenueByDay = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
                    ...revenueFilter
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Aggregation pour le revenu par mois (12 derniers mois)
        const revenueByMonth = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)) },
                    ...revenueFilter
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Aggregation pour le revenu par année (5 dernières années)
        const revenueByYear = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 4)) },
                    ...revenueFilter
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                collectionsCount,
                productsCount,
                ordersCount,
                totalRevenue,
                recentOrders,
                revenueByDay,
                revenueByMonth,
                revenueByYear
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors de la récupération des statistiques' },
            { status: 500 }
        );
    }
}
