import Link from 'next/link';
import Image from 'next/image';

interface CollectionCardProps {
    id: string;
    name: string;
    description: string;
    image?: string;
    slug: string;
    productCount?: number;
}

export default function CollectionCard({
    name,
    description,
    image,
    slug,
    productCount,
}: CollectionCardProps) {
    return (
        <Link href={`/collections/${slug}`} className="card fade-in group">
            <div className="card-image relative">
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: 'cover' }}
                        priority={false}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-light/30 to-cream">
                        <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-500">💎</span>
                    </div>
                )}

                {/* Product Count Badge */}
                {productCount !== undefined && (
                    <div className="absolute top-3 right-3">
                        <span className="badge badge-gold">
                            {productCount} produit{productCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-deep-black/0 group-hover:bg-deep-black/30 transition-colors duration-300 flex items-end">
                    <div className="w-full p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-white text-xs font-semibold uppercase tracking-widest bg-deep-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                            Explorer →
                        </span>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <h3 className="card-title group-hover:text-gold-primary transition-colors">{name}</h3>
                <p className="text-sm text-gray-elegant line-clamp-2">{description}</p>
            </div>
        </Link>
    );
}
