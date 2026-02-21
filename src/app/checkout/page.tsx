'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, getTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                items: cart.map((item) => ({
                    productId: item.productId,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: getTotal(),
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (data.success) {
                clearCart();
                alert('Commande passée avec succès! Nous vous contacterons bientôt.');
                router.push('/');
            } else {
                alert(`Erreur: ${data.error}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Erreur lors de la création de la commande');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        router.push('/cart');
        return null;
    }

    return (
        <div className="section">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-heading">Finaliser la Commande</h1>
                    <div className="divider" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-light/30">
                            <h2 className="text-2xl font-heading mb-6">Informations de Livraison</h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="input-group">
                                    <label htmlFor="customerName" className="input-label">
                                        Nom Complet *
                                    </label>
                                    <input
                                        type="text"
                                        id="customerName"
                                        required
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        className="input"
                                        placeholder="Jean Dupont"
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="customerPhone" className="input-label">
                                        Numéro de Téléphone *
                                    </label>
                                    <input
                                        type="tel"
                                        id="customerPhone"
                                        required
                                        value={formData.customerPhone}
                                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                        className="input"
                                        placeholder="+33 6 12 34 56 78"
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="customerAddress" className="input-label">
                                        Adresse Complète *
                                    </label>
                                    <textarea
                                        id="customerAddress"
                                        required
                                        value={formData.customerAddress}
                                        onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                                        className="input textarea"
                                        placeholder={"123 Rue de la Paix\n75001 Paris\nFrance"}
                                        rows={4}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`btn btn-gold w-full btn-lg ${loading ? 'btn-loading' : ''}`}
                                >
                                    {loading ? 'Traitement...' : 'Confirmer la Commande'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-light/30 sticky top-24">
                            <h2 className="text-2xl font-heading mb-6">Récapitulatif</h2>

                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.productId} className="flex gap-3">
                                        <div className="w-14 h-14 bg-gray-light rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={56}
                                                    height={56}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-lg">💍</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-gray-elegant">Qté: {item.quantity}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-light pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-charcoal">
                                    <span>Livraison</span>
                                    <span className="text-success font-medium">Gratuite</span>
                                </div>
                                <div className="flex justify-between text-xl font-semibold pt-2">
                                    <span>Total</span>
                                    <span className="text-gold-primary">{formatPrice(getTotal())}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 bg-gold-light/50 p-4 rounded-xl border border-gold-primary/20">
                            <p className="text-xs text-charcoal leading-relaxed">
                                <strong>Note :</strong> Vous serez contacté par téléphone pour confirmer les détails de votre commande et organiser la livraison.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
