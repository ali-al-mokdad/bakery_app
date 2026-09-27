export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="animate-scale-in w-full max-w-sm rounded-2xl bg-white p-6 shadow-card dark:bg-bakery-800">
        <h3 className="font-display text-lg font-bold text-bakery-900 dark:text-cream-50">
          {title || 'Are you sure?'}
        </h3>
        <p className="mt-2 text-sm text-bakery-700/80 dark:text-cream-200/70">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm font-semibold text-bakery-700 hover:bg-bakery-100 dark:text-cream-200 dark:hover:bg-bakery-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-bakery-600 hover:bg-bakery-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
