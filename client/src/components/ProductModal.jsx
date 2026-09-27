import { memo, useEffect } from 'react';
import { resolveImageUrl } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from './ProductCard';
import WhatsAppButton from './WhatsAppButton';

function ProductModal({ product, onClose }) {
  const { settings } = useSettings();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'auto';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-card dark:bg-bakery-800 sm:flex-row"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-bakery-800 shadow-soft transition hover:bg-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="h-56 w-full flex-shrink-0 sm:h-auto sm:w-2/5">
          {product.image ? (
            <img
              src={resolveImageUrl(product.image)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-bakery-100 text-6xl dark:bg-bakery-900">
              🍰
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {product.category?.name && (
              <span className="rounded-full bg-bakery-100 px-3 py-1 text-xs font-semibold text-bakery-700 dark:bg-bakery-700 dark:text-bakery-100">
                {product.category.name}
              </span>
            )}
            {product.isFeatured && (
              <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white">
                ★ Featured
              </span>
            )}
            {!product.isAvailable && (
              <span className="rounded-full bg-bakery-900/80 px-3 py-1 text-xs font-bold text-white">
                Currently Unavailable
              </span>
            )}
          </div>

          <h2 className="mt-4 font-display text-2xl font-bold text-bakery-900 dark:text-cream-50 sm:text-3xl">
            {product.name}
          </h2>

          <p className="mt-3 text-2xl font-bold text-bakery-600 dark:text-bakery-300">
            {formatPrice(product.price, settings?.currency)}
          </p>

          {product.description && (
            <p className="mt-4 leading-relaxed text-bakery-700/90 dark:text-cream-200/80">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            {product.isAvailable ? (
              <WhatsAppButton
                message={`Hello, I would like to order ${product.name}.`}
                className="btn-whatsapp w-full sm:w-auto"
              />
            ) : (
              <p className="text-sm font-semibold text-bakery-500 dark:text-cream-300/70">
                This item is currently unavailable. Please check back soon!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductModal);
