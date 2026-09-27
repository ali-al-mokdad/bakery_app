import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-6xl">🥐</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-bakery-900 dark:text-cream-50">
        Page Not Found
      </h1>
      <p className="mt-2 text-bakery-600/80 dark:text-cream-300/70">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
