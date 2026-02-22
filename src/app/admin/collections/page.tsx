'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ── Design tokens ───────────────────────────────────────────────────── */
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

interface Collection {
    _id: string;
    name: string;
    description: string;
    slug: string;
    image?: string;
}

/* ── Card ─────────────────────────────────────────────────────────────── */
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

/* ── Field label ─────────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
    return (
        <label style={{
            display: 'block', marginBottom: 8,
            fontSize: 11, letterSpacing: '0.25em',
            color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
        }}>
            {children}
        </label>
    );
}

/* ── Input styles ────────────────────────────────────────────────────── */
const inputStyle = (focus: boolean): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box' as const,
    background: focus ? '#fff' : CARD_BG2,
    border: `1px solid ${focus ? GOLD : GOLD_BORDER}`,
    borderRadius: 10, padding: '12px 14px',
    color: TEXT_MAIN, fontSize: 13,
    fontFamily: "'Montserrat',sans-serif", fontWeight: 300,
    letterSpacing: '0.03em', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    boxShadow: focus ? `0 0 0 3px rgba(184,144,42,0.10)` : 'none',
    resize: 'none' as const,
});

/* ── Focusable input ─────────────────────────────────────────────────── */
function FInput({ id, value, onChange, placeholder, required, type = 'text' }: {
    id: string; value: string; onChange: (v: string) => void;
    placeholder?: string; required?: boolean; type?: string;
}) {
    const [f, setF] = useState(false);
    return (
        <input id={id} type={type} required={required} value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setF(true)} onBlur={() => setF(false)}
            style={inputStyle(f)} />
    );
}

function FTextarea({ id, value, onChange, placeholder, required, rows = 5 }: {
    id: string; value: string; onChange: (v: string) => void;
    placeholder?: string; required?: boolean; rows?: number;
}) {
    const [f, setF] = useState(false);
    return (
        <textarea id={id} required={required} rows={rows} value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setF(true)} onBlur={() => setF(false)}
            style={{ ...inputStyle(f), lineHeight: 1.7 }} />
    );
}

/* ── Collection card ─────────────────────────────────────────────────── */
function CollectionCard({ collection, onEdit, onDelete }: {
    collection: Collection;
    onEdit: (c: Collection) => void;
    onDelete: (slug: string) => void;
}) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: CARD_BG,
                border: `1px solid ${hov ? GOLD_BORDER : 'rgba(184,144,42,0.14)'}`,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: hov
                    ? `0 8px 32px rgba(184,144,42,0.13), 0 1px 3px rgba(0,0,0,0.05)`
                    : `0 2px 12px rgba(184,144,42,0.07), 0 1px 2px rgba(0,0,0,0.03)`,
                transition: 'all 0.25s',
            }}
        >
            {/* Image */}
            {collection.image && (
                <div style={{ height: 160, overflow: 'hidden', background: CARD_BG2 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={collection.image} alt={collection.name}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transform: hov ? 'scale(1.04)' : 'scale(1)',
                            transition: 'transform 0.5s ease'
                        }} />
                </div>
            )}

            <div style={{ padding: '20px 20px 18px' }}>
                {/* Title */}
                <h3 style={{
                    margin: '0 0 6px',
                    fontSize: 15, fontWeight: 700,
                    color: TEXT_MAIN,
                    fontFamily: "'Cormorant Garamond',Georgia,serif",
                    letterSpacing: '0.04em',
                }}>
                    {collection.name}
                </h3>
                {/* Desc */}
                <p style={{
                    margin: '0 0 18px', fontSize: 12,
                    color: TEXT_MUTED,
                    fontFamily: "'Montserrat',sans-serif", fontWeight: 300,
                    lineHeight: 1.65,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    overflow: 'hidden',
                }}>
                    {collection.description}
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: `linear-gradient(90deg,${GOLD_BORDER},transparent)`, marginBottom: 14 }} />

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/collections/${collection.slug}`} target="_blank"
                        style={{
                            flex: 1, textAlign: 'center', padding: '9px 0',
                            borderRadius: 8, border: `1px solid ${GOLD_BORDER}`,
                            color: GOLD, fontSize: 11, fontWeight: 600,
                            letterSpacing: '0.12em',
                            fontFamily: "'Montserrat',sans-serif",
                            textDecoration: 'none',
                            background: 'transparent',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = GOLD_LIGHT)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        VOIR
                    </Link>
                    <button onClick={() => onEdit(collection)}
                        style={{
                            flex: 1, padding: '9px 0',
                            borderRadius: 8, border: 'none',
                            background: `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`,
                            color: '#fff', fontSize: 11, fontWeight: 600,
                            letterSpacing: '0.12em',
                            fontFamily: "'Montserrat',sans-serif",
                            cursor: 'pointer',
                            boxShadow: `0 2px 10px rgba(184,144,42,0.25)`,
                        }}>
                        MODIFIER
                    </button>
                    <button onClick={() => onDelete(collection.slug)}
                        style={{
                            flex: 1, padding: '9px 0',
                            borderRadius: 8,
                            border: `1px solid rgba(200,50,50,0.25)`,
                            background: 'transparent',
                            color: 'rgba(200,50,50,0.65)',
                            fontSize: 11, fontWeight: 600,
                            letterSpacing: '0.12em',
                            fontFamily: "'Montserrat',sans-serif",
                            cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(200,50,50,0.06)';
                            e.currentTarget.style.color = 'rgba(200,50,50,0.90)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(200,50,50,0.65)';
                        }}
                    >
                        SUPPRIMER
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Skeleton card ────────────────────────────────────────────────────── */
function SkeletonCard() {
    return (
        <div style={{
            background: CARD_BG, borderRadius: 16,
            border: `1px solid rgba(184,144,42,0.10)`,
            padding: 24, overflow: 'hidden',
        }}>
            <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
            {[{ w: '70%', h: 18, mb: 14 }, { w: '100%', h: 13, mb: 8 }, { w: '60%', h: 13, mb: 20 }].map((s, i) => (
                <div key={i} style={{
                    width: s.w, height: s.h, borderRadius: 6, marginBottom: s.mb,
                    background: 'linear-gradient(90deg,#f0ebe0 25%,#faf7f0 50%,#f0ebe0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.4s infinite',
                }} />
            ))}
            <div style={{
                height: 36, borderRadius: 8,
                background: 'linear-gradient(90deg,#f0ebe0 25%,#faf7f0 50%,#f0ebe0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s infinite',
            }} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function AdminCollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [originalSlug, setOriginalSlug] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', image: '' });

    useEffect(() => { fetchCollections(); }, []);

    const fetchCollections = async () => {
        try {
            const res = await fetch('/api/collections');
            const data = await res.json();
            if (data.success) setCollections(data.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleEdit = (c: Collection) => {
        setFormData({ name: c.name, description: c.description, image: c.image || '' });
        setEditingId(c._id); setOriginalSlug(c.slug);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setFormData({ name: '', description: '', image: '' });
        setEditingId(null); setOriginalSlug(null); setShowForm(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const compressedFile = await new Promise<File>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target?.result as string;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let { width, height } = img;
                        const maxSide = 1280;
                        if (width > height && width > maxSide) { height *= maxSide / width; width = maxSide; }
                        else if (height > maxSide) { width *= maxSide / height; height = maxSide; }
                        canvas.width = width; canvas.height = height;
                        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                        canvas.toBlob(blob => resolve(blob ? new File([blob], file.name, { type: 'image/jpeg' }) : file), 'image/jpeg', 0.85);
                    };
                };
            });
            const fd = new FormData();
            fd.append('file', compressedFile);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.success) setFormData(p => ({ ...p, image: data.url }));
            else alert(`Erreur d'upload: ${data.error}`);
        } catch { alert("Erreur lors du traitement de l'image"); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId && originalSlug ? `/api/collections/${originalSlug}` : '/api/collections';
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const data = await res.json();
            if (data.success) { alert(editingId ? 'Collection modifiée!' : 'Collection créée!'); handleCancel(); fetchCollections(); }
            else alert(`Erreur: ${data.error}`);
        } catch (err) { alert('Erreur: ' + (err instanceof Error ? err.message : String(err))); }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Supprimer cette collection ?')) return;
        try {
            const res = await fetch(`/api/collections/${slug}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) { fetchCollections(); }
            else alert(`Erreur: ${data.error}`);
        } catch { alert('Erreur lors de la suppression'); }
    };

    return (
        <div style={{ minHeight: '100vh', background: PAGE_BG, paddingTop: 80, paddingBottom: 80 }}>
            <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>

                {/* ── Page header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 44 }}>
                    <div>
                        <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.32em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                            ADMINISTRATION
                        </p>
                        <h1 style={{ margin: 0, fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, letterSpacing: '0.05em', color: TEXT_MAIN, fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif" }}>
                            Gestion des Collections
                        </h1>
                        <p style={{ margin: '8px 0 0', fontSize: 12, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", fontWeight: 300 }}>
                            {collections.length} collection{collections.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <button onClick={showForm ? handleCancel : () => setShowForm(true)}
                        style={{
                            padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.20em',
                            fontFamily: "'Montserrat',sans-serif",
                            background: showForm ? 'transparent' : `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`,
                            color: showForm ? TEXT_MUTED : '#fff',
                            border: showForm ? `1px solid ${GOLD_BORDER}` : 'none',
                            boxShadow: showForm ? 'none' : `0 4px 16px rgba(184,144,42,0.28)`,
                            transition: 'all 0.2s',
                        } as React.CSSProperties}
                    >
                        {showForm ? '✕ ANNULER' : '+ NOUVELLE COLLECTION'}
                    </button>
                </div>

                {/* ── Gold rule ── */}
                <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${GOLD_BORDER},transparent)`, marginBottom: 36 }} />

                {/* ── Create / Edit form ── */}
                {showForm && (
                    <Card style={{ padding: '32px 28px', marginBottom: 40 }}>
                        <p style={{ margin: '0 0 6px', fontSize: 11, letterSpacing: '0.28em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                            {editingId ? 'MODIFIER' : 'CRÉER'}
                        </p>
                        <h2 style={{ margin: '0 0 28px', fontSize: 22, fontWeight: 700, color: TEXT_MAIN, fontFamily: "'Cormorant Garamond',Georgia,serif", letterSpacing: '0.04em' }}>
                            {editingId ? 'Modifier la Collection' : 'Nouvelle Collection'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28 }}>

                                {/* Left: text fields */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                    <div>
                                        <Label>Nom *</Label>
                                        <FInput id="name" value={formData.name} onChange={v => setFormData(p => ({ ...p, name: v }))} placeholder="Bagues de Fiançailles" required />
                                    </div>
                                    <div>
                                        <Label>Description *</Label>
                                        <FTextarea id="description" value={formData.description} onChange={v => setFormData(p => ({ ...p, description: v }))} placeholder="Description de la collection..." required rows={6} />
                                    </div>
                                </div>

                                {/* Right: image upload */}
                                <div>
                                    <Label>📸 Image de la Collection</Label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                                        {formData.image ? (
                                            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${GOLD_BORDER}`, aspectRatio: '16/9', background: CARD_BG2 }}
                                                onMouseEnter={e => { (e.currentTarget.querySelector('.img-overlay') as HTMLElement)!.style.opacity = '1'; }}
                                                onMouseLeave={e => { (e.currentTarget.querySelector('.img-overlay') as HTMLElement)!.style.opacity = '0'; }}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div className="img-overlay" style={{
                                                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    opacity: 0, transition: 'opacity 0.25s',
                                                }}>
                                                    <button type="button" onClick={() => setFormData(p => ({ ...p, image: '' }))}
                                                        style={{
                                                            background: '#fff', border: 'none', borderRadius: 20,
                                                            padding: '8px 20px', cursor: 'pointer',
                                                            color: 'rgba(200,50,50,0.85)', fontSize: 11, fontWeight: 700,
                                                            letterSpacing: '0.15em', fontFamily: "'Montserrat',sans-serif",
                                                        }}>
                                                        SUPPRIMER
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{
                                                border: `2px dashed ${GOLD_BORDER}`, borderRadius: 12,
                                                padding: '36px 20px', textAlign: 'center',
                                                background: GOLD_LIGHT, position: 'relative', cursor: 'pointer',
                                                transition: 'border-color 0.2s, background 0.2s',
                                            }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD_BORDER; }}
                                            >
                                                <input type="file" accept="image/*" onChange={handleImageUpload}
                                                    disabled={uploading}
                                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                                                <div style={{
                                                    width: 52, height: 52, borderRadius: '50%',
                                                    background: '#fff', border: `1px solid ${GOLD_BORDER}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    margin: '0 auto 14px', fontSize: 22,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                }}>
                                                    {uploading ? '✨' : '🖼️'}
                                                </div>
                                                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: TEXT_MAIN, fontFamily: "'Montserrat',sans-serif" }}>
                                                    {uploading ? 'UPLOAD EN COURS…' : 'AJOUTER UNE IMAGE'}
                                                </p>
                                                <p style={{ margin: 0, fontSize: 10, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", letterSpacing: '0.10em' }}>
                                                    PNG · JPG · WEBP
                                                </p>
                                            </div>
                                        )}

                                        {/* URL input */}
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>🔗</span>
                                            <input type="url" value={formData.image}
                                                onChange={e => setFormData(p => ({ ...p, image: e.target.value }))}
                                                placeholder="Ou collez une URL d'image…"
                                                style={{ ...inputStyle(false), paddingLeft: 36, fontSize: 12, fontStyle: 'italic' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28, paddingTop: 24, borderTop: `1px solid ${GOLD_BORDER}` }}>
                                <button type="submit" disabled={uploading}
                                    style={{
                                        padding: '13px 32px', borderRadius: 10, border: 'none',
                                        background: uploading ? 'rgba(184,144,42,0.30)' : `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`,
                                        color: uploading ? 'rgba(255,255,255,0.5)' : '#fff',
                                        fontSize: 11, fontWeight: 700, letterSpacing: '0.22em',
                                        fontFamily: "'Montserrat',sans-serif",
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        boxShadow: uploading ? 'none' : `0 4px 16px rgba(184,144,42,0.28)`,
                                        transition: 'all 0.2s',
                                    }}>
                                    {editingId ? 'ENREGISTRER LES MODIFICATIONS' : 'CRÉER LA COLLECTION'}
                                </button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* ── Collections list ── */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 20 }}>
                        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : collections.length === 0 ? (
                    <Card style={{ padding: '60px 32px', textAlign: 'center' }}>
                        <div style={{ fontSize: 52, opacity: 0.18, marginBottom: 20 }}>💎</div>
                        <p style={{ margin: '0 0 6px', fontSize: 11, letterSpacing: '0.28em', color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
                            AUCUNE COLLECTION
                        </p>
                        <p style={{ margin: '0 0 28px', fontSize: 15, color: TEXT_MUTED, fontFamily: "'Montserrat',sans-serif", fontWeight: 300 }}>
                            Commencez par créer votre première collection
                        </p>
                        <button onClick={() => setShowForm(true)}
                            style={{
                                padding: '13px 28px', borderRadius: 10, border: 'none',
                                background: `linear-gradient(135deg,${GOLD_BRIGHT},${GOLD})`,
                                color: '#fff', fontSize: 11, fontWeight: 700,
                                letterSpacing: '0.20em', fontFamily: "'Montserrat',sans-serif",
                                cursor: 'pointer', boxShadow: `0 4px 16px rgba(184,144,42,0.28)`,
                            }}>
                            + CRÉER UNE COLLECTION
                        </button>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 20 }}>
                        {collections.map(c => (
                            <CollectionCard key={c._id} collection={c} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                )}

                {/* ── Back ── */}
                <div style={{ textAlign: 'center', marginTop: 52 }}>
                    <Link href="/admin" style={{
                        fontSize: 11, letterSpacing: '0.22em', color: TEXT_MUTED,
                        fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
                        textDecoration: 'none', transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                        onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUTED)}
                    >
                        ← RETOUR À L'ADMIN
                    </Link>
                </div>

            </div>
        </div>
    );
}