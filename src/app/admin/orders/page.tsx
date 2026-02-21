'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
    _id: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    total: number;
    status: string;
    createdAt: string;
    items: {
        productName: string;
        quantity: number;
        price: number;
    }[];
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                fetchOrders();
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;
        try {
            const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
            if (res.ok) fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'badge badge-warning',
            confirmed: 'badge badge-success',
            shipped: 'badge badge-gold',
            delivered: 'badge badge-success',
            paid: 'badge badge-purple bg-purple-100 text-purple-700',
            cancelled: 'badge badge-error',
        };

        const labels: Record<string, string> = {
            pending: 'En attente',
            confirmed: 'Confirmée',
            shipped: 'Expédiée',
            delivered: 'Livrée',
            paid: 'Payée',
            cancelled: 'Annulée',
        };

        return (
            <span className={styles[status] || 'badge'}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="section min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading">Gestion des Commandes</h1>
                        <p className="text-sm text-gray-elegant mt-1">{orders.length} commande{orders.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex justify-between mb-4">
                                    <div className="skeleton h-5 w-1/3 rounded" />
                                    <div className="skeleton h-6 w-24 rounded-full" />
                                </div>
                                <div className="skeleton h-4 w-1/2 mb-2 rounded" />
                                <div className="skeleton h-4 w-1/3 rounded" />
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-xl text-charcoal">Aucune commande</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-light/30 overflow-hidden">
                                {/* Order Header */}
                                <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start gap-3">
                                    {/* Status Selector */}
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="select select-sm text-xs border-gray-light focus:border-gold-primary"
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="confirmed">Confirmée</option>
                                            <option value="shipped">Expédiée</option>
                                            <option value="delivered">Livrée</option>
                                            <option value="paid">Payée</option>
                                            <option value="cancelled">Annulée</option>
                                        </select>
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="px-4 md:px-6 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-elegant mb-1">Client</p>
                                        <p className="text-sm font-medium text-deep-black">{order.customerName}</p>
                                        <p className="text-xs text-gray-elegant">{order.customerPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-elegant mb-1">Adresse</p>
                                        <p className="text-sm text-deep-black whitespace-pre-wrap">{order.customerAddress}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mx-4 md:mx-6 my-4 border-t border-gray-light/50 pt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-elegant mb-3">Articles</p>
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-charcoal">
                                                    {item.productName} <span className="text-gray-elegant">× {item.quantity}</span>
                                                </span>
                                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-light/50 mt-3 pt-3 flex justify-between items-center">
                                        <span className="text-sm font-heading font-medium">Total</span>
                                        <span className="text-xl font-semibold text-gold-primary">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className="text-xs text-error hover:underline opacity-60 hover:opacity-100"
                                        >
                                            Supprimer la commande
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link href="/admin" className="text-charcoal hover:text-gold-primary transition-colors text-sm">
                        ← Retour à l&apos;admin
                    </Link>
                </div>
            </div>
        </div>
    );
}
