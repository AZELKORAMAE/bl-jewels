'use client';

import { useEffect, useRef, useState } from 'react';

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);
    const stateRef = useRef({
        mx: 0.5, my: 0.5,   // smoothed mouse (normalized)
        tx: 0.5, ty: 0.5,   // target mouse
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;

        /* ── resize ──────────────────────────────────────────────────────── */
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        /* ── mouse / touch ───────────────────────────────────────────────── */
        const onMouse = (e: MouseEvent) => {
            stateRef.current.tx = e.clientX / window.innerWidth;
            stateRef.current.ty = e.clientY / window.innerHeight;
        };
        const onTouch = (e: TouchEvent) => {
            stateRef.current.tx = e.touches[0].clientX / window.innerWidth;
            stateRef.current.ty = e.touches[0].clientY / window.innerHeight;
        };
        window.addEventListener('mousemove', onMouse);
        window.addEventListener('touchmove', onTouch, { passive: true });

        /* ── helpers ─────────────────────────────────────────────────────── */
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        /* ── render a single "fold strip" ────────────────────────────────── */
        /*
         * The visual idea: fill the entire canvas with VERTICAL strips.
         * For each strip we compute a "height" value h ∈ [0,1] using
         * layered sine waves (like rippling cloth). Then map h to a gold
         * or black colour — gold only near the crests, black in the valleys.
         * No noise, no particles — pure mathematical elegance.
         */

        const N_STRIPS = 520;   // how many thin vertical slices

        const draw = (t: number, mx: number, my: number) => {
            const W = canvas.width;
            const H = canvas.height;
            const sw = W / N_STRIPS + 1;   // strip width (slight overlap)

            /* Time drives the flow */
            const T = t * 0.28;

            for (let i = 0; i < N_STRIPS; i++) {
                const u = i / (N_STRIPS - 1);        // 0 → 1 across screen
                const cx = u * W;

                /* ── Layered sine "cloth height" per column ── */
                const h =
                    0.420 * Math.sin(u * 5.2 + T * 1.0 + my * 2.0)
                    + 0.230 * Math.sin(u * 11.0 + T * 1.7 + mx * 3.0 + 0.8)
                    + 0.130 * Math.sin(u * 19.5 + T * 2.4 + my * 1.5 + 1.6)
                    + 0.080 * Math.sin(u * 33.0 + T * 3.1 + mx * 1.2 + 2.5)
                    + 0.050 * Math.sin(u * 51.0 + T * 4.2 + 3.8)
                    // Mouse ripple: small extra wave centred on cursor
                    + 0.070 * Math.sin((u - mx) * 40.0 - T * 5.0)
                    * Math.exp(-Math.pow((u - mx) * 4.5, 2));

                /* Normalise to 0..1 */
                const hn = h * 0.5 + 0.5;

                /* ── Colour mapping ──
                 *  0.00 – 0.42  pure black (shadow valley)
                 *  0.42 – 0.60  dark-gold ramp (fold shoulder)
                 *  0.60 – 0.80  rich gold crest
                 *  0.80 – 0.92  bright gold highlight
                 *  0.92 – 1.00  white-gold specular
                 */
                let r = 0, g = 0, b = 0; // alpha = 1; Removed unused alpha

                if (hn < 0.42) {
                    // Deep black shadow
                    const k = hn / 0.42;
                    r = lerp(4, 14, k);
                    g = lerp(2, 8, k);
                    b = lerp(1, 4, k);
                } else if (hn < 0.60) {
                    // Shoulder — dark gold emerging
                    const k = (hn - 0.42) / 0.18;
                    r = lerp(14, 140, k);
                    g = lerp(8, 90, k);
                    b = lerp(4, 8, k);
                } else if (hn < 0.78) {
                    // Rich gold crest
                    const k = (hn - 0.60) / 0.18;
                    r = lerp(140, 218, k);
                    g = lerp(90, 162, k);
                    b = lerp(8, 18, k);
                } else if (hn < 0.91) {
                    // Bright highlight
                    const k = (hn - 0.78) / 0.13;
                    r = lerp(218, 252, k);
                    g = lerp(162, 220, k);
                    b = lerp(18, 90, k);
                } else {
                    // Pure specular — near-white gold
                    const k = (hn - 0.91) / 0.09;
                    r = lerp(252, 255, k);
                    g = lerp(220, 248, k);
                    b = lerp(90, 200, k);
                }

                /* ── Draw the strip as a vertical gradient ── */
                /* The gradient goes from the strip's own colour at centre
                 * to slightly darker at top/bottom — adds depth. */
                const grad = ctx.createLinearGradient(0, 0, 0, H);

                const darkR = Math.round(r * 0.30);
                const darkG = Math.round(g * 0.25);
                const darkB = Math.round(b * 0.20);

                const midR = Math.round(r);
                const midG = Math.round(g);
                const midB = Math.round(b);

                /* Top dark, centre full colour, bottom dark */
                const topShift = 0.25 + my * 0.30;   // mouse shifts the colour band
                const botShift = 0.75 + my * 0.15;

                grad.addColorStop(0, `rgb(${darkR},${darkG},${darkB})`);
                grad.addColorStop(topShift, `rgb(${midR}, ${midG}, ${midB})`);
                grad.addColorStop(botShift, `rgb(${midR}, ${midG}, ${midB})`);
                grad.addColorStop(1, `rgb(${darkR},${darkG},${darkB})`);

                ctx.fillStyle = grad;
                ctx.fillRect(cx - sw * 0.5, 0, sw, H);
            }

            /* ── Overlay: very soft vignette ─────────────────────────────── */
            const vig = ctx.createRadialGradient(
                W * 0.5, H * 0.5, 0,
                W * 0.5, H * 0.5, Math.max(W, H) * 0.72
            );
            vig.addColorStop(0, 'rgba(0,0,0,0)');
            vig.addColorStop(0.6, 'rgba(0,0,0,0)');
            vig.addColorStop(1, 'rgba(0,0,0,0.55)');
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, W, H);

            /* ── Overlay: subtle depth gloss (horizontal bands) ─────────── */
            const gloss = ctx.createLinearGradient(0, 0, W, 0);
            gloss.addColorStop(0, 'rgba(0,0,0,0.10)');
            gloss.addColorStop(0.45, 'rgba(255,220,80,0.03)');
            gloss.addColorStop(0.55, 'rgba(255,220,80,0.03)');
            gloss.addColorStop(1, 'rgba(0,0,0,0.10)');
            ctx.fillStyle = gloss;
            ctx.fillRect(0, 0, W, H);
        };

        /* ── main loop ───────────────────────────────────────────────────── */
        const start = performance.now();

        const tick = () => {
            const t = (performance.now() - start) / 1000;
            const st = stateRef.current;

            // Smooth mouse (very slow — feels silky)
            st.mx += (st.tx - st.mx) * 0.025;
            st.my += (st.ty - st.my) * 0.025;

            draw(t, st.mx, st.my);
            frameRef.current = requestAnimationFrame(tick);
        };
        tick();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('touchmove', onTouch);
            cancelAnimationFrame(frameRef.current);
        };
    }, [isMounted]);

    if (!isMounted) return null;

    return (
        <div className="absolute inset-0 z-0" style={{ background: '#060402' }}>
            <canvas
                ref={canvasRef}
                style={{ display: 'block', width: '100%', height: '100%' }}
            />
        </div>
    );
}