import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import { categoryService } from '../../services/categoryService';
import { galleryService } from '../../services/galleryService';
import Spinner from '../../components/Spinner';

function StatCard({ icon, label, value, to, color }) {
  const content = (
    <div className="card flex items-center gap-4 p-6">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-bakery-900 dark:text-cream-50">{value}</p>
        <p className="text-sm text-bakery-500 dark:text-cream-300/60">{label}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [items, categories, gallery] = await Promise.all([
          menuService.getAll({ all: true }),
          categoryService.getAll({ all: true }),
          galleryService.getAll({ all: true }),
        ]);
        setStats({
          totalProducts: items.length,
          totalCategories: categories.length,
          totalGallery: gallery.length,
          featuredProducts: items.filter((i) => i.isFeatured).length,
          availableProducts: items.filter((i) => i.isAvailable).length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bakery-900 dark:text-cream-50">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-bakery-500 dark:text-cream-300/60">
        Overview of your bakery website
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon="🥐" label="Total Products" value={stats.totalProducts} to="/admin/menu" color="bg-bakery-100 text-bakery-700 dark:bg-bakery-700 dark:text-cream-100" />
        <StatCard icon="🗂️" label="Total Categories" value={stats.totalCategories} to="/admin/categories" color="bg-accent-400/20 text-accent-600" />
        <StatCard icon="🖼️" label="Total Gallery Images" value={stats.totalGallery} to="/admin/gallery" color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" />
        <StatCard icon="⭐" label="Featured Products" value={stats.featuredProducts} to="/admin/menu" color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300" />
        <StatCard icon="✅" label="Available Products" value={stats.availableProducts} to="/admin/menu" color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/menu" className="btn-secondary justify-center">+ Add Product</Link>
        <Link to="/admin/categories" className="btn-secondary justify-center">+ Add Category</Link>
        <Link to="/admin/gallery" className="btn-secondary justify-center">+ Add Gallery Image</Link>
        <Link to="/admin/settings" className="btn-secondary justify-center">Edit Settings</Link>
      </div>
    </div>
  );
}
