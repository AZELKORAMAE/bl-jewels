'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import RevenueChart from '@/components/admin/RevenueChart';

interface Stats {
    collectionsCount: number;
    productsCount: number;
    ordersCount: number;
    totalRevenue: number;
    revenueByDay: { _id: string; total: number }[];
    revenueByMonth: { _id: string; total: number }[];
    revenueByYear: { _id: string; total: number }[];
}

export default function AdminPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<'day' | 'month' | 'year'>('day');

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD',
        }).format(price);
    };

    const cards = [
        {
            href: '/admin/collections',
            icon: '💎',
            title: 'Collections',
            desc: 'Gérer les collections de bijoux',
            count: stats?.collectionsCount,
            color: 'from-gold-light/50 to-gold-light/20',
        },
        {
            href: '/admin/products',
            icon: '💍',
            title: 'Produits',
            desc: 'Ajouter et gérer les produits',
            count: stats?.productsCount,
            color: 'from-cream to-white',
        },
        {
            href: '/admin/orders',
            icon: '📦',
            title: 'Commandes',
            desc: 'Consulter les commandes',
            count: stats?.ordersCount,
            color: 'from-green-50 to-white',
        },
    ];

    const getCurrentRevenueData = () => {
        if (!stats) return [];
        switch (timeframe) {
            case 'day': return stats.revenueByDay || [];
            case 'month': return stats.revenueByMonth || [];
            case 'year': return stats.revenueByYear || [];
            default: return [];
        }
    };

    return (
        <div className="section min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <span className="text-gold-primary text-xs font-semibold uppercase tracking-[0.2em] inline-block mb-2">
                        Tableau de bord
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading text-deep-black">Administration</h1>
                    <div className="divider mx-auto mt-6" />
                </div>

                {/* Revenue Section */}
                {stats && (
                    <div className="mb-16 fade-in px-4 md:px-0">
                        <div className="flex flex-col md:flex-row items-stretch justify-between mb-8 gap-6">
                            {/* Revenue Card - Light & Green */}
                            <div className="bg-white rounded-2xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-w-[300px] flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-success/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Revenu Total</p>
                                <p className="text-4xl md:text-5xl font-heading font-medium text-emerald-600">
                                    {formatPrice(stats.totalRevenue)}
                                </p>
                            </div>

                            {/* Timeframe Selector */}
                            <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 self-center">
                                {(['day', 'month', 'year'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTimeframe(t)}
                                        className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${timeframe === t
                                            ? 'bg-deep-black text-white shadow-md'
                                            : 'text-gray-500 hover:text-black hover:bg-gray-50'
                                            }`}
                                    >
                                        {t === 'day' ? 'Jour' : t === 'month' ? 'Mois' : 'Année'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="bg-white p-2 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                            <RevenueChart data={getCurrentRevenueData()} timeframe={timeframe} />
                        </div>
                    </div>
                )}

                {/* Dashboard Cards - "Sections à choisir" */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="bg-white group rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 border border-gray-100 hover:border-gold-primary/30 flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-gold-light/10 flex items-center justify-center text-3xl mb-6 transition-colors duration-300">
                                {card.icon}
                            </div>

                            <h2 className="text-xl font-heading mb-2 text-deep-black group-hover:text-gold-primary transition-colors">
                                {card.title}
                            </h2>

                            <p className="text-sm text-gray-elegant mb-6 line-clamp-2 min-h-[2.5em]">
                                {card.desc}
                            </p>

                            {loading ? (
                                <div className="skeleton h-8 w-16 mx-auto rounded-md" />
                            ) : (
                                <div className="mt-auto flex flex-col items-center gap-2">
                                    <p className="text-3xl font-heading font-light text-deep-black">
                                        {card.count ?? 0}
                                    </p>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gold-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        Ouvrir →
                                    </span>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>

                <div className="mt-20 text-center pb-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-primary transition-colors text-sm uppercase tracking-widest font-semibold group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour au site
                    </Link>
                </div>
            </div>
        </div>
    );
}
