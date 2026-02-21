import Link from 'next/link';
import CollectionCard from '@/components/CollectionCard';
import ProductCard from '@/components/ProductCard';
import InteractiveBackground from '@/components/InteractiveBackground';

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

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts(),
  ]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <InteractiveBackground />

        {/* Premium radial overlay to anchor the text while letting the background shine */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none z-10" />

        <div className="absolute top-20 left-10 w-96 h-96 bg-gold-primary/5 rounded-full blur-[120px] -z-1" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gold-secondary/10 rounded-full blur-[150px] -z-1" />

        <div className="container mx-auto px-4 relative z-20 fade-in flex flex-col items-center text-center">
          <div className="inline-block mb-8">
            <span className="text-white text-sm font-semibold uppercase tracking-[0.5em] drop-shadow-lg opacity-80" style={{ color: '#FFFFFF' }}>
              <span style={{ color: '#c3ff00ff' }}>✦</span> Maison de Haute Joaillerie <span style={{ color: '#c3ff00ff' }}>✦</span>
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[100px] font-heading font-light mb-8 leading-[1.1] text-white drop-shadow-2xl text-center" style={{ color: '#FFFFFF' }}>
            Élevez votre <span className="italic text-white" style={{ color: '#eaff00ff' }}>Style</span> <br />
            au niveau supérieur
          </h1>
          <div className="divider mx-auto w-24 h-px bg-white/30 my-10" />
          <p className="text-xl md:text-2xl text-white mb-10 max-w-3xl leading-relaxed font-light drop-shadow-md text-center" style={{ color: '#FFFFFF' }}>
            Découvrez l’excellence à l’état pur <br /> des bijoux d’exception, conçus pour révéler votre prestige et sublimer chaque instant avec une élégance rare. Offrez-vous le luxe que vous méritez.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/collections" className="btn btn-white btn-lg min-w-[300px] text-lg">
              DÉCOUVRIR LES COLLECTIONS ✦
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
      </section>

      {/* 1. Featured Products Section (Nouveautés) */}
      {featuredProducts.length > 0 && (
        <section className="section bg-white py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-gold-primary text-xs font-semibold uppercase tracking-[0.2em]">
                Nouveautés
              </span>
              <h2 className="text-4xl md:text-5xl font-heading mt-2">
                Nos Dernières Créations
              </h2>
              <div className="divider mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
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

            <div className="text-center mt-12">
              <Link href="/collections" className="btn btn-outline">
                Voir Tous les Produits →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. Collections Section (Now right after Products) */}
      {collections.length > 0 && (
        <section className="section bg-gray-50/50 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-gold-primary text-xs font-semibold uppercase tracking-[0.2em]">
                Explorer
              </span>
              <h2 className="text-4xl md:text-5xl font-heading mt-2">
                Nos Collections
              </h2>
              <div className="divider mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.slice(0, 6).map((collection: any) => (
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
          </div>
        </section>
      )}

      {/* 3. About Section (Qualités/Services) - Modern Card Design */}
      <section className="section bg-cream py-32 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-gold-primary text-xs font-semibold uppercase tracking-[0.4em]">
              L&apos;Excellence Bijouterie Luxe
            </span>
            <h2 className="text-4xl md:text-5xl font-heading mt-6 uppercase tracking-wider text-gray-950">Nos Engagements</h2>
            <div className="h-px w-20 bg-gold-primary mx-auto mt-8" />
          </div>

          <ul className="cards">
            {[
              {
                icon: '💎',
                title: 'Qualité Exceptionnelle',
                desc: 'Chaque pièce est sélectionnée pour sa pureté et son éclat incomparable. Une exigence absolue pour des bijoux d\'exception.',
                image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', // Jewelry image
                tag: 'Prestige'
              },
              {
                icon: '⚒️',
                title: 'Savoir-faire Artisanal',
                desc: 'Nos artisans joailliers allient techniques traditionnelles et innovation pour donner vie à des créations uniques.',
                image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80', // Workshop image
                tag: 'Tradition'
              },
              {
                icon: '🤝',
                title: 'Service Personnalisé',
                desc: 'Nous vous accompagnons dans le choix de votre bijou avec une attention particulière et des conseils d\'experts.',
                image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80', // Handshake/Service image
                tag: 'Expertise'
              }
            ].map((feature) => (
              <li key={feature.title}>
                <a href="#" className="card-modern">
                  <img src={feature.image} className="card__image" alt={feature.title} />
                  <div className="card__overlay">
                    <div className="card__header">
                      <svg className="card__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
                      <div className="card__thumb">
                        {feature.icon}
                      </div>
                      <div className="card__header-text text-left">
                        <h3 className="card__title leading-tight">{feature.title}</h3>
                        <span className="card__status">{feature.tag}</span>
                      </div>
                    </div>
                    <p className="card__description text-left">
                      {feature.desc}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section - Refined Elegance */}
      <section className="section bg-[#fdfcf9] relative overflow-hidden py-32 border-t border-gray-100">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-6 mb-10">
            <div className="h-px w-10 bg-gold-primary/40" />
            <span className="text-gold-primary text-[11px] font-bold uppercase tracking-[0.5em]">
              Une Maison à votre écoute
            </span>
            <div className="h-px w-10 bg-gold-primary/40" />
          </div>

          <h2 className="text-4xl md:text-6xl font-heading mb-10 leading-tight text-[#1a1a1a] uppercase tracking-wider text-center">
            Élevez votre <span className="text-gold-primary italic lowercase font-serif">Style</span> <br />
            au niveau supérieur
          </h2>

          <p className="text-lg md:text-xl mb-14 max-w-2xl text-gray-600 font-light leading-relaxed italic text-center">
            Laissez-vous séduire par l&apos;éclat intemporel de nos créations et trouvez le bijou qui racontera votre histoire avec élégance.
          </p>

          <Link href="/collections" className="btn btn-gold btn-lg min-w-[320px] shadow-[0_15px_40px_rgba(212,175,55,0.2)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)]">
            DÉCOUVRIR LES COLLECTIONS ✦
          </Link>
        </div>
      </section>
    </div>
  );
}
