'use client';

import { useState } from 'react';

const GOLD = '#C9A84C';

/* ── SVG Icons ─────────────────────────────────────────────────────────── */
const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ width: 20, height: 20 }}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
);

const TiktokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5
            2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01
            a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34
            6.34 6.34 0 0 0 6.33-6.34V8.87a8.18 8.18 0 0 0 4.78 1.52V6.95a4.85 4.85 0 0 1-1.01-.26z" />
    </svg>
);

const WhatsappIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
            -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475
            -.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
            .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207
            -.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
            -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2
            5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719
            2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004
            a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0
            1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825
            9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815
            0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305
            -1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821
            11.821 0 0 0-3.48-8.413z" />
    </svg>
);

/* ── Social button with hover state ────────────────────────────────────── */
function SocialButton({ href, label, children }: {
    href: string; label: string; children: React.ReactNode;
}) {
    const [hov, setHov] = useState(false);
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: 52, height: 52, borderRadius: '50%',
                border: `1px solid ${hov ? GOLD : 'rgba(201,168,76,0.30)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: hov ? GOLD : 'rgba(255,255,255,0.65)',
                background: hov ? 'rgba(201,168,76,0.07)' : 'transparent',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                flexShrink: 0,
            }}
        >
            {children}
        </a>
    );
}

/* ── Shared styles ──────────────────────────────────────────────────────── */
const label: React.CSSProperties = {
    letterSpacing: '0.32em',
    fontSize: 11,
    color: GOLD,
    fontFamily: "'Montserrat','Helvetica Neue',sans-serif",
    fontWeight: 500,
    marginBottom: 14,
    marginTop: 0,
};

const divider: React.CSSProperties = {
    width: 36, height: 1,
    background: `linear-gradient(90deg,transparent,${GOLD},transparent)`,
    margin: '0 auto 22px',
};

const body: React.CSSProperties = {
    fontSize: 13,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 1.9,
    margin: '3px 0',
    fontFamily: "'Montserrat','Helvetica Neue',sans-serif",
    fontWeight: 300,
    letterSpacing: '0.04em',
};

/* ── Footer ─────────────────────────────────────────────────────────────── */
export default function Footer() {
    return (
        <footer style={{
            background: '#080601',
            color: '#fff',
            borderTop: `1px solid rgba(201,168,76,0.12)`,
        }}>

            {/* Brand header */}
            <div style={{
                textAlign: 'center',
                padding: '52px 24px 44px',
                borderBottom: `1px solid rgba(201,168,76,0.10)`,
            }}>
                <p style={{ ...label, marginBottom: 18 }}>MAISON DE HAUTE JOAILLERIE</p>
                <h2 style={{
                    margin: 0,
                    fontSize: 'clamp(40px, 6.5vw, 68px)',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    color: '#ffffff',
                    fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif",
                    lineHeight: 1,
                }}>
                    BL JEWELS
                </h2>
            </div>

            {/* Three columns */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '48px 40px',
                maxWidth: 1080,
                margin: '0 auto',
                padding: '56px 32px 48px',
            }}>

                {/* BOUTIQUE */}
                <div style={{ textAlign: 'center' }}>
                    <p style={label}>BOUTIQUE</p>
                    <div style={divider} />
                    <p style={body}>N168 Centre Commercial El Manjra</p>
                    <p style={body}>Boulevard El Fida, Casablanca</p>
                    <p style={{ ...body, marginTop: 18 }}>11:00 — 18:30</p>
                    <p style={{ ...body, color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                        Vendredi fermé
                    </p>
                    <a
                        href="tel:+212655777934"
                        style={{
                            display: 'inline-block',
                            marginTop: 20,
                            color: GOLD,
                            fontSize: 16,
                            letterSpacing: '0.08em',
                            textDecoration: 'none',
                            fontFamily: "'Montserrat',sans-serif",
                            fontWeight: 500,
                        }}
                    >
                        +212 655 777 934
                    </a>
                </div>

                {/* LOCALISATION */}
                <div style={{ textAlign: 'center' }}>
                    <p style={label}>LOCALISATION</p>
                    <div style={divider} />
                    <div style={{
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: `1px solid rgba(201,168,76,0.18)`,
                        height: 210,
                    }}>
                        <iframe
                            title="BL Jewels Store"
                            width="100%" height="100%"
                            style={{ border: 0, display: 'block' }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://maps.google.com/maps?q=Centre+Commercial+El+Manjra+Casablanca&output=embed"
                        />
                    </div>
                </div>

                {/* SUIVEZ-NOUS */}
                <div style={{ textAlign: 'center' }}>
                    <p style={label}>SUIVEZ-NOUS</p>
                    <div style={divider} />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 16,
                        marginBottom: 28,
                    }}>
                        <SocialButton href="https://www.instagram.com/bl_jewels168/" label="Instagram">
                            <InstagramIcon />
                        </SocialButton>
                        <SocialButton href="https://www.tiktok.com/@bl_jewels168?_r=1&_t=ZS-948MjY3z0ia" label="TikTok">
                            <TiktokIcon />
                        </SocialButton>
                        <SocialButton href="https://wa.me/212655777934" label="WhatsApp">
                            <WhatsappIcon />
                        </SocialButton>
                    </div>
                    <p style={{
                        letterSpacing: '0.28em',
                        fontSize: 10,
                        color: 'rgba(255,255,255,0.30)',
                        fontFamily: "'Montserrat',sans-serif",
                        margin: 0,
                    }}>
                        EXCELLENCE DEPUIS 2021
                    </p>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                borderTop: `1px solid rgba(201,168,76,0.08)`,
                padding: '16px 32px',
                textAlign: 'center',
            }}>
                <p style={{
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    color: 'rgba(255,255,255,0.25)',
                    fontFamily: "'Montserrat',sans-serif",
                    margin: 0,
                }}>
                    © 2026 BL JEWELS — TOUS DROITS RÉSERVÉS ✦ @AYOUBBELHADJ1
                </p>
            </div>
        </footer>
    );
}