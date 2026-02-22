'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
const BORDER_SOFT = 'rgba(26,21,8,0.07)';

interface Collection { _id: string; name: string; slug: string }
interface Product {
    _id: string; name: string; description: string;
    price: number; quantity: number; slug: string;
    collectionId: { name: string };
}

/* ── Shared card shell ───────────────────────────────────────────────── */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{
            background: CARD_BG,
            border: `1px solid ${GOLD_BORDER}`,
            borderRadius: 16,
            boxShadow: `0 4px 24px rgba(184,144,42,0.08), 0 1px 3px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.9) inset`,
            ...style,
        }}>
            {children}
        </div>
    );
}

/* ── Label ───────────────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
    return (
        <label style={{
            display: 'block', marginBottom: 8,
            fontSize: 11, letterSpacing: '0.25em',
            color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
        }}>{children}</label>
    );
}

/* ── Focusable input ─────────────────────────────────────────────────── */
function FInput({ id, value, onChange, placeholder, required, type = 'text', min, step }: {
    id?: string; value: string; onChange: (v: string) => void;
    placeholder?: string; required?: boolean; type?: string;
    min?: string; step?: string;
}) {
    const [f, setF] = useState(false);
    return (
        <input id={id} type={type} required={required} value={value} min={min} step={step}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setF(true)} onBlur={() => setF(false)}
            style={{
                width: '100%', boxSizing: 'border-box' as const,
                background: f ? '#fff' : CARD_BG2,
                border: `1px solid ${f ? GOLD : GOLD_BORDER}`,
                borderRadius: 10, padding: '12px 14px',
                color: TEXT_MAIN, fontSize: 13,
                fontFamily: "'Montserrat',sans-serif", fontWeight: 300,
                letterSpacing: '0.03em', outline: 'none',
                boxShadow: f ? `0 0 0 3px rgba(184,144,42,0.10)` : 'none',
                transition: 'all 0.22s',
            }}
        />
    );
}

function FTextarea({ id, value, onChange, placeholder, required, rows = 4 }: {
    id?: string; value: string; onChange: (v: string) => void;
    placeholder?: string; required?: boolean; rows?: number;
}) {
    const [f, setF] = useState(false);
    return (
        <textarea id={id} required={required} rows={rows} value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setF(true)} onBlur={() => setF(false)}
            style={{
                width: '100%', boxSizing: 'border-box' as const, resize: 'none' as const,
                background: f ? '#fff' : CARD_BG2,
                border: `1px solid ${f ? GOLD : GOLD_BORDER}`,
                borderRadius: 10, padding: '12px 14px', lineHeight: 1.7,
                color: TEXT_MAIN, fontSize: 13,
                fontFamily: "'Montserrat',sans-serif", fontWeight: 300,
                letterSpacing: '0.03em', outline: 'none',
                boxShadow: f ? `0 0 0 3px rgba(184,144,42,0.10)` : 'none',
                transition: 'all 0.22s',
            }}
        />
    );
}

function FSelect({ id, value, onChange, required, children }: {
    id?: string; value: string; onChange: (v: string) => void;
    required?: boolean; children: React.ReactNode;
}) {
    const [f, setF] = useState(false);
    return (
        <select id={id} required={required} value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setF(true)} onBlur={() => setF(false)}
            style={{
                width: '100%', boxSizing: 'border-box' as const,
                background: f ? '#fff' : CARD_BG2,
                border: `1px solid ${f ? GOLD : GOLD_BORDER}`,
                borderRadius: 10, padding: '12px 14px',
                color: value ? TEXT_MAIN : TEXT_MUTED, fontSize: 13,
                fontFamily: "'Montserrat',sans-serif", fontWeight: 300,
                outline: 'none', cursor: 'pointer',
                boxShadow: f ? `0 0 0 3px rgba(184,144,42,0.10)` : 'none',
                transition: 'all 0.22s',
            }}
        >
            {children}
        </select>
    );
}

/* ── Skeleton ────────────────────────────────────────────────────────── */
function SkeletonRow() {
    return (
        <div style={{
            background: CARD_BG, borderRadius: 14,
            border: `1px solid rgba(184,144,42,0.10)`,
            padding: '18px 22px',
            display: 'flex', alignItems: 'center', gap: 18,
        }}>
            <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
            <div style={{ width: 64, height: 64, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(90deg,#f0ebe0 25%,#faf7f0 50%,#f0ebe0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
            <div style={{ flex: 1 }}>
                {[{ w: '40%', h: 14, mb: 10 }, { w: '25%', h: 11, mb: 8 }, { w: '20%', h: 11, mb: 0 }].map((s, i) => (
                    <div key={i} style={{ width: s.w, height: s.h, borderRadius: 5, marginBottom: s.mb, background: 'linear-gradient(90deg,#f0ebe0 25%,#faf7f0 50%,#f0ebe0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                {[60, 80, 90].map((w, i) => (
                    <div key={i} style={{ width: w, height: 34, borderRadius: 8, background: 'linear-gradient(90deg,#f0ebe0 25%,#faf7f0 50%,#f0ebe0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                ))}
            </div>
        </div>
    );
}

/* ── Image slot ──────────────────────────────────────────────────────── */
function ImageSlot({ img, index, uploading, onUpload, onRemove, onUrlChange }: {
    img: string; index: number; uploading: number | null;
    onUpload: (i: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (i: number) => void;
    onUrlChange: (i: number, v: string) => void;
}) {
    const isUp = uploading === index;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
                position: 'relative', borderRadius: 12, overflow: 'hidden',
                border: `${img ? '1px solid' : '2px dashed'} ${img ? GOLD_BORDER : 'rgba(184,144,42,0.25)'}`,
                aspectRatio: '1/1', background: img ? 'transparent' : GOLD_LIGHT,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.2s',
            }}
                onMouseEnter={e => { if (!img) (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
                onMouseLeave={e => { if (!img) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,144,42,0.25)'; }}
            >
                {img ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`img-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: 'opacity 0.22s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                        >
                            <button type="button" onClick={() => onRemove(index)}
                                style={{
                                    background: '#fff', border: 'none', borderRadius: 20,
                                    padding: '7px 16px', cursor: 'pointer',
                                    color: 'rgba(200,50,50,0.85)', fontSize: 10,
                                    fontWeight: 700, letterSpacing: '0.15em',
                                    fontFamily: "'Montserrat',sans-serif",
                                }}>
                                SUPPRIMER
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <input type="file" accept="image/*"
                            onChange={e => onUpload(index, e)}
                            disabled={uploading !== null}
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: '#fff', border: `1px solid ${GOLD_BORDER}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 8, fontSize: 18,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}>
                            {isUp ? '✨' : '+'}
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif" }}>
                            {isUp ? 'ENVOI…' : 'AJOUTER'}
                        </span>
                    </>
                )}
            </div>
            {/* URL fallback */}
            <input type="url" value={img}
                onChange={e => onUrlChange(index, e.target.value)}
                placeholder="ou URL…"
                style={{
                    width: '100%', boxSizing: 'border-box' as const,
                    background: CARD_BG2, border: `1px solid rgba(184,144,42,0.14)`,
                    borderRadius: 7, padding: '6px 10px',
                    fontSize: 10, fontStyle: 'italic',
                    color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif",
                    outline: 'none',
                }}
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [originalSlug, setOriginalSlug] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', quantity: '',
        collectionId: '', images: [''],
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [pr, cr] = await Promise.all([fetch('/api/products'), fetch('/api/collections')]);
            const [pd, cd] = await Promise.all([pr.json(), cr.json()]);
            if (pd.success) setProducts(pd.data);
            if (cd.success) setCollections(cd.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleEdit = (p: Product) => {
        setFormData({
            name: p.name, description: p.description,
            price: p.price.toString(), quantity: p.quantity.toString(),
            collectionId: (p.collectionId as any)._id || p.collectionId,
            images: (p as any).images?.length > 0 ? (p as any).images : [''],
        });
        setEditingId(p._id); setOriginalSlug(p.slug);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setFormData({ name: '', description: '', price: '', quantity: '', collectionId: '', images: [''] });
        setEditingId(null); setOriginalSlug(null); setShowForm(false);
    };

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(index);
        try {
            const compressed = await new Promise<File>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = ev => {
                    const img = new Image();
                    img.src = ev.target?.result as string;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let { width, height } = img;
                        const max = 1024;
                        if (width > height && width > max) { height *= max / width; width = max; }
                        else if (height > max) { width *= max / height; height = max; }
                        canvas.width = width; canvas.height = height;
                        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                        canvas.toBlob(b => resolve(b ? new File([b], file.name, { type: 'image/jpeg' }) : file), 'image/jpeg', 0.80);
                    };
                };
            });
            const fd = new FormData();
            fd.append('file', compressed);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.success) {
                const imgs = [...formData.images];
                imgs[index] = data.url;
                setFormData(p => ({ ...p, images: imgs }));
            } else alert(`Erreur d'upload: ${data.error}`);
        } catch { alert("Erreur lors du traitement de l'image"); }
        finally { setUploading(null); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId && originalSlug ? `/api/products/${originalSlug}` : '/api/products';
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity), images: formData.images.filter(i => i.trim()) }),
            });
            const data = await res.json();
            if (data.success) { handleCancel(); fetchData(); }
            else alert(`Erreur: ${data.error}`);
        } catch (err) { alert('Erreur: ' + (err instanceof Error ? err.message : String(err))); }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Supprimer ce produit ?')) return;
        try {
            const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) fetchData();
            else alert(`Erreur: ${data.error}`);
        } catch { alert('Erreur lors de la suppression'); }
    };

    const fmtPrice = (p: number) => `${p.toLocaleString('fr-FR')} DH`;

    return (
        <div style={{ minHeight: '100vh', background: PAGE_BG, paddingTop: 80, paddingBottom: 80 }}>
            <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
                    <div>
                        <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.32em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                            ADMINISTRATION
                        </p>
                        <h1 style={{ margin: 0, fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, letterSpacing: '0.05em', color: TEXT_MAIN, fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif" }}>
                            Gestion des Produits
                        </h1>
                        <p style={{ margin: '8px 0 0', fontSize: 12, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", fontWeight: 300 }}>
                            {products.length} produit{products.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button
                        onClick={showForm ? handleCancel : () => setShowForm(true)}
                        disabled={collections.length === 0 && !showForm}
                        style={{
                            padding: '12px 24px', borderRadius: 10, cursor: (collections.length === 0 && !showForm) ? 'not-allowed' : 'pointer',
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.20em',
                            fontFamily: "'Montserrat',sans-serif",
                            background: showForm ? 'transparent' : `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`,
                            color: showForm ? TEXT_MUTED : '#fff',
                            border: showForm ? `1px solid ${GOLD_BORDER}` as any : 'none',
                            boxShadow: showForm ? 'none' : `0 4px 16px rgba(184,144,42,0.28)`,
                            opacity: (collections.length === 0 && !showForm) ? 0.4 : 1,
                            transition: 'all 0.2s',
                        }}
                    >
                        {showForm ? '✕ ANNULER' : '+ NOUVEAU PRODUIT'}
                    </button>
                </div>

                <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${GOLD_BORDER},transparent)`, marginBottom: 32 }} />

                {/* ── No collection warning ── */}
                {collections.length === 0 && (
                    <div style={{
                        background: GOLD_LIGHT, border: `1px solid ${GOLD_BORDER}`,
                        borderRadius: 12, padding: '16px 20px', marginBottom: 28,
                        display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                        <span style={{ fontSize: 18 }}>💡</span>
                        <p style={{ margin: 0, fontSize: 12, color: TEXT_MAIN, fontFamily: "'Montserrat',sans-serif", fontWeight: 300, lineHeight: 1.7 }}>
                            Vous devez d'abord créer une collection.{' '}
                            <Link href="/admin/collections" style={{ color: GOLD, fontWeight: 600, textDecoration: 'none' }}>
                                Créer une collection →
                            </Link>
                        </p>
                    </div>
                )}

                {/* ── Form ── */}
                {showForm && (
                    <Card style={{ padding: '32px 28px', marginBottom: 36 }}>
                        <p style={{ margin: '0 0 6px', fontSize: 11, letterSpacing: '0.28em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                            {editingId ? 'MODIFIER' : 'CRÉER'}
                        </p>
                        <h2 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 700, color: TEXT_MAIN, fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.04em' }}>
                            {editingId ? 'Modifier le Produit' : 'Nouveau Produit'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28 }}>

                                {/* Left */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <Label>Nom du bijou *</Label>
                                        <FInput id="name" value={formData.name} onChange={v => setFormData(p => ({ ...p, name: v }))} placeholder="Bague Solitaire Diamant" required />
                                    </div>
                                    <div>
                                        <Label>Collection *</Label>
                                        <FSelect id="collectionId" value={formData.collectionId} onChange={v => setFormData(p => ({ ...p, collectionId: v }))} required>
                                            <option value="">Sélectionner une collection…</option>
                                            {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                        </FSelect>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                        <div>
                                            <Label>Prix (MAD) *</Label>
                                            <FInput id="price" type="number" value={formData.price} onChange={v => setFormData(p => ({ ...p, price: v }))} placeholder="1999" min="0" step="0.01" required />
                                        </div>
                                        <div>
                                            <Label>Stock *</Label>
                                            <FInput id="quantity" type="number" value={formData.quantity} onChange={v => setFormData(p => ({ ...p, quantity: v }))} placeholder="5" min="0" required />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Description détaillée *</Label>
                                        <FTextarea id="description" value={formData.description} onChange={v => setFormData(p => ({ ...p, description: v }))} placeholder="Carats, pureté, métal…" required rows={4} />
                                    </div>
                                </div>

                                {/* Right: images */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                        <Label>📸 Images du Produit</Label>
                                        <span style={{ fontSize: 9, color: TEXT_MUTED, background: GOLD_LIGHT, border: `1px solid ${GOLD_BORDER}`, borderRadius: 20, padding: '2px 10px', fontFamily: "'Montserrat',sans-serif", fontWeight: 600, letterSpacing: '0.12em' }}>
                                            MAX 6
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                                        {formData.images.map((img, i) => (
                                            <ImageSlot key={i} img={img} index={i} uploading={uploading}
                                                onUpload={handleImageUpload}
                                                onRemove={i => {
                                                    const imgs = [...formData.images];
                                                    imgs.splice(i, 1);
                                                    if (!imgs.length) imgs.push('');
                                                    setFormData(p => ({ ...p, images: imgs }));
                                                }}
                                                onUrlChange={(i, v) => {
                                                    const imgs = [...formData.images];
                                                    imgs[i] = v;
                                                    setFormData(p => ({ ...p, images: imgs }));
                                                }}
                                            />
                                        ))}
                                        {formData.images.length < 6 && (
                                            <button type="button"
                                                onClick={() => setFormData(p => ({ ...p, images: [...p.images, ''] }))}
                                                style={{
                                                    borderRadius: 12, aspectRatio: '1/1',
                                                    border: `2px dashed rgba(184,144,42,0.20)`,
                                                    background: 'transparent',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer', color: GOLD, gap: 6,
                                                    transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD_LIGHT; (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,144,42,0.20)'; }}
                                            >
                                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: GOLD_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>+</div>
                                                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', fontFamily: "'Montserrat',sans-serif" }}>AJOUTER</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28, paddingTop: 24, borderTop: `1px solid ${GOLD_BORDER}` }}>
                                <button type="submit" disabled={uploading !== null}
                                    style={{
                                        padding: '13px 32px', borderRadius: 10, border: 'none',
                                        background: uploading !== null ? 'rgba(184,144,42,0.30)' : `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`,
                                        color: uploading !== null ? 'rgba(255,255,255,0.5)' : '#fff',
                                        fontSize: 11, fontWeight: 700, letterSpacing: '0.22em',
                                        fontFamily: "'Montserrat',sans-serif",
                                        cursor: uploading !== null ? 'not-allowed' : 'pointer',
                                        boxShadow: uploading !== null ? 'none' : `0 4px 16px rgba(184,144,42,0.28)`,
                                        transition: 'all 0.2s',
                                    }}>
                                    {editingId ? 'ENREGISTRER LES MODIFICATIONS' : 'CRÉER LE PRODUIT'}
                                </button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* ── Products list ── */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
                    </div>
                ) : products.length === 0 ? (
                    <Card style={{ padding: '60px 32px', textAlign: 'center' }}>
                        <div style={{ fontSize: 52, opacity: 0.15, marginBottom: 20 }}>💍</div>
                        <p style={{ margin: '0 0 6px', fontSize: 11, letterSpacing: '0.28em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>CATALOGUE VIDE</p>
                        <p style={{ margin: '0 0 28px', fontSize: 15, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", fontWeight: 300 }}>Commencez par ajouter vos premiers bijoux</p>
                        {collections.length > 0 && (
                            <button onClick={() => setShowForm(true)}
                                style={{
                                    padding: '13px 28px', borderRadius: 10, border: 'none',
                                    background: `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`,
                                    color: '#fff', fontSize: 11, fontWeight: 700,
                                    letterSpacing: '0.20em', fontFamily: "'Montserrat',sans-serif",
                                    cursor: 'pointer', boxShadow: `0 4px 16px rgba(184,144,42,0.28)`,
                                }}>
                                + AJOUTER UN PRODUIT
                            </button>
                        )}
                    </Card>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {products.map(p => {
                            const inStock = p.quantity > 0;
                            return (
                                <div key={p._id} style={{
                                    background: CARD_BG,
                                    border: `1px solid rgba(184,144,42,0.14)`,
                                    borderRadius: 14,
                                    boxShadow: `0 2px 12px rgba(184,144,42,0.07)`,
                                    padding: '16px 20px',
                                    display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
                                    transition: 'box-shadow 0.2s',
                                }}
                                    onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 6px 24px rgba(184,144,42,0.13)`)}
                                    onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 2px 12px rgba(184,144,42,0.07)`)}
                                >
                                    {/* Thumbnail */}
                                    <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: `1px solid ${GOLD_BORDER}`, background: CARD_BG2 }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={(p as any).images?.[0] || '/placeholder.jpg'} alt={p.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: TEXT_MAIN, fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {p.name}
                                        </h3>
                                        <p style={{ margin: '0 0 8px', fontSize: 10, color: TEXT_MUTED, letterSpacing: '0.18em', fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                                            {p.collectionId?.name?.toUpperCase() || 'SANS COLLECTION'}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: GOLD, fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.03em' }}>
                                                {fmtPrice(p.price)}
                                            </span>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 20,
                                                fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                                                fontFamily: "'Montserrat',sans-serif",
                                                background: inStock ? 'rgba(34,134,58,0.09)' : 'rgba(200,50,50,0.08)',
                                                color: inStock ? '#1a7f37' : 'rgba(180,40,40,0.80)',
                                                border: `1px solid ${inStock ? 'rgba(34,134,58,0.20)' : 'rgba(200,50,50,0.15)'}`,
                                            }}>
                                                {inStock ? `EN STOCK · ${p.quantity}` : 'RUPTURE'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <Link href={`/products/${p.slug}`} target="_blank"
                                            style={{
                                                padding: '9px 16px', borderRadius: 8,
                                                border: `1px solid ${GOLD_BORDER}`,
                                                color: GOLD, fontSize: 10, fontWeight: 600,
                                                letterSpacing: '0.12em', textDecoration: 'none',
                                                fontFamily: "'Montserrat',sans-serif",
                                                background: 'transparent', transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = GOLD_LIGHT)}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >VOIR</Link>
                                        <button onClick={() => handleEdit(p)}
                                            style={{
                                                padding: '9px 16px', borderRadius: 8, border: 'none',
                                                background: `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`,
                                                color: '#fff', fontSize: 10, fontWeight: 600,
                                                letterSpacing: '0.12em', fontFamily: "'Montserrat',sans-serif",
                                                cursor: 'pointer', boxShadow: `0 2px 10px rgba(184,144,42,0.22)`,
                                            }}>MODIFIER</button>
                                        <button onClick={() => handleDelete(p.slug)}
                                            style={{
                                                padding: '9px 16px', borderRadius: 8,
                                                border: `1px solid rgba(200,50,50,0.22)`,
                                                background: 'transparent',
                                                color: 'rgba(200,50,50,0.60)', fontSize: 10, fontWeight: 600,
                                                letterSpacing: '0.12em', fontFamily: "'Montserrat',sans-serif",
                                                cursor: 'pointer', transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,50,50,0.06)'; e.currentTarget.style.color = 'rgba(200,50,50,0.90)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(200,50,50,0.60)'; }}
                                        >SUPPRIMER</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Back ── */}
                <div style={{ textAlign: 'center', marginTop: 52 }}>
                    <Link href="/admin" style={{ fontSize: 11, letterSpacing: '0.22em', color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                        onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUTED)}
                    >← RETOUR À L'ADMIN</Link>
                </div>
            </div>
        </div>
    );
}