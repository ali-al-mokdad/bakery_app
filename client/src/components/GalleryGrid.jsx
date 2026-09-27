import { useState } from 'react';
import { resolveImageUrl } from '../services/api';

export default function GalleryGrid({ images }) {
  const [active, setActive] = useState(null);

  if (!images || images.length === 0) {
    return (
      <p className="py-10 text-center text-bakery-500 dark:text-cream-300/70">
        No gallery images yet. Check back soon!
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setActive(img)}
            className="group relative aspect-square overflow-hidden rounded-2xl shadow-soft animate-fade-in-up"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <img
              src={resolveImageUrl(img.image)}
              alt={img.caption || 'Bakery gallery photo'}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {img.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
          onClick={() => setActive(null)}
        >
          <button
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-bakery-800 shadow-soft"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="animate-scale-in max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={resolveImageUrl(active.image)}
              alt={active.caption || 'Bakery gallery photo'}
              className="max-h-[75vh] w-full object-contain"
            />
            {active.caption && (
              <p className="bg-white p-4 text-center text-sm font-medium text-bakery-800 dark:bg-bakery-800 dark:text-cream-100">
                {active.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
