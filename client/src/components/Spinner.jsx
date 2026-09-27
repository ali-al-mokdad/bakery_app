export default function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div className="flex items-center justify-center py-10">
      <div
        className={`${className} animate-spin rounded-full border-4 border-bakery-200 border-t-bakery-600 dark:border-bakery-700 dark:border-t-bakery-300`}
      />
    </div>
  );
}
