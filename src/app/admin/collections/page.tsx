'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Collection {
    _id: string;
    name: string;
    description: string;
    slug: string;
    image?: string;
}

export default function AdminCollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [originalSlug, setOriginalSlug] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
    });

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const res = await fetch('/api/collections');
            const data = await res.json();
            if (data.success) {
                setCollections(data.data);
            }
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (collection: Collection) => {
        setFormData({
            name: collection.name,
            description: collection.description,
            image: collection.image || '',
        });
        setEditingId(collection._id);
        setOriginalSlug(collection.slug);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData({ name: '', description: '', image: '' });
        setEditingId(null);
        setOriginalSlug(null);
        setShowForm(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

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
                        const maxSide = 1280; // A bit higher for collection headers

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
                        }, 'image/jpeg', 0.85);
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
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                alert(`Erreur d'upload: ${data.error}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erreur lors du traitement de l\'image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId && originalSlug
                ? `/api/collections/${originalSlug}`
                : '/api/collections';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                alert(editingId ? 'Collection modifiée avec succès!' : 'Collection créée avec succès!');
                handleCancelEdit();
                fetchCollections();
            } else {
                alert(`Erreur: ${data.error}`);
            }
        } catch (error) {
            console.error('Error saving collection:', error);
            alert('Erreur lors de la sauvegarde: ' + (error instanceof Error ? error.message : String(error)));
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette collection?')) return;

        try {
            const res = await fetch(`/api/collections/${slug}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                alert('Collection supprimée!');
                fetchCollections();
            } else {
                alert(`Erreur: ${data.error}`);
            }
        } catch (error) {
            console.error('Error deleting collection:', error);
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="section min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-heading">Gestion des Collections</h1>
                        <p className="text-sm text-gray-elegant mt-1">{collections.length} collection{collections.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={showForm ? handleCancelEdit : () => setShowForm(true)}
                        className={`btn ${showForm ? 'btn-outline' : 'btn-primary'} btn-sm`}
                    >
                        {showForm ? '✕ Annuler' : '+ Nouvelle Collection'}
                    </button>
                </div>

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-10 scale-in border border-gray-light/50">
                        <h2 className="text-2xl font-heading mb-6">
                            {editingId ? 'Modifier la Collection' : 'Nouvelle Collection'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-5">
                                    <div className="input-group">
                                        <label htmlFor="name" className="input-label">Nom *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input"
                                            placeholder="Bagues de Fiançailles"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="description" className="input-label">Description *</label>
                                        <textarea
                                            id="description"
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="input textarea"
                                            placeholder="Description de la collection..."
                                            rows={5}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label font-bold text-deep-black">📸 Image de la Collection</label>
                                    <div className="flex flex-col gap-6">
                                        {formData.image ? (
                                            <div className="relative group rounded-2xl overflow-hidden border-2 border-gold-primary/20 bg-gray-50 aspect-video shadow-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={formData.image}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                                        className="bg-white/90 hover:bg-white text-error px-4 py-2 rounded-full shadow-lg font-bold text-xs uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-all"
                                                    >
                                                        Supprimer l&apos;image
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50/50 text-gray-elegant hover:bg-gold-light/5 hover:border-gold-primary/50 transition-all cursor-pointer relative group/add">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    disabled={uploading}
                                                />
                                                <div className={`w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4 transition-transform group-hover/add:scale-110 group-hover/add:bg-gold-light/20 ${uploading ? 'animate-pulse' : ''}`}>
                                                    {uploading ? (
                                                        <span className="text-gold-primary text-3xl">✨</span>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-deep-black">
                                                    {uploading ? 'Upload en cours...' : 'Ajouter une Image Locale'}
                                                </p>
                                                <p className="text-[10px] mt-2 text-gray-elegant uppercase tracking-widest font-medium">PNG, JPG ou WEBP • Haute Résolution</p>
                                            </div>
                                        )}

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gold-primary group-focus-within:scale-110 transition-transform">
                                                🔗
                                            </div>
                                            <input
                                                type="url"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                className="input pl-12 text-xs bg-gray-50/80 border-none italic focus:ring-1 focus:ring-gold-primary/30 h-10"
                                                placeholder="Ou collez une URL directe pour cette collection..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className={`btn btn-gold ${uploading ? 'btn-loading' : ''}`}
                                    disabled={uploading}
                                >
                                    {editingId ? 'Enregistrer les modifications' : 'Créer la Collection'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Collections List */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="skeleton h-6 w-3/4 mb-4 rounded" />
                                <div className="skeleton h-4 w-full mb-2 rounded" />
                                <div className="skeleton h-4 w-2/3 mb-4 rounded" />
                                <div className="skeleton h-9 w-full rounded" />
                            </div>
                        ))}
                    </div>
                ) : collections.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <div className="text-6xl mb-4">💎</div>
                        <p className="text-xl text-charcoal mb-6">Aucune collection</p>
                        <button onClick={() => setShowForm(true)} className="btn btn-primary">
                            Créer la première collection
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((collection) => (
                            <div key={collection._id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-light/30">
                                <h3 className="text-xl font-heading mb-2">{collection.name}</h3>
                                <p className="text-sm text-charcoal mb-5 line-clamp-2">{collection.description}</p>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/collections/${collection.slug}`}
                                        className="btn btn-outline btn-sm flex-1"
                                        target="_blank"
                                    >
                                        Voir
                                    </Link>
                                    <button
                                        onClick={() => handleEdit(collection)}
                                        className="btn btn-primary btn-sm flex-1"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(collection.slug)}
                                        className="btn btn-danger btn-sm flex-1"
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
