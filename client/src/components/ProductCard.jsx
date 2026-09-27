import { memo } from 'react';
import { resolveImageUrl } from '../services/api';
import { useSettings } from '../context/SettingsContext';

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', LBP: 'LL', GBP: '£' };

export function formatPrice(price, currency) {
  if (price === null || price === undefined || price === '') return 'Contact us for price';
  const symbol = CURRENCY_SYMBOLS[currency] || currency || '$';
  return `${symbol}${Number(price).toFixed(2)}`;
}

function ProductCard({ product, onClick }) {
  const { settings } = useSettings();
  const isUnavailable = !product.isAvailable;

  return (
    <button
      onClick={() => onClick(product)}
      className="card group flex flex-col overflow-hidden text-left animate-fade-in-up"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {product.image ? (
          <img
            src={resolveImageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              isUnavailable ? 'grayscale opacity-70' : ''
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bakery-100 text-4xl dark:bg-bakery-800">
            🍰
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isFeatured && (
            <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white shadow-soft">
              ★ Featured
            </span>
          )}
          {isUnavailable && (
            <span className="rounded-full bg-bakery-900/80 px-3 py-1 text-xs font-bold text-white shadow-soft">
              Unavailable
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-bakery-900 dark:text-cream-50">
            {product.name}
          </h3>
          <span className="whitespace-nowrap text-sm font-bold text-bakery-600 dark:text-bakery-300">
            {formatPrice(product.price, settings?.currency)}
          </span>
        </div>

        {product.description && (
          <p className="line-clamp-2 text-sm text-bakery-700/80 dark:text-cream-200/70">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          {product.category?.name && (
            <span className="rounded-full bg-bakery-100 px-3 py-1 text-xs font-semibold text-bakery-700 dark:bg-bakery-800 dark:text-bakery-200">
              {product.category.name}
            </span>
          )}
          <span className="text-sm font-semibold text-bakery-600 group-hover:underline dark:text-bakery-300">
            View Details →
          </span>
        </div>
      </div>
    </button>
  );
}

export default memo(ProductCard);
