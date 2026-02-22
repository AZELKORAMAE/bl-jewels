'use client';

import { useMemo } from 'react';

interface RevenueData {
    _id: string;
    total: number;
}

interface RevenueChartProps {
    data: RevenueData[];
    timeframe: 'day' | 'month' | 'year';
}

export default function RevenueChart({ data, timeframe }: RevenueChartProps) {
    const maxRevenue = useMemo(() => {
        return Math.max(...data.map((d) => d.total), 1);
    }, [data]);

    const formatPrice = (price: number) => {
        return `${price.toLocaleString('fr-FR')} DH`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (timeframe === 'day') {
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        } else if (timeframe === 'month') {
            return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        }
        return dateStr; // Year is already 'YYYY'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 w-full">
            <div className="flex items-end justify-between h-64 gap-2 sm:gap-4 mt-8">
                {data.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                        Aucune donnée disponible pour cette période
                    </div>
                ) : (
                    data.map((item) => {
                        const heightPercentage = (item.total / maxRevenue) * 100;
                        return (
                            <div key={item._id} className="flex flex-col items-center justify-end h-full flex-1 group relative">
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-deep-black text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                    {formatPrice(item.total)}
                                </div>

                                {/* Bar */}
                                <div
                                    className="w-full max-w-[40px] bg-gradient-to-t from-gold-primary to-gold-light rounded-t-sm hover:from-gold-secondary hover:to-gold-primary transition-all duration-300 relative"
                                    style={{ height: `${heightPercentage}%` }}
                                >
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Label */}
                                <span className="text-[10px] sm:text-xs text-gray-500 mt-2 rotate-0 truncate w-full text-center">
                                    {formatDate(item._id)}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
