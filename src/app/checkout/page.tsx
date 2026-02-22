'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

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
const BORDER_LIGHT = 'rgba(26,21,8,0.07)';

/* ── Card ─────────────────────────────────────────────────────────────── */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{
            background: CARD_BG,
            border: `1px solid ${GOLD_BORDER}`,
            borderRadius: 16,
            boxShadow: `
                0 1px 0 rgba(255,255,255,0.9) inset,
                0 4px 24px rgba(184,144,42,0.10),
                0 1px 3px rgba(0,0,0,0.05)
            `,
            ...style,
        }}>
            {children}
        </div>
    );
}

/* ── Section title ────────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: string }) {
    return (
        <div style={{ marginBottom: 28 }}>
            <h2 style={{ margin: 0, fontSize: 11, letterSpacing: '0.32em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                {children}
            </h2>
            <div style={{ marginTop: 10, width: 40, height: 1, background: `linear-gradient(90deg,${GOLD},transparent)` }} />
        </div>
    );
}

/* ── Field ────────────────────────────────────────────────────────────── */
function Field({ label, id, type = 'text', value, onChange, placeholder, required, rows }: {
    label: string; id: string; type?: string; value: string;
    onChange: (v: string) => void; placeholder?: string; required?: boolean; rows?: number;
}) {
    const [focus, setFocus] = useState(false);
    const shared: React.CSSProperties = {
        width: '100%', boxSizing: 'border-box' as const,
        background: focus ? '#fff' : CARD_BG2,
        border: `1px solid ${focus ? GOLD : GOLD_BORDER}`,
        borderRadius: 10, padding: '13px 16px',
        color: TEXT_MAIN, fontSize: 14,
        fontFamily: "'Montserrat',sans-serif", fontWeight: 300,
        letterSpacing: '0.03em', outline: 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
        boxShadow: focus ? `0 0 0 3px rgba(184,144,42,0.12)` : 'none',
        resize: 'none' as const,
    };
    return (
        <div style={{ marginBottom: 20 }}>
            <label htmlFor={id} style={{ display: 'block', marginBottom: 8, fontSize: 11, letterSpacing: '0.25em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                {label}
            </label>
            {rows ? (
                <textarea id={id} rows={rows} required={required} value={value} placeholder={placeholder}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                    style={{ ...shared, lineHeight: 1.8 }} />
            ) : (
                <input id={id} type={type} required={required} value={value} placeholder={placeholder}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                    style={shared} />
            )}
        </div>
    );
}

/* ── Main ─────────────────────────────────────────────────────────────── */
export default function CheckoutPage() {
    const router = useRouter();
    const { cart, getTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ customerName: '', customerPhone: '', customerAddress: '' });
    const set = (k: keyof typeof formData) => (v: string) => setFormData(p => ({ ...p, [k]: v }));

    const formatPrice = (p: number) =>
        new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(p);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: cart.map(i => ({ productId: i.productId, productName: i.name, quantity: i.quantity, price: i.price })),
                    total: getTotal(),
                }),
            });
            const data = await res.json();
            if (data.success) { clearCart(); alert('Commande passée avec succès !'); router.push('/'); }
            else alert(`Erreur : ${data.error}`);
        } catch { alert('Erreur lors de la création de la commande'); }
        finally { setLoading(false); }
    };

    if (cart.length === 0) { router.push('/cart'); return null; }

    return (
        <div style={{ minHeight: '100vh', background: PAGE_BG, paddingTop: 80, paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 56, padding: '0 24px' }}>
                <p style={{ letterSpacing: '0.35em', fontSize: 11, color: GOLD, fontFamily: "'Montserrat',sans-serif", marginBottom: 14 }}>
                    BL JEWELS
                </p>
                <h1 style={{
                    margin: 0, fontSize: 'clamp(28px,4vw,44px)',
                    fontWeight: 700, letterSpacing: '0.06em', color: TEXT_MAIN,
                    fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
                }}>
                    Finaliser la Commande
                </h1>
                <div style={{ width: 60, height: 1, margin: '22px auto 0', background: `linear-gradient(90deg,transparent,${GOLD},transparent)` }} />
            </div>

            {/* Grid */}
            <div style={{
                maxWidth: 1020, margin: '0 auto', padding: '0 24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 28, alignItems: 'start',
            }}>

                {/* Form */}
                <Card style={{ padding: '36px 32px' }}>
                    <SectionTitle>Informations de livraison</SectionTitle>
                    <form onSubmit={handleSubmit}>
                        <Field label="Nom Complet *" id="customerName" value={formData.customerName} onChange={set('customerName')} placeholder="Mohammed …" required />
                        <Field label="Numéro de Téléphone *" id="customerPhone" type="tel" value={formData.customerPhone} onChange={set('customerPhone')} placeholder="+212 6 00 00 00 00" required />
                        <Field label="Adresse Complète *" id="customerAddress" value={formData.customerAddress} onChange={set('customerAddress')} placeholder={"123 Rue Ijtihad\nCasablanca"} required rows={4} />

                        <button type="submit" disabled={loading}
                            style={{
                                marginTop: 8, width: '100%', padding: '15px 0',
                                background: loading ? 'rgba(184,144,42,0.35)'
                                    : `linear-gradient(135deg,${GOLD_BRIGHT} 0%,${GOLD} 55%,#9E7820 100%)`,
                                border: 'none', borderRadius: 10,
                                color: loading ? 'rgba(255,255,255,0.6)' : '#fff',
                                fontSize: 11, fontWeight: 700, letterSpacing: '0.25em',
                                fontFamily: "'Montserrat',sans-serif",
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'transform 0.15s, box-shadow 0.15s',
                                boxShadow: loading ? 'none' : `0 4px 20px rgba(184,144,42,0.30), 0 1px 0 rgba(255,255,255,0.25) inset`,
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 28px rgba(184,144,42,0.40), 0 1px 0 rgba(255,255,255,0.25) inset`; } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px rgba(184,144,42,0.30), 0 1px 0 rgba(255,255,255,0.25) inset`; }}
                        >
                            {loading ? 'TRAITEMENT…' : 'CONFIRMER LA COMMANDE'}
                        </button>
                    </form>
                </Card>

                {/* Summary */}
                <div style={{ position: 'sticky', top: 100 }}>
                    <Card style={{ padding: '28px 26px' }}>
                        <SectionTitle>Récapitulatif</SectionTitle>

                        {/* Items */}
                        <div style={{ marginBottom: 24 }}>
                            {cart.map(item => (
                                <div key={item.productId} style={{
                                    display: 'flex', gap: 14, alignItems: 'center',
                                    padding: '12px 0', borderBottom: `1px solid ${BORDER_LIGHT}`,
                                }}>
                                    <div style={{
                                        width: 52, height: 52, flexShrink: 0,
                                        borderRadius: 8, border: `1px solid ${GOLD_BORDER}`,
                                        overflow: 'hidden', background: CARD_BG2,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} width={52} height={52} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : <span style={{ fontSize: 22 }}>💍</span>}
                                    </div>
                                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: 13, color: TEXT_MAIN, fontFamily: "'Montserrat',sans-serif", fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.name}
                                        </p>
                                        <p style={{ margin: '3px 0 0', fontSize: 11, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", letterSpacing: '0.06em' }}>
                                            Qté : {item.quantity}
                                        </p>
                                    </div>
                                    <p style={{ flexShrink: 0, margin: 0, fontSize: 13, color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div style={{ borderTop: `1px solid ${GOLD_BORDER}`, paddingTop: 16 }}>
                            {[
                                { label: 'Livraison', value: 'GRATUITE', color: '#27AE60' },
                            ].map(r => (
                                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <span style={{ fontSize: 12, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", letterSpacing: '0.08em' }}>{r.label}</span>
                                    <span style={{ fontSize: 12, color: r.color, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, letterSpacing: '0.06em' }}>{r.value}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
                                <span style={{ fontSize: 11, letterSpacing: '0.28em', color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif" }}>TOTAL</span>
                                <span style={{ fontSize: 22, fontWeight: 700, color: GOLD, fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.04em' }}>
                                    {formatPrice(getTotal())}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Note */}
                    <div style={{
                        marginTop: 16, background: GOLD_LIGHT,
                        border: `1px solid ${GOLD_BORDER}`,
                        borderRadius: 12, padding: '16px 20px',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                    }}>
                        <p style={{ margin: 0, fontSize: 12, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", fontWeight: 300, lineHeight: 1.75, letterSpacing: '0.02em' }}>
                            <span style={{ color: GOLD, fontWeight: 600 }}>Note :</span>{' '}
                            Vous serez contacté par téléphone pour confirmer les détails de votre commande et organiser la livraison.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}