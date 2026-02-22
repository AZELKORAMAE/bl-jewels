'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/* ── Tokens ──────────────────────────────────────────────────────────── */
const GOLD = '#B8902A';
const GOLD_BRIGHT = '#D4A93A';
const GOLD_BORDER = 'rgba(184,144,42,0.22)';
const GOLD_LIGHT = 'rgba(184,144,42,0.07)';
const PAGE_BG = '#FDFBF6';
const CARD_BG = '#FFFFFF';
const CARD_BG2 = '#FAF7F0';
const TEXT_MAIN = '#1A1508';
const TEXT_MUTED = 'rgba(26,21,8,0.42)';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusE, setFocusE] = useState(false);
    const [focusP, setFocusP] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await signIn('credentials', { email, password, redirect: false });
            if (result?.error) setError('Identifiants invalides');
            else router.push('/admin');
        } catch {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const fieldStyle = (focus: boolean): React.CSSProperties => ({
        width: '100%', boxSizing: 'border-box' as const,
        background: focus ? '#fff' : CARD_BG2,
        border: `1px solid ${focus ? GOLD : GOLD_BORDER}`,
        borderRadius: 10, padding: '13px 16px',
        color: TEXT_MAIN, fontSize: 14,
        fontFamily: "'Montserrat',sans-serif", fontWeight: 300,
        letterSpacing: '0.03em', outline: 'none',
        transition: 'all 0.22s',
        boxShadow: focus ? `0 0 0 3px rgba(184,144,42,0.10)` : 'none',
    });

    return (
        <div style={{
            minHeight: '100vh',
            background: PAGE_BG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            /* Subtle dot pattern */
            backgroundImage: `radial-gradient(rgba(184,144,42,0.10) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
        }}>

            {/* Card */}
            <div style={{
                width: '100%', maxWidth: 420,
                background: CARD_BG,
                border: `1px solid ${GOLD_BORDER}`,
                borderRadius: 20,
                boxShadow: `
                    0 0 0 1px rgba(184,144,42,0.06),
                    0 8px 40px rgba(184,144,42,0.12),
                    0 1px 0 rgba(255,255,255,0.95) inset
                `,
                overflow: 'hidden',
            }}>

                {/* Gold accent bar on top */}
                <div style={{
                    height: 3,
                    background: `linear-gradient(90deg, transparent, ${GOLD_BRIGHT}, ${GOLD}, transparent)`,
                }} />

                {/* Header */}
                <div style={{ textAlign: 'center', padding: '40px 36px 28px' }}>
                    {/* Logo mark */}
                    <div style={{
                        width: 56, height: 56,
                        borderRadius: '50%',
                        background: GOLD_LIGHT,
                        border: `1px solid ${GOLD_BORDER}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        fontSize: 22,
                        boxShadow: `0 2px 12px rgba(184,144,42,0.14)`,
                    }}>
                        ✦
                    </div>

                    <p style={{
                        margin: '0 0 10px',
                        fontSize: 11, letterSpacing: '0.32em',
                        color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
                    }}>
                        BL JEWELS
                    </p>
                    <h1 style={{
                        margin: '0 0 8px',
                        fontSize: 26, fontWeight: 700,
                        letterSpacing: '0.05em', color: TEXT_MAIN,
                        fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
                    }}>
                        Accès Administration
                    </h1>
                    <p style={{
                        margin: 0, fontSize: 12,
                        color: TEXT_MUTED,
                        fontFamily: "'Montserrat',sans-serif", fontWeight: 300,
                        letterSpacing: '0.04em',
                    }}>
                        Gestion du store privé
                    </p>

                    {/* Gold divider */}
                    <div style={{
                        width: 44, height: 1, margin: '20px auto 0',
                        background: `linear-gradient(90deg,transparent,${GOLD},transparent)`,
                    }} />
                </div>

                {/* Form */}
                <div style={{ padding: '0 36px 36px' }}>
                    <form onSubmit={handleSubmit}>

                        {/* Error */}
                        {error && (
                            <div style={{
                                marginBottom: 20,
                                background: 'rgba(200,50,50,0.06)',
                                border: '1px solid rgba(200,50,50,0.18)',
                                borderRadius: 10, padding: '12px 16px',
                                textAlign: 'center',
                                fontSize: 12, color: 'rgba(180,40,40,0.85)',
                                fontFamily: "'Montserrat',sans-serif", fontWeight: 500,
                                letterSpacing: '0.04em',
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div style={{ marginBottom: 18 }}>
                            <label style={{
                                display: 'block', marginBottom: 8,
                                fontSize: 11, letterSpacing: '0.25em',
                                color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
                            }}>
                                EMAIL
                            </label>
                            <input
                                type="email" required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onFocus={() => setFocusE(true)}
                                onBlur={() => setFocusE(false)}
                                placeholder="mon-store@luxe.com"
                                style={fieldStyle(focusE)}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 28 }}>
                            <label style={{
                                display: 'block', marginBottom: 8,
                                fontSize: 11, letterSpacing: '0.25em',
                                color: GOLD, fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
                            }}>
                                MOT DE PASSE
                            </label>
                            <input
                                type="password" required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onFocus={() => setFocusP(true)}
                                onBlur={() => setFocusP(false)}
                                placeholder="••••••••"
                                style={fieldStyle(focusP)}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px 0',
                                borderRadius: 10, border: 'none',
                                background: loading
                                    ? 'rgba(184,144,42,0.30)'
                                    : `linear-gradient(135deg,${GOLD_BRIGHT} 0%,${GOLD} 55%,#9E7820 100%)`,
                                color: loading ? 'rgba(255,255,255,0.5)' : '#fff',
                                fontSize: 12, fontWeight: 700,
                                letterSpacing: '0.25em',
                                fontFamily: "'Montserrat',sans-serif",
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: loading ? 'none'
                                    : `0 4px 20px rgba(184,144,42,0.30), 0 1px 0 rgba(255,255,255,0.20) inset`,
                                transition: 'transform 0.15s, box-shadow 0.15s',
                            }}
                            onMouseEnter={e => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = `0 6px 28px rgba(184,144,42,0.40), 0 1px 0 rgba(255,255,255,0.20) inset`;
                                }
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = `0 4px 20px rgba(184,144,42,0.30), 0 1px 0 rgba(255,255,255,0.20) inset`;
                            }}
                        >
                            {loading ? 'CONNEXION…' : 'SE CONNECTER'}
                        </button>

                        {/* Forgot password */}
                        <div style={{ textAlign: 'center', marginTop: 18 }}>
                            <button
                                type="button"
                                onClick={() => alert('Veuillez contacter le support à azelkoramae@gmail.com pour réinitialiser votre accès.')}
                                style={{
                                    background: 'none', border: 'none',
                                    cursor: 'pointer', padding: 0,
                                    fontSize: 11, letterSpacing: '0.10em',
                                    color: TEXT_MUTED,
                                    fontFamily: "'Montserrat',sans-serif",
                                    fontWeight: 400,
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                                onMouseLeave={e => (e.currentTarget.style.color = TEXT_MUTED)}
                            >
                                Mot de passe oublié ?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}