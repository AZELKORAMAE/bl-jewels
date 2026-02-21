import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

async function getCollection(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/collections/${slug}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch {
        return null;
    }
}

async function getCollectionProducts(collectionId: string) {
    try {
        const res = await fetch(
            `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products?collectionId=${collectionId}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const collection = await getCollection(slug);

    if (!collection) {
        notFound();
    }

    const products = await getCollectionProducts(collection._id);

    return (
        <div className="section">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link href="/collections" className="text-sm text-gray-elegant hover:text-gold-primary transition-colors">
                        ← Retour aux Collections
                    </Link>
                </div>

                {/* Collection Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <span className="text-gold-primary text-xs font-semibold uppercase tracking-[0.2em]">
                        Collection
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading mt-2 mb-4">{collection.name}</h1>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold-primary to-transparent mb-6" />
                    <div className="w-full max-w-2xl px-4">
                        <p className="text-lg text-charcoal leading-relaxed">
                            {collection.description}
                        </p>
                    </div>
                    <p className="text-sm text-gray-elegant mt-4 font-medium">
                        {products.length} produit{products.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <div className="text-6xl mb-4 opacity-30">💍</div>
                        <p className="text-xl text-charcoal mb-3">
                            Aucun produit dans cette collection pour le moment
                        </p>
                        <p className="text-sm text-gray-elegant">
                            De nouvelles pièces seront bientôt disponibles
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product: { _id: string; name: string; price: number; quantity: number; images: string[]; slug: string }) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                price={product.price}
                                quantity={product.quantity}
                                images={product.images}
                                slug={product.slug}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
