'use client';

import { useCart, type CartItem } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

/* ── Design tokens — LIGHT theme ─────────────────────────────────────── */
const GOLD = '#B8902A';
const GOLD_BRIGHT = '#D4A93A';
const GOLD_LIGHT = 'rgba(184,144,42,0.08)';
const GOLD_BORDER = 'rgba(184,144,42,0.22)';
const PAGE_BG = '#FDFBF6';        // warm ivory
const CARD_BG = '#FFFFFF';
const CARD_BG2 = '#FAF7F0';        // very light warm cream
const TEXT_MAIN = '#1A1508';        // near-black warm
const TEXT_MUTED = 'rgba(26,21,8,0.42)';
const BORDER_LIGHT = 'rgba(26,21,8,0.07)';

/* ── Card shell ───────────────────────────────────────────────────────── */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{
            background: CARD_BG,
            border: `1px solid ${GOLD_BORDER}`,
            borderRadius: 16,
            boxShadow: `
                0 1px 0 rgba(255,255,255,0.9) inset,
                0 4px 24px rgba(184,144,42,0.10),
                0 1px 3px rgba(0,0,0,0.06)
            `,
            ...style,
        }}>
            {children}
        </div>
    );
}

/* ── Section label ────────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: string }) {
    return (
        <div style={{ marginBottom: 24 }}>
            <h2 style={{
                margin: 0, fontSize: 11,
                letterSpacing: '0.32em',
                color: GOLD,
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 600,
            }}>
                {children}
            </h2>
            <div style={{
                marginTop: 10, width: 40, height: 1,
                background: `linear-gradient(90deg,${GOLD},transparent)`,
            }} />
        </div>
    );
}

/* ── Qty button ───────────────────────────────────────────────────────── */
function QtyButton({ onClick, children }: { onClick: () => void; children: string }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: 32, height: 32, borderRadius: 8,
                border: `1px solid ${hov ? GOLD : GOLD_BORDER}`,
                background: hov ? GOLD_LIGHT : '#fff',
                color: hov ? GOLD : TEXT_MUTED,
                fontSize: 16, cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Montserrat',sans-serif",
            }}>
            {children}
        </button>
    );
}

/* ── Empty state ──────────────────────────────────────────────────────── */
function EmptyCart() {
    return (
        <div style={{
            minHeight: '100vh', background: PAGE_BG,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', textAlign: 'center', padding: '0 24px',
        }}>
            <div style={{ fontSize: 72, opacity: 0.15, marginBottom: 28 }}>💍</div>
            <p style={{ letterSpacing: '0.32em', fontSize: 11, color: GOLD, fontFamily: "'Montserrat',sans-serif", marginBottom: 16 }}>
                BL JEWELS
            </p>
            <h1 style={{
                margin: '0 0 16px', fontSize: 'clamp(28px,4vw,42px)',
                fontWeight: 700, letterSpacing: '0.06em', color: TEXT_MAIN,
                fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
            }}>
                Votre Panier est Vide
            </h1>
            <div style={{ width: 50, height: 1, margin: '0 auto 28px', background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
            <p style={{ color: TEXT_MUTED, fontSize: 14, fontFamily: "'Montserrat',sans-serif", fontWeight: 300, marginBottom: 36, lineHeight: 1.8 }}>
                Découvrez nos créations d'exception
            </p>
            <Link href="/collections" style={{
                display: 'inline-block', padding: '14px 36px',
                background: `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`,
                borderRadius: 10, color: '#fff', fontSize: 11,
                fontWeight: 700, letterSpacing: '0.25em',
                fontFamily: "'Montserrat',sans-serif",
                textDecoration: 'none',
                boxShadow: `0 4px 20px rgba(184,144,42,0.28)`,
            }}>
                DÉCOUVRIR LES COLLECTIONS
            </Link>
        </div>
    );
}

/* ── Cart item card ───────────────────────────────────────────────────── */
function CartItemCard({ item, updateQuantity, removeFromCart, formatPrice }: {
    item: CartItem;
    updateQuantity: (id: string, qty: number) => void;
    removeFromCart: (id: string) => void;
    formatPrice: (n: number) => string;
}) {
    const [removing, setRemoving] = useState(false);
    const handleRemove = () => { setRemoving(true); setTimeout(() => removeFromCart(item.productId), 260); };

    return (
        <Card style={{
            padding: '20px 22px',
            display: 'flex', gap: 20, alignItems: 'center',
            opacity: removing ? 0 : 1,
            transform: removing ? 'translateX(12px)' : 'none',
            transition: 'opacity 0.25s, transform 0.25s',
        }}>
            {/* Thumbnail */}
            <div style={{
                width: 72, height: 72, flexShrink: 0,
                borderRadius: 10,
                border: `1px solid ${GOLD_BORDER}`,
                overflow: 'hidden',
                background: CARD_BG2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {item.image ? (
                    <Image src={item.image} alt={item.name} width={72} height={72}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <span style={{ fontSize: 28 }}>💍</span>
                )}
            </div>

            {/* Info */}
            <div style={{ flexGrow: 1, minWidth: 0 }}>
                <h3 style={{
                    margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: TEXT_MAIN,
                    fontFamily: "'Cormorant Garamond',Georgia,serif",
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                    {item.name}
                </h3>
                <p style={{ margin: '0 0 14px', fontSize: 13, color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 500, letterSpacing: '0.04em' }}>
                    {formatPrice(item.price)}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <QtyButton onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</QtyButton>
                    <span style={{ width: 28, textAlign: 'center', fontSize: 14, fontWeight: 600, color: TEXT_MAIN, fontFamily: "'Montserrat',sans-serif" }}>
                        {item.quantity}
                    </span>
                    <QtyButton onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</QtyButton>

                    <button onClick={handleRemove} style={{
                        marginLeft: 8, background: 'none', border: 'none',
                        color: 'rgba(200,60,60,0.55)', fontSize: 11,
                        letterSpacing: '0.15em', fontFamily: "'Montserrat',sans-serif",
                        cursor: 'pointer', padding: 0, transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(200,60,60,0.90)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,60,60,0.55)')}
                    >
                        RETIRER
                    </button>
                </div>
            </div>

            {/* Subtotal */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: GOLD, fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.03em' }}>
                    {formatPrice(item.price * item.quantity)}
                </p>
            </div>
        </Card>
    );
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
    const formatPrice = (p: number) => `${p.toLocaleString('fr-FR')} DH`;

    if (cart.length === 0) return <EmptyCart />;

    return (
        <div style={{ minHeight: '100vh', background: PAGE_BG, paddingTop: 80, paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 52, padding: '0 24px' }}>
                <p style={{ letterSpacing: '0.35em', fontSize: 11, color: GOLD, fontFamily: "'Montserrat',sans-serif", marginBottom: 14 }}>
                    BL JEWELS
                </p>
                <h1 style={{
                    margin: 0, fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700,
                    letterSpacing: '0.06em', color: TEXT_MAIN,
                    fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
                }}>
                    Votre Panier
                </h1>
                <div style={{ width: 50, height: 1, margin: '18px auto 14px', background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
                <p style={{ fontSize: 11, color: TEXT_MUTED, letterSpacing: '0.20em', fontFamily: "'Montserrat',sans-serif" }}>
                    {cart.length} ARTICLE{cart.length !== 1 ? 'S' : ''}
                </p>
            </div>

            {/* Grid */}
            <div style={{
                maxWidth: 1080, margin: '0 auto', padding: '0 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 28, alignItems: 'start',
            }}>
                {/* Items */}
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {cart.map((item: CartItem) => (
                        <CartItemCard key={item.productId} item={item}
                            updateQuantity={updateQuantity}
                            removeFromCart={removeFromCart}
                            formatPrice={formatPrice} />
                    ))}
                    <Link href="/collections" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 6,
                        color: TEXT_MUTED, fontSize: 11, letterSpacing: '0.18em',
                        fontFamily: "'Montserrat',sans-serif", textDecoration: 'none', transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                        onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUTED)}
                    >
                        ← CONTINUER MES ACHATS
                    </Link>
                </div>

                {/* Summary */}
                <div style={{ position: 'sticky', top: 100 }}>
                    <Card style={{ padding: '28px 26px' }}>
                        <SectionTitle>Récapitulatif</SectionTitle>

                        <div style={{ marginBottom: 20 }}>
                            {[
                                { label: 'Sous-total', value: formatPrice(getTotal()), valueColor: TEXT_MAIN },
                                { label: 'Livraison', value: 'GRATUITE', valueColor: '#27AE60' },
                            ].map(row => (
                                <div key={row.label} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    padding: '10px 0', borderBottom: `1px solid ${BORDER_LIGHT}`,
                                }}>
                                    <span style={{ fontSize: 12, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", letterSpacing: '0.06em' }}>{row.label}</span>
                                    <span style={{ fontSize: 12, color: row.valueColor, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, letterSpacing: '0.06em' }}>{row.value}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 16 }}>
                                <span style={{ fontSize: 11, letterSpacing: '0.28em', color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif" }}>TOTAL</span>
                                <span style={{ fontSize: 24, fontWeight: 700, color: GOLD, fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.03em' }}>
                                    {formatPrice(getTotal())}
                                </span>
                            </div>
                        </div>

                        <Link href="/checkout" style={{
                            display: 'block', textAlign: 'center', padding: '15px 0',
                            background: `linear-gradient(135deg,${GOLD_BRIGHT} 0%,${GOLD} 55%,#9E7820 100%)`,
                            borderRadius: 10, color: '#fff', fontSize: 11,
                            fontWeight: 700, letterSpacing: '0.25em',
                            fontFamily: "'Montserrat',sans-serif", textDecoration: 'none',
                            boxShadow: `0 4px 20px rgba(184,144,42,0.28), 0 1px 0 rgba(255,255,255,0.30) inset`,
                            transition: 'transform 0.15s, box-shadow 0.15s',
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = `0 6px 28px rgba(184,144,42,0.38), 0 1px 0 rgba(255,255,255,0.30) inset`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = `0 4px 20px rgba(184,144,42,0.28), 0 1px 0 rgba(255,255,255,0.30) inset`;
                            }}
                        >
                            PROCÉDER AU PAIEMENT
                        </Link>
                    </Card>

                    {/* Trust badge */}
                    <div style={{
                        marginTop: 14, background: GOLD_LIGHT,
                        border: `1px solid ${GOLD_BORDER}`,
                        borderRadius: 12, padding: '14px 18px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
                        <p style={{ margin: 0, fontSize: 11, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", fontWeight: 300, lineHeight: 1.7, letterSpacing: '0.02em' }}>
                            Commande sécurisée · Livraison gratuite · Service client dédié
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}