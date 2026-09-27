import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { resolveImageUrl } from '../services/api';
import { menuService } from '../services/menuService';
import { categoryService } from '../services/categoryService';
import { galleryService } from '../services/galleryService';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import WhatsAppButton from '../components/WhatsAppButton';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

export default function Home() {
  const { settings } = useSettings();
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [items, cats, gal] = await Promise.all([
          menuService.getAll({ featured: true, limit: 6 }),
          categoryService.getAll({ limit: 6 }),
          galleryService.getAll({ limit: 6 }),
        ]);
        setFeatured(items);
        setCategories(cats);
        setGallery(gal);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section id="hero-section" className="relative">
        <div className="absolute inset-0">
          {settings?.coverImage ? (
            <img
              src={resolveImageUrl(settings.coverImage)}
              alt="Bakery cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-bakery-200 to-bakery-400" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>

        <div className="relative mx-auto flex min-h-[85vh] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center text-white sm:px-10">
          {settings?.logo && (
            <img
              src={resolveImageUrl(settings.logo)}
              alt="Logo"
              className="mb-6 h-20 w-20 rounded-full border-4 border-white/80 object-cover shadow-card animate-fade-in"
            />
          )}
          <h1 className="animate-fade-in-up font-display text-4xl font-extrabold leading-tight drop-shadow-lg sm:text-6xl">
            {settings?.businessName || 'Sweet Crumb Bakery'}
          </h1>
          <p
            className="animate-fade-in-up mt-5 max-w-xl text-base leading-relaxed text-cream-50/90 sm:text-lg"
            style={{ animationDelay: '100ms' }}
          >
            {settings?.description ||
              'Handcrafted bread, cakes, and pastries baked fresh daily with love and the finest ingredients.'}
          </p>
          <div
            className="animate-fade-in-up mt-8 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: '200ms' }}
          >
            <Link to="/menu" className="btn-primary">
              View Our Menu
            </Link>
            <Link to="/contact" className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-bakery-800">
              Contact Us
            </Link>
            <WhatsAppButton message="Hello, I would like to know more about your bakery products." />
          </div>
        </div>

        <button
          onClick={() => {
            const heroHeight = document.getElementById('hero-section')?.offsetHeight || 85 * window.innerHeight / 100;
            window.scrollTo({ top: heroHeight, behavior: 'smooth' });
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors focus:outline-none"
          aria-label="Scroll down"
        >
          <svg
            className="h-7 w-7 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Featured Products */}
          <section className="section">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 text-center">
                <h2 className="section-title">Featured Favorites</h2>
                <p className="mt-3 text-bakery-600/80 dark:text-cream-300/70">
                  A taste of our most-loved creations
                </p>
              </div>
              {featured.length === 0 ? (
                <EmptyState icon="⭐" title="No featured products yet" description="Check back soon for our star picks." />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((p) => (
                    <ProductCard key={p.id} product={p} onClick={setActiveProduct} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* About */}
          <section className="section bg-bakery-50/60 dark:bg-bakery-800/30">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="section-title">About Our Bakery</h2>
              <p className="mt-5 leading-relaxed text-bakery-700/90 dark:text-cream-200/80">
                {settings?.description ||
                  'Our bakery has been a neighborhood favorite for years, blending traditional techniques with a passion for quality ingredients. Every loaf, cake, and pastry is made fresh, in-house, every day.'}
              </p>
            </div>
          </section>

          {/* Popular Categories */}
          {categories.length > 0 && (
            <section className="section">
              <div className="mx-auto max-w-7xl">
                <div className="mb-10 text-center">
                  <h2 className="section-title">Popular Categories</h2>
                  <p className="mt-3 text-bakery-600/80 dark:text-cream-300/70">
                    Explore our delicious range
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                  {categories.map((cat, idx) => (
                    <Link
                      key={cat.id}
                      to={`/menu?category=${cat.id}`}
                      className="group animate-fade-in-up relative aspect-square overflow-hidden rounded-2xl shadow-soft transition hover:shadow-card"
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      {cat.image ? (
                        <img
                          src={resolveImageUrl(cat.image)}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-bakery-200 text-3xl dark:bg-bakery-800">
                          🍞
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute inset-x-0 bottom-3 text-center text-sm font-bold text-white">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Gallery Preview */}
          {gallery.length > 0 && (
            <section className="section bg-bakery-50/60 dark:bg-bakery-800/30">
              <div className="mx-auto max-w-7xl">
                <div className="mb-10 text-center">
                  <h2 className="section-title">A Peek Inside</h2>
                  <p className="mt-3 text-bakery-600/80 dark:text-cream-300/70">
                    Moments from our kitchen and counter
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {gallery.map((img) => (
                    <div key={img.id} className="aspect-square overflow-hidden rounded-xl shadow-soft">
                      <img
                        src={resolveImageUrl(img.image)}
                        alt={img.caption || 'Gallery'}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-10 text-center">
                  <Link to="/gallery" className="btn-secondary">
                    View Gallery
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Contact CTA */}
          <section className="section">
            <div className="mx-auto grid max-w-5xl gap-8 rounded-3xl bg-bakery-700 p-10 text-white shadow-card sm:grid-cols-2 sm:p-14">
              <div>
                <h2 className="font-display text-3xl font-bold">Visit or Order Today</h2>
                <div className="mt-5 space-y-2 text-cream-100/90">
                  {settings?.phone && <p>📞 {settings.phone}</p>}
                  {settings?.address && <p>📍 {settings.address}</p>}
                  {settings?.openingHours && (
                    <p className="whitespace-pre-line text-sm text-cream-100/70">
                      🕐 {settings.openingHours}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start justify-center gap-4 sm:items-end">
                <WhatsAppButton message="Hello, I would like to know more about your bakery products." />
                <Link
                  to="/contact"
                  className="text-sm font-semibold text-cream-100 underline-offset-4 hover:underline"
                >
                  See full contact details →
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </div>
  );
}
