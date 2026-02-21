import CollectionCard from '@/components/CollectionCard';

async function getCollections() {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/collections`, {
            cache: 'no-store',
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch {
        return [];
    }
}

export default async function CollectionsPage() {
    const collections = await getCollections();

    return (
        <div className="section">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center mb-16 animate-fade-in-up">
                    <span className="text-gold-primary text-xs font-semibold uppercase tracking-[0.2em]">
                        EXPLORER
                    </span>
                    <h1 className="text-5xl md:text-6xl font-heading mt-2 mb-6">Nos Collections</h1>
                    <div className="w-24 h-1 bg-gold-primary mb-8" />
                    <div className="w-full max-w-2xl px-4">
                        <p className="text-lg text-gray-elegant leading-relaxed">
                            Découvrez nos collections exclusives de bijoux raffinés, conçues pour
                            sublimer chaque instant de votre vie.
                        </p>
                    </div>
                </div>
                {collections.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <div className="text-6xl mb-4 opacity-30">💎</div>
                        <p className="text-xl text-charcoal mb-4">
                            Aucune collection disponible pour le moment
                        </p>
                        <p className="text-sm text-gray-elegant">
                            Revenez bientôt pour découvrir nos nouvelles créations
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {collections.map((collection: { _id: string; name: string; description: string; image?: string; slug: string }) => (
                            <CollectionCard
                                key={collection._id}
                                id={collection._id}
                                name={collection.name}
                                description={collection.description}
                                image={collection.image}
                                slug={collection.slug}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
