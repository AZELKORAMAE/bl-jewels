import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-[#f8f6f2] to-[#f1eee8] text-[#1a1a1a] pt-48 pb-28 border-t border-[#e5e2dc]">

            <div className="container mx-auto px-8 lg:px-24">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 pb-32">

                    {/* Brand */}
                    <div className="pr-8 border-r border-[#e5e2dc]">

                        <h4 className="text-[13px] uppercase tracking-[0.6em] text-[#111] mb-14 font-light">
                            BIJOUTERIE LUXE
                        </h4>

                        <div className="space-y-10">

                            <p className="text-2xl font-light tracking-wide text-[#111]">
                                Vente Bijoux en Or 18k
                            </p>

                            <div className="space-y-6 text-[15px] leading-relaxed text-gray-700">

                                <p>
                                    N168 Centre Commercial El Manjra<br />
                                    Boulevard El Fida, Casablanca
                                </p>

                                <p>
                                    11:00 — 18:30<br />
                                    Vendredi fermé
                                </p>

                                <a
                                    href="tel:+212655777934"
                                    className="inline-block text-lg tracking-wide border-b border-transparent hover:border-black transition-all duration-500"
                                >
                                    +212 655 777 934
                                </a>

                                <p className="pt-6 text-sm text-gray-400 tracking-wide">
                                    Owner @ayoubbelhadj1
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Localisation */}
                    <div className="px-8 border-r border-[#e5e2dc]">

                        <h4 className="text-[13px] uppercase tracking-[0.6em] text-[#111] mb-14 font-light">
                            LOCALISATION
                        </h4>

                        <div className="w-full h-[340px] rounded-xl overflow-hidden shadow-xl border border-[#e5e2dc]">

                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.4100126708563!2d-7.608247319283162!3d33.56870217439333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd5541d2c427%3A0xdc54dd3279ee4e93!2sBL%20Jewels%20Store!5e0!3m2!1sfr!2sma!4v1771702640886!5m2!1sfr!2sma"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="BL Jewels Store"
                                className="contrast-110 saturate-90"
                            />
                        </div>

                    </div>

                    {/* Social */}
                    <div className="pl-8">

                        <h4 className="text-[13px] uppercase tracking-[0.6em] text-[#111] mb-14 font-light">
                            SUIVEZ-NOUS
                        </h4>

                        <div className="flex gap-12 mb-14">

                            <a
                                href="https://www.instagram.com/bl_jewels168/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group transition"
                                aria-label="Instagram"
                            >
                                <svg
                                    className="w-7 h-7 text-gray-500 group-hover:text-black transition duration-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.3}
                                >
                                    <rect x="2" y="2" width="20" height="20" rx="6" ry="6"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>

                            <a
                                href="https://www.tiktok.com/@bl_jewels168"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group transition"
                                aria-label="TikTok"
                            >
                                <svg
                                    className="w-7 h-7 text-gray-500 group-hover:text-black transition duration-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.4-.4-.26-.77-.56-1.11-.88v7.34c.03 5.42-4.63 10.05-10.15 9.77-5.18-.26-9.35-5.06-8.91-10.22.37-4.38 4.02-7.85 8.4-7.85 1.15 0 2.29.24 3.32.7V7.12a5.55 5.55 0 0 0-3.32-.98c-3.07 0-5.56 2.49-5.56 5.56 0 3.07 2.49 5.56 5.56 5.56 3.06 0 5.56-2.49 5.56-5.56V0h-.44z" />
                                </svg>
                            </a>

                        </div>

                        <p className="text-[11px] uppercase tracking-[0.6em] text-gray-400">
                            Excellence depuis 2026
                        </p>

                    </div>

                </div>
            </div>

            {/* Bottom Red Luxury Bar */}
            <div className="bg-[#9e1b22] text-white py-12 text-center tracking-[0.4em] text-[11px] uppercase font-light">
                © {new Date().getFullYear()} BL JEWELS
            </div>

        </footer>
    );
}