import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    quantity?: number;
    images: string[];
    slug: string;
    collectionSlug?: string;
}

export default function ProductCard({
    name,
    price,
    quantity,
    images,
    slug,
}: ProductCardProps) {
    const formatPrice = (price: number) => {
        return `${price.toLocaleString('fr-FR')} DH`;
    };

    const isOutOfStock = quantity !== undefined && quantity === 0;

    return (
        <Link href={`/products/${slug}`} className="card fade-in group">
            <div className="card-image relative">
                {images.length > 0 ? (
                    <Image
                        src={images[0]}
                        alt={name}
                        fill
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: 'cover' }}
                        priority={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-light to-cream">
                        <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-500">💍</span>
                    </div>
                )}

                {/* Out of Stock Badge */}
                {isOutOfStock && (
                    <div className="absolute top-3 left-3">
                        <span className="badge badge-error">Rupture de stock</span>
                    </div>
                )}

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-deep-black/0 group-hover:bg-deep-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-deep-black/70 px-4 py-2 rounded-full backdrop-blur-sm">
                        Voir le détail
                    </span>
                </div>
            </div>
            <div className="card-body">
                <h3 className="card-title group-hover:text-gold-primary transition-colors">{name}</h3>
                <p className="card-price">{formatPrice(price)}</p>
            </div>
        </Link>
    );
}
