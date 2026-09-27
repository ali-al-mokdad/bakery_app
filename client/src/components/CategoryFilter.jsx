export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <button
        onClick={() => onChange('all')}
        className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
          active === 'all'
            ? 'bg-bakery-600 text-white shadow-soft'
            : 'bg-bakery-100 text-bakery-700 hover:bg-bakery-200 dark:bg-bakery-800 dark:text-cream-200 dark:hover:bg-bakery-700'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(String(cat.id))}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
            active === String(cat.id)
              ? 'bg-bakery-600 text-white shadow-soft'
              : 'bg-bakery-100 text-bakery-700 hover:bg-bakery-200 dark:bg-bakery-800 dark:text-cream-200 dark:hover:bg-bakery-700'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
