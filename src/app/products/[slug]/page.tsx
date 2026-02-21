'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    images: string[];
    slug: string;
}

export default function ProductPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantityToAdd, setQuantityToAdd] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${slug}`);
                if (!res.ok) {
                    setProduct(null);
                    return;
                }
                const data = await res.json();
                setProduct(data.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="section">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="skeleton aspect-square rounded-xl" />
                        <div className="space-y-4">
                            <div className="skeleton h-10 w-3/4 rounded" />
                            <div className="skeleton h-8 w-1/3 rounded" />
                            <div className="skeleton h-4 w-full rounded" />
                            <div className="skeleton h-4 w-full rounded" />
                            <div className="skeleton h-4 w-2/3 rounded" />
                            <div className="skeleton h-12 w-full rounded mt-6" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        notFound();
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(price);
    };

    const handleAddToCart = () => {
        if (product && quantityToAdd > 0 && quantityToAdd <= product.quantity) {
            addToCart(
                {
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                },
                quantityToAdd
            );
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2500);
        }
    };

    return (
        <div className="section">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link href="/collections" className="text-sm text-gray-elegant hover:text-gold-primary transition-colors">
                        ← Retour aux Collections
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {/* Images Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-gray-light rounded-xl overflow-hidden shadow-sm">
                            {product.images.length > 0 ? (
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-light to-cream">
                                    <span className="text-8xl opacity-30">💍</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:opacity-90 ${selectedImage === index
                                            ? 'border-gold-primary shadow-gold'
                                            : 'border-transparent opacity-70'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            width={150}
                                            height={150}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-heading mb-4">{product.name}</h1>

                            <p className="text-3xl md:text-4xl font-heading font-light text-gold-primary mb-6">
                                {formatPrice(product.price)}
                            </p>

                            <div className="w-12 h-0.5 bg-gold-primary rounded-full mb-6" />

                            <div className="mb-6">
                                <p className="text-charcoal leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                    {product.description}
                                </p>
                            </div>

                            {/* Stock */}
                            <div className="mb-6">
                                {product.quantity > 0 ? (
                                    <span className="badge badge-success">
                                        ✓ En stock ({product.quantity} disponible{product.quantity > 1 ? 's' : ''})
                                    </span>
                                ) : (
                                    <span className="badge badge-error">✗ Rupture de stock</span>
                                )}
                            </div>
                        </div>

                        {/* Quantity Selector + Add to Cart */}
                        {product.quantity > 0 && (
                            <div className="mt-auto space-y-4">
                                <div>
                                    <label className="input-label">Quantité</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))}
                                            className="w-12 h-12 rounded-lg border border-gray-light flex items-center justify-center text-lg hover:bg-gray-light transition-colors"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.quantity}
                                            value={quantityToAdd}
                                            onChange={(e) => setQuantityToAdd(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                                            className="input text-center w-20"
                                        />
                                        <button
                                            onClick={() => setQuantityToAdd(Math.min(product.quantity, quantityToAdd + 1))}
                                            className="w-12 h-12 rounded-lg border border-gray-light flex items-center justify-center text-lg hover:bg-gray-light transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className={`btn w-full btn-lg ${addedToCart ? 'btn-gold' : 'btn-primary'}`}
                                >
                                    {addedToCart ? '✓ Ajouté au panier' : 'Ajouter au panier'}
                                </button>

                                {/* Extra Info */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-light">
                                    <div className="flex items-center gap-2 text-xs text-gray-elegant">
                                        <span className="text-gold-primary">✦</span>
                                        Livraison gratuite
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-elegant">
                                        <span className="text-gold-primary">✦</span>
                                        Retours sous 30j
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-elegant">
                                        <span className="text-gold-primary">✦</span>
                                        Certificat inclus
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-elegant">
                                        <span className="text-gold-primary">✦</span>
                                        Emballage cadeau
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
