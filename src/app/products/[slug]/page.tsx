'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

/* ── Tokens ──────────────────────────────────────────────────────────── */
const GOLD = '#B8902A';
const GOLD_BRIGHT = '#D4A93A';
const GOLD_LIGHT = 'rgba(184,144,42,0.08)';
const GOLD_BORDER = 'rgba(184,144,42,0.22)';
const PAGE_BG = '#FDFBF6';
const CARD_BG = '#FFFFFF';
const CARD_BG2 = '#FAF7F0';
const TEXT_MAIN = '#1A1508';
const TEXT_MUTED = 'rgba(26,21,8,0.42)';

interface Product {
    _id: string; name: string; description: string;
    price: number; quantity: number; images: string[]; slug: string;
}

const fmtPrice = (p: number) =>
    new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(p);

/* ── Skeleton ────────────────────────────────────────────────────────── */
function LoadingSkeleton() {
    return (
        <>
            <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
            <div style={{ minHeight: '100vh', background: PAGE_BG, paddingTop: 80, paddingBottom: 80 }}>
                <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48 }}>
                        <div style={{ borderRadius: 16, aspectRatio: '1/1', background: 'linear-gradient(90deg,#f0ebe0 25%,#faf7f0 50%,#f0ebe0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[{ w: '75%', h: 32 }, { w: '40%', h: 28 }, { w: '100%', h: 14 }, { w: '100%', h: 14 }, { w: '65%', h: 14 }, { w: '100%', h: 52 }].map((s, i) => (
                                <div key={i} style={{ width: s.w, height: s.h, borderRadius: 8, background: 'linear-gradient(90deg,#f0ebe0 25%,#faf7f0 50%,#f0ebe0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ── Qty button ──────────────────────────────────────────────────────── */
function QtyBtn({ onClick, children }: { onClick: () => void; children: string }) {
    const [hov, setHov] = useState(false);
    return (
        <button onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: 44, height: 44, borderRadius: 10, border: `1px solid ${hov ? GOLD : GOLD_BORDER}`,
                background: hov ? GOLD_LIGHT : '#fff',
                color: hov ? GOLD : TEXT_MUTED, fontSize: 20, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Montserrat',sans-serif", transition: 'all 0.18s',
                flexShrink: 0,
            }}>
            {children}
        </button>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════════ */
export default function ProductPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch(`/api/products/${slug}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => setProduct(d?.data ?? null))
            .catch(() => setProduct(null))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <LoadingSkeleton />;
    if (!product) return notFound();

    const inStock = product.quantity > 0;

    const handleAdd = () => {
        if (inStock && qty > 0 && qty <= product.quantity) {
            addToCart({ productId: product._id, name: product.name, price: product.price, image: product.images[0] }, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 2500);
        }
    };

    const perks = [
        { icon: '✦', label: 'Certificat inclus' },

        { icon: '✦', label: ' Livraison gratuite' },
        { icon: '✦', label: 'Emballage cadeau' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: PAGE_BG, paddingTop: 80, paddingBottom: 80 }}>
            <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>

                {/* Breadcrumb */}
                <div style={{ marginBottom: 36 }}>
                    <Link href="/collections" style={{
                        fontSize: 11, letterSpacing: '0.20em',
                        color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif",
                        fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                        onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUTED)}
                    >
                        ← RETOUR AUX COLLECTIONS
                    </Link>
                </div>

                {/* Main grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 52, alignItems: 'start' }}>

                    {/* ── Left: gallery ── */}
                    <div>
                        {/* Main image */}
                        <div style={{
                            borderRadius: 18,
                            overflow: 'hidden',
                            border: `1px solid ${GOLD_BORDER}`,
                            background: CARD_BG2,
                            aspectRatio: '1/1',
                            boxShadow: `0 8px 40px rgba(184,144,42,0.10), 0 1px 3px rgba(0,0,0,0.04)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {product.images.length > 0 ? (
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    width={600} height={600}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    priority
                                />
                            ) : (
                                <span style={{ fontSize: 80, opacity: 0.15 }}>💍</span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
                                {product.images.map((img, i) => (
                                    <button key={i} onClick={() => setSelectedImage(i)}
                                        style={{
                                            borderRadius: 10, overflow: 'hidden',
                                            aspectRatio: '1/1', padding: 0, cursor: 'pointer',
                                            border: `2px solid ${i === selectedImage ? GOLD : 'transparent'}`,
                                            opacity: i === selectedImage ? 1 : 0.6,
                                            boxShadow: i === selectedImage ? `0 2px 12px rgba(184,144,42,0.22)` : 'none',
                                            transition: 'all 0.2s',
                                        }}>
                                        <Image src={img} alt={`${product.name} ${i + 1}`}
                                            width={150} height={150}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: info ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                        {/* Category / badge */}
                        <p style={{ margin: '0 0 14px', fontSize: 11, letterSpacing: '0.30em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                            BL JEWELS
                        </p>

                        {/* Name */}
                        <h1 style={{
                            margin: '0 0 18px',
                            fontSize: 'clamp(26px,3.5vw,40px)',
                            fontWeight: 700, letterSpacing: '0.05em',
                            color: TEXT_MAIN,
                            fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
                            lineHeight: 1.15,
                        }}>
                            {product.name}
                        </h1>

                        {/* Price */}
                        <p style={{
                            margin: '0 0 20px',
                            fontSize: 'clamp(24px,3vw,34px)',
                            fontWeight: 700, color: GOLD,
                            fontFamily: "'Cormorant Garamond',Georgia,serif",
                            letterSpacing: '0.04em',
                        }}>
                            {fmtPrice(product.price)}
                        </p>

                        {/* Gold divider */}
                        <div style={{ width: 48, height: 1, background: `linear-gradient(90deg,${GOLD},transparent)`, marginBottom: 22 }} />

                        {/* Description */}
                        <p style={{
                            margin: '0 0 24px',
                            fontSize: 14, lineHeight: 1.85,
                            color: TEXT_MUTED,
                            fontFamily: "'Montserrat',sans-serif",
                            fontWeight: 300, letterSpacing: '0.02em',
                            whiteSpace: 'pre-wrap',
                        }}>
                            {product.description}
                        </p>

                        {/* Stock badge */}
                        <div style={{ marginBottom: 28 }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 7,
                                padding: '6px 14px', borderRadius: 20,
                                fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                                fontFamily: "'Montserrat',sans-serif",
                                background: inStock ? 'rgba(34,134,58,0.09)' : 'rgba(200,50,50,0.08)',
                                color: inStock ? '#1a7f37' : 'rgba(180,40,40,0.80)',
                                border: `1px solid ${inStock ? 'rgba(34,134,58,0.20)' : 'rgba(200,50,50,0.18)'}`,
                            }}>
                                {inStock ? `✓ EN STOCK · ${product.quantity} disponible${product.quantity > 1 ? 's' : ''}` : '✗ RUPTURE DE STOCK'}
                            </span>
                        </div>

                        {/* Qty + CTA */}
                        {inStock && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {/* Qty selector */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: 10, fontSize: 11, letterSpacing: '0.25em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                                        QUANTITÉ
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <QtyBtn onClick={() => setQty(Math.max(1, qty - 1))}>−</QtyBtn>
                                        <input type="number" min={1} max={product.quantity} value={qty}
                                            onChange={e => setQty(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                                            style={{
                                                width: 64, height: 44, textAlign: 'center',
                                                border: `1px solid ${GOLD_BORDER}`, borderRadius: 10,
                                                background: CARD_BG2, color: TEXT_MAIN,
                                                fontSize: 15, fontWeight: 600,
                                                fontFamily: "'Montserrat',sans-serif",
                                                outline: 'none',
                                            }}
                                        />
                                        <QtyBtn onClick={() => setQty(Math.min(product.quantity, qty + 1))}>+</QtyBtn>
                                    </div>
                                </div>

                                {/* Add to cart button */}
                                <button onClick={handleAdd}
                                    style={{
                                        width: '100%', padding: '16px 0',
                                        borderRadius: 12, border: 'none',
                                        background: added
                                            ? 'rgba(34,134,58,0.90)'
                                            : `linear-gradient(135deg,${GOLD_BRIGHT} 0%,${GOLD} 55%,#9E7820 100%)`,
                                        color: '#fff', fontSize: 12,
                                        fontWeight: 700, letterSpacing: '0.25em',
                                        fontFamily: "'Montserrat',sans-serif",
                                        cursor: 'pointer',
                                        boxShadow: added
                                            ? `0 4px 20px rgba(34,134,58,0.28)`
                                            : `0 4px 24px rgba(184,144,42,0.32), 0 1px 0 rgba(255,255,255,0.20) inset`,
                                        transition: 'background 0.3s, box-shadow 0.2s, transform 0.15s',
                                    }}
                                    onMouseEnter={e => { if (!added) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 30px rgba(184,144,42,0.42), 0 1px 0 rgba(255,255,255,0.20) inset`; } }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = added ? `0 4px 20px rgba(34,134,58,0.28)` : `0 4px 24px rgba(184,144,42,0.32), 0 1px 0 rgba(255,255,255,0.20) inset`; }}
                                >
                                    {added ? '✓ AJOUTÉ AU PANIER' : 'AJOUTER AU PANIER'}
                                </button>

                                {/* Perks */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    gap: '12px 16px',
                                    paddingTop: 20,
                                    borderTop: `1px solid ${GOLD_BORDER}`,
                                    marginTop: 4,
                                }}>
                                    {perks.map((p, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ color: GOLD, fontSize: 10, flexShrink: 0 }}>{p.icon}</span>
                                            <span style={{ fontSize: 11, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", fontWeight: 300, letterSpacing: '0.04em' }}>
                                                {p.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Out of stock — link to collections */}
                        {!inStock && (
                            <Link href="/collections" style={{
                                display: 'inline-block', marginTop: 16,
                                padding: '14px 28px', borderRadius: 12,
                                border: `1px solid ${GOLD_BORDER}`,
                                color: GOLD, fontSize: 11, fontWeight: 700,
                                letterSpacing: '0.20em', fontFamily: "'Montserrat',sans-serif",
                                textDecoration: 'none', textAlign: 'center',
                                transition: 'background 0.2s',
                            }}
                                onMouseEnter={e => (e.currentTarget.style.background = GOLD_LIGHT)}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                VOIR D'AUTRES BIJOUX
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}