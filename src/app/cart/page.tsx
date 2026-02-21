'use client';

import { useCart, type CartItem } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    if (cart.length === 0) {
        return (
            <div className="section">
                <div className="container mx-auto px-4">
                    <div className="text-center py-20">
                        <div className="text-7xl mb-6 opacity-30">🛒</div>
                        <h1 className="text-4xl font-heading mb-4">Votre Panier</h1>
                        <div className="divider" />
                        <p className="text-lg text-charcoal mb-8">Votre panier est vide</p>
                        <Link href="/collections" className="btn btn-primary">
                            Découvrir nos Collections
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-heading">Votre Panier</h1>
                    <div className="divider" />
                    <p className="text-sm text-gray-elegant">{cart.length} article{cart.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item: CartItem) => (
                            <div key={item.productId} className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-light/30 flex flex-col sm:flex-row gap-4 sm:gap-6">
                                {/* Product Image */}
                                <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-light rounded-lg overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-light to-cream">
                                            <span className="text-4xl opacity-50">💍</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-grow">
                                    <h3 className="text-lg font-heading mb-1">{item.name}</h3>
                                    <p className="text-gold-primary font-semibold mb-3">
                                        {formatPrice(item.price)}
                                    </p>

                                    <div className="flex items-center justify-between sm:justify-start gap-4">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                className="w-8 h-8 rounded-md border border-gray-light flex items-center justify-center text-sm hover:bg-gray-light transition-colors"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="w-8 h-8 rounded-md border border-gray-light flex items-center justify-center text-sm hover:bg-gray-light transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="text-error hover:underline text-xs font-medium"
                                        >
                                            Retirer
                                        </button>
                                    </div>
                                </div>

                                {/* Subtotal */}
                                <div className="text-right sm:self-center">
                                    <p className="text-lg font-semibold">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-md sticky top-24 border border-gray-light/30">
                            <h2 className="text-2xl font-heading mb-6">Récapitulatif</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm text-charcoal">
                                    <span>Sous-total</span>
                                    <span>{formatPrice(getTotal())}</span>
                                </div>
                                <div className="flex justify-between text-sm text-charcoal">
                                    <span>Livraison</span>
                                    <span className="text-success font-medium">Gratuite</span>
                                </div>
                                <div className="border-t border-gray-light pt-4 flex justify-between text-xl font-semibold">
                                    <span>Total</span>
                                    <span className="text-gold-primary">{formatPrice(getTotal())}</span>
                                </div>
                            </div>

                            <Link href="/checkout" className="btn btn-gold w-full mb-4">
                                Procéder au paiement
                            </Link>

                            <Link
                                href="/collections"
                                className="block text-center text-sm text-charcoal hover:text-gold-primary transition-colors"
                            >
                                ← Continuer mes achats
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
