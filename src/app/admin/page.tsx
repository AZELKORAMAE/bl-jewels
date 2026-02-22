'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import RevenueChart from '@/components/admin/RevenueChart';

/* ── Design tokens — LIGHT theme ─────────────────────────────────────── */
const GOLD = '#B8902A';
const GOLD_BRIGHT = '#D4A93A';
const GOLD_LIGHT = 'rgba(184,144,42,0.08)';
const GOLD_BORDER = 'rgba(184,144,42,0.22)';
const PAGE_BG = '#FDFBF6';
const CARD_BG = '#FFFFFF';
const CARD_BG2 = '#FAF7F0';
const TEXT_MAIN = '#1A1508';
const TEXT_MUTED = 'rgba(26,21,8,0.42)';

/* ── Card shell ───────────────────────────────────────────────────────── */
function Card({
    children, style = {}, hoverable = false,
}: {
    children: React.ReactNode;
    style?: React.CSSProperties;
    hoverable?: boolean;
}) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => hoverable && setHov(true)}
            onMouseLeave={() => hoverable && setHov(false)}
            style={{
                background: CARD_BG,
                border: `1px solid ${hov ? GOLD_BORDER : 'rgba(184,144,42,0.14)'}`,
                borderRadius: 16,
                boxShadow: hov
                    ? `0 8px 36px rgba(184,144,42,0.14), 0 1px 3px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset`
                    : `0 4px 24px rgba(184,144,42,0.08), 0 1px 3px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.9) inset`,
                transition: 'box-shadow 0.25s, border-color 0.25s',
                ...style,
            }}
        >
            {children}
        </div>
    );
}

/* ── Section title ────────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: string }) {
    return (
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <p style={{
                letterSpacing: '0.32em', fontSize: 11, color: GOLD,
                fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
                marginBottom: 14,
            }}>
                TABLEAU DE BORD
            </p>
            <h1 style={{
                margin: 0,
                fontSize: 'clamp(28px,4vw,44px)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: TEXT_MAIN,
                fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
            }}>
                {children}
            </h1>
            <div style={{
                width: 60, height: 1, margin: '20px auto 0',
                background: `linear-gradient(90deg,transparent,${GOLD},transparent)`,
            }} />
        </div>
    );
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
function Skeleton() {
    return (
        <div style={{
            height: 32, width: 64, borderRadius: 8,
            background: 'linear-gradient(90deg, #f0ebe0 25%, #faf7f0 50%, #f0ebe0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
        }} />
    );
}

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
        fetch('/api/stats')
            .then(r => r.json())
            .then(d => { if (d.success) setStats(d.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const formatPrice = (p: number) =>
        new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(p);

    const getCurrentRevenueData = () => {
        if (!stats) return [];
        return (timeframe === 'day' ? stats.revenueByDay
            : timeframe === 'month' ? stats.revenueByMonth
                : stats.revenueByYear) || [];
    };

    const cards = [
        { href: '/admin/collections', icon: '💎', title: 'Collections', desc: 'Gérer les collections de bijoux', count: stats?.collectionsCount },
        { href: '/admin/products', icon: '💍', title: 'Produits', desc: 'Ajouter et gérer les produits', count: stats?.productsCount },
        { href: '/admin/orders', icon: '📦', title: 'Commandes', desc: 'Consulter les commandes clients', count: stats?.ordersCount },
    ];

    return (
        <>
            {/* Shimmer keyframe */}
            <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

            <div style={{ minHeight: '100vh', background: PAGE_BG, paddingTop: 80, paddingBottom: 80 }}>
                <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>

                    {/* ── Header ── */}
                    <SectionTitle>Administration</SectionTitle>

                    {/* ── Revenue block ── */}
                    {stats && (
                        <div style={{ marginBottom: 52 }}>

                            {/* Top row: total + timeframe */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 20,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}>
                                {/* Revenue card */}
                                <Card style={{ padding: '28px 40px', minWidth: 260, flex: '1 1 260px' }}>
                                    <p style={{
                                        margin: '0 0 10px',
                                        fontSize: 11, letterSpacing: '0.28em', color: TEXT_MUTED,
                                        fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
                                    }}>
                                        REVENU TOTAL
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        fontSize: 'clamp(28px,3.5vw,42px)',
                                        fontWeight: 700,
                                        color: '#22863a',
                                        fontFamily: "'Cormorant Garamond',Georgia,serif",
                                        letterSpacing: '0.03em',
                                    }}>
                                        {formatPrice(stats.totalRevenue)}
                                    </p>
                                </Card>

                                {/* Timeframe switcher */}
                                <div style={{
                                    display: 'flex',
                                    background: CARD_BG,
                                    border: `1px solid ${GOLD_BORDER}`,
                                    borderRadius: 12,
                                    padding: 5,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                    gap: 4,
                                }}>
                                    {(['day', 'month', 'year'] as const).map(t => {
                                        const active = timeframe === t;
                                        return (
                                            <button key={t} onClick={() => setTimeframe(t)} style={{
                                                padding: '10px 22px',
                                                borderRadius: 8, border: 'none', cursor: 'pointer',
                                                fontSize: 12, fontWeight: 600,
                                                letterSpacing: '0.12em',
                                                fontFamily: "'Montserrat',sans-serif",
                                                background: active
                                                    ? `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`
                                                    : 'transparent',
                                                color: active ? '#fff' : TEXT_MUTED,
                                                boxShadow: active ? `0 2px 12px rgba(184,144,42,0.28)` : 'none',
                                                transition: 'all 0.2s',
                                            }}>
                                                {t === 'day' ? 'JOUR' : t === 'month' ? 'MOIS' : 'ANNÉE'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Chart */}
                            <Card style={{ padding: '8px 8px 0' }}>
                                <RevenueChart data={getCurrentRevenueData()} timeframe={timeframe} />
                            </Card>
                        </div>
                    )}

                    {/* ── Stat cards ── */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: 20,
                        marginBottom: 52,
                    }}>
                        {cards.map(card => (
                            <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
                                <Card hoverable style={{ padding: '32px 28px', textAlign: 'center', cursor: 'pointer' }}>
                                    {/* Icon */}
                                    <div style={{
                                        width: 64, height: 64,
                                        borderRadius: '50%',
                                        background: GOLD_LIGHT,
                                        border: `1px solid ${GOLD_BORDER}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 28, margin: '0 auto 20px',
                                    }}>
                                        {card.icon}
                                    </div>

                                    {/* Title */}
                                    <h2 style={{
                                        margin: '0 0 8px',
                                        fontSize: 11, letterSpacing: '0.28em',
                                        color: GOLD, fontFamily: "'Montserrat',sans-serif",
                                        fontWeight: 600,
                                    }}>
                                        {card.title.toUpperCase()}
                                    </h2>

                                    {/* Desc */}
                                    <p style={{
                                        margin: '0 0 20px',
                                        fontSize: 13, color: TEXT_MUTED,
                                        fontFamily: "'Montserrat',sans-serif",
                                        fontWeight: 300, lineHeight: 1.6,
                                    }}>
                                        {card.desc}
                                    </p>

                                    {/* Count */}
                                    <div style={{
                                        borderTop: `1px solid ${GOLD_BORDER}`,
                                        paddingTop: 18, marginTop: 4,
                                    }}>
                                        {loading ? <Skeleton /> : (
                                            <p style={{
                                                margin: 0,
                                                fontSize: 38, fontWeight: 700,
                                                color: TEXT_MAIN,
                                                fontFamily: "'Cormorant Garamond',Georgia,serif",
                                                letterSpacing: '0.04em',
                                                lineHeight: 1,
                                            }}>
                                                {card.count ?? 0}
                                            </p>
                                        )}
                                        <p style={{
                                            margin: '8px 0 0',
                                            fontSize: 10, letterSpacing: '0.22em',
                                            color: GOLD, fontFamily: "'Montserrat',sans-serif",
                                            fontWeight: 600,
                                        }}>
                                            OUVRIR →
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* ── Back link ── */}
                    <div style={{ textAlign: 'center' }}>
                        <Link href="/" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            fontSize: 11, letterSpacing: '0.22em',
                            color: TEXT_MUTED,
                            fontFamily: "'Montserrat',sans-serif",
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                            onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUTED)}
                        >
                            ← RETOUR AU SITE
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}