'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Collection {
    _id: string;
    name: string;
    slug: string;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    slug: string;
    collectionId: {
        name: string;
    };
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [originalSlug, setOriginalSlug] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        collectionId: '',
        images: [''],
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, collectionsRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/collections'),
            ]);

            const [productsData, collectionsData] = await Promise.all([
                productsRes.json(),
                collectionsRes.json(),
            ]);

            if (productsData.success) setProducts(productsData.data);
            if (collectionsData.success) setCollections(collectionsData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            quantity: product.quantity.toString(),
            // @ts-ignore - The product object from API has populated collectionId, need to handle both cases or mapped properly
            collectionId: (product.collectionId as any)._id || product.collectionId,
            images: (product as any).images.length > 0 ? (product as any).images : [''],
        });
        setEditingId(product._id);
        setOriginalSlug(product.slug);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            quantity: '',
            collectionId: '',
            images: [''],
        });
        setEditingId(null);
        setOriginalSlug(null);
        setShowForm(false);
    };

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(index);

        try {
            // Client-side compression
            const compressedFile = await new Promise<File>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target?.result as string;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        const maxSide = 1024;

                        if (width > height && width > maxSide) {
                            height *= maxSide / width;
                            width = maxSide;
                        } else if (height > maxSide) {
                            width *= maxSide / height;
                            height = maxSide;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx?.drawImage(img, 0, 0, width, height);

                        canvas.toBlob((blob) => {
                            if (blob) {
                                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                            } else {
                                resolve(file);
                            }
                        }, 'image/jpeg', 0.8);
                    };
                };
            });

            const formDataUpload = new FormData();
            formDataUpload.append('file', compressedFile);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            const data = await res.json();
            if (data.success) {
                const newImages = [...formData.images];
                newImages[index] = data.url; // This is the Base64 string
                setFormData(prev => ({ ...prev, images: newImages }));
            } else {
                alert(`Erreur d'upload: ${data.error}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erreur lors du traitement de l\'image');
        } finally {
            setUploading(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                images: formData.images.filter((img) => img.trim() !== ''),
            };

            const url = editingId && originalSlug
                ? `/api/products/${originalSlug}`
                : '/api/products';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            const data = await res.json();

            if (data.success) {
                alert(editingId ? 'Produit modifié avec succès!' : 'Produit créé avec succès!');
                handleCancelEdit();
                fetchData();
            } else {
                alert(`Erreur: ${data.error}`);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erreur lors de la sauvegarde du produit');
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return;

        try {
            const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                alert('Produit supprimé!');
                fetchData();
            } else {
                alert(`Erreur: ${data.error}`);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD',
        }).format(price);
    };

    return (
        <div className="section min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading">Gestion des Produits</h1>
                        <p className="text-sm text-gray-elegant mt-1">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={showForm ? handleCancelEdit : () => setShowForm(true)}
                        className={`btn ${showForm ? 'btn-outline' : 'btn-primary'} btn-sm`}
                        disabled={collections.length === 0 && !showForm}
                    >
                        {showForm ? '✕ Annuler' : '+ Nouveau Produit'}
                    </button>
                </div>

                {collections.length === 0 && (
                    <div className="bg-gold-light/50 p-5 rounded-xl mb-8 border border-gold-primary/20">
                        <p className="text-sm text-charcoal">
                            <strong>Note :</strong> Vous devez d&apos;abord créer au moins une collection avant d&apos;ajouter des produits.{' '}
                            <Link href="/admin/collections" className="text-gold-primary hover:underline font-semibold">
                                Créer une collection →
                            </Link>
                        </p>
                    </div>
                )}

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-10 scale-in border border-gray-light/50">
                        <h2 className="text-2xl font-heading mb-6">
                            {editingId ? 'Modifier le Produit' : 'Nouveau Produit'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="input-group">
                                        <label htmlFor="name" className="input-label">Nom du bijou *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input"
                                            placeholder="Bague Solitaire Diamant"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="collectionId" className="input-label">Collection *</label>
                                        <select
                                            id="collectionId"
                                            required
                                            value={formData.collectionId}
                                            onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                                            className="input"
                                        >
                                            <option value="">Sélectionner une collection...</option>
                                            {collections.map((col) => (
                                                <option key={col._id} value={col._id}>{col.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="input-group">
                                            <label htmlFor="price" className="input-label">Prix (€) *</label>
                                            <input
                                                type="number"
                                                id="price"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                className="input"
                                                placeholder="1999.00"
                                            />
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="quantity" className="input-label">Stock *</label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                required
                                                min="0"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                                className="input"
                                                placeholder="5"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="description" className="input-label">Description détaillée *</label>
                                        <textarea
                                            id="description"
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="input textarea"
                                            placeholder="Décrivez les caractéristiques du bijou (carats, pureté, métal...)"
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="input-label font-bold text-deep-black flex items-center gap-2">
                                        📸 Images du Produit
                                        <span className="text-[10px] font-normal text-gray-elegant bg-gray-100 px-2 py-0.5 rounded-full">(Max 6)</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className={`relative group rounded-2xl overflow-hidden border-2 transition-all aspect-square flex flex-col items-center justify-center ${img ? 'border-gold-primary/20 shadow-sm' : 'border-dashed border-gray-300 bg-gray-50/50 hover:border-gold-primary/50 hover:bg-gold-light/5'}`}>
                                                    {img ? (
                                                        <>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={img}
                                                                alt={`Product ${index}`}
                                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newImages = [...formData.images];
                                                                        newImages.splice(index, 1);
                                                                        if (newImages.length === 0) newImages.push('');
                                                                        setFormData({ ...formData, images: newImages });
                                                                    }}
                                                                    className="bg-white/90 hover:bg-white text-error p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
                                                                    title="Supprimer cette image"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-elegant relative p-4 text-center group/add">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageUpload(index, e)}
                                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                disabled={uploading !== null}
                                                            />
                                                            <div className={`w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 transition-transform group-hover/add:scale-110 group-hover/add:bg-gold-light/20 ${uploading === index ? 'animate-pulse' : ''}`}>
                                                                {uploading === index ? (
                                                                    <span className="text-gold-primary text-xl">✨</span>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-deep-black">
                                                                {uploading === index ? 'Envoi...' : 'Choisir Photo'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="url"
                                                        value={img}
                                                        onChange={(e) => {
                                                            const newImages = [...formData.images];
                                                            newImages[index] = e.target.value;
                                                            setFormData({ ...formData, images: newImages });
                                                        }}
                                                        className="input text-[9px] h-7 px-2 bg-gray-50/50 border-none italic focus:ring-1 focus:ring-gold-primary/30"
                                                        placeholder="Ou lien URL..."
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {formData.images.length < 6 && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                                                className="border-2 border-dashed border-gold-light/30 rounded-2xl aspect-square flex flex-col items-center justify-center text-gold-primary hover:bg-gold-light/10 hover:border-gold-primary/50 transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gold-light/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <span className="text-xl">+</span>
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Image Suivante</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                                        <span className="text-lg">💡</span>
                                        <p className="text-[10px] text-blue-800 leading-tight">
                                            <strong>Astuce :</strong> Vous pouvez uploader directement vos photos depuis votre téléphone ! Les images sont automatiquement optimisées pour le luxe.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-light/30">
                                <button
                                    type="submit"
                                    className={`btn btn-gold px-10 ${uploading !== null ? 'btn-loading' : ''}`}
                                    disabled={uploading !== null}
                                >
                                    {editingId ? 'Enregistrer les modifications' : 'Créer le Produit Deluxe'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
                                <div className="flex-grow">
                                    <div className="skeleton h-5 w-1/3 mb-3 rounded" />
                                    <div className="skeleton h-4 w-1/4 mb-2 rounded" />
                                    <div className="skeleton h-4 w-1/5 rounded" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="skeleton h-9 w-16 rounded" />
                                    <div className="skeleton h-9 w-24 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-light/30">
                        <div className="text-6xl mb-4">💍</div>
                        <p className="text-xl text-charcoal mb-6">Votre catalogue est vide</p>
                        {collections.length > 0 && (
                            <button onClick={() => setShowForm(true)} className="btn btn-primary">
                                Commencer à ajouter des produits
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-light/30 flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-20 h-20 rounded-lg bg-gray-50 border border-gray-light overflow-hidden flex-shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={(product as any).images?.[0] || '/baguette-diamond.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow min-w-0 text-center sm:text-left">
                                    <h3 className="text-lg font-heading mb-1 truncate">{product.name}</h3>
                                    <p className="text-xs text-gray-elegant mb-2 uppercase tracking-widest">
                                        {product.collectionId?.name || 'Sans collection'}
                                    </p>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                                        <span className="text-gold-primary font-bold">{formatPrice(product.price)}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${product.quantity > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                            {product.quantity > 0 ? `En Stock: ${product.quantity}` : 'Rupture'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:flex-shrink-0 w-full sm:w-auto">
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="btn btn-outline btn-sm flex-1 sm:flex-none"
                                        target="_blank"
                                    >
                                        Voir
                                    </Link>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="btn btn-primary btn-sm flex-1 sm:flex-none"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.slug)}
                                        className="btn btn-danger btn-sm flex-1 sm:flex-none"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link href="/admin" className="text-charcoal hover:text-gold-primary transition-colors text-sm">
                        ← Retour à l&apos;admin
                    </Link>
                </div>
            </div>
        </div>
    );
}
