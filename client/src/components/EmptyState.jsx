export default function EmptyState({ icon = '🍪', title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="font-display text-xl font-bold text-bakery-800 dark:text-cream-100">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-bakery-600/80 dark:text-cream-300/70">
          {description}
        </p>
      )}
    </div>
  );
}
