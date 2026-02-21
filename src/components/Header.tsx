'use client';

import Link from 'next/link';
import { useCart, type CartItem } from '@/contexts/CartContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const { cart } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const cartItemsCount = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/collections', label: 'Collections' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
            <nav className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-xl md:text-2xl font-heading font-semibold tracking-widest hover:text-gold-primary transition-colors"
                    >
                        <span className="text-gold-primary">✦</span> BL JEWEELS
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-xs font-semibold uppercase tracking-widest transition-colors relative py-2 ${isActive(link.href)
                                    ? 'text-gold-primary'
                                    : 'text-charcoal hover:text-gold-primary'
                                    }`}
                            >
                                {link.label}
                                {isActive(link.href) && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-primary rounded-full" />
                                )}
                            </Link>
                        ))}

                        {/* Cart Link Desktop */}
                        <Link
                            href="/cart"
                            className={`relative flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors py-2 ${isActive('/cart')
                                ? 'text-gold-primary'
                                : 'text-charcoal hover:text-gold-primary'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            Panier
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-5 bg-gold-primary text-deep-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm scale-in">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile: Cart + Menu Button */}
                    <div className="flex items-center gap-3 md:hidden">
                        <Link href="/cart" className="relative p-2">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {cartItemsCount > 0 && (
                                <span className="absolute top-0 right-0 bg-gold-primary text-deep-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        <button
                            className="p-2 rounded-md hover:bg-gray-light transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6 transition-transform duration-300"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'none' }}
                            >
                                {mobileMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu - Animated */}
                <div className={`mobile-menu md:hidden border-t border-gray-light ${mobileMenuOpen ? 'open' : ''}`}>
                    <div className="space-y-1 py-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-3 rounded-md text-sm font-medium uppercase tracking-wide transition-colors ${isActive(link.href)
                                    ? 'bg-gold-light text-gold-primary'
                                    : 'hover:bg-gray-light hover:text-gold-primary'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/cart"
                            className={`block px-4 py-3 rounded-md text-sm font-medium uppercase tracking-wide transition-colors ${isActive('/cart')
                                ? 'bg-gold-light text-gold-primary'
                                : 'hover:bg-gray-light hover:text-gold-primary'
                                }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Panier {cartItemsCount > 0 && `(${cartItemsCount})`}
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
