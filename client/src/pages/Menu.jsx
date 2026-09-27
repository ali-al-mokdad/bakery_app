import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuService } from '../services/menuService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      menuService
        .getAll({ category: activeCategory, search })
        .then(setItems)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [activeCategory, search]);

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    if (id === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const visibleItems = useMemo(() => items.filter((i) => i.isVisible !== false), [items]);

  return (
    <div className="section">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="section-title">Our Menu</h1>
          <p className="mt-3 text-bakery-600/80 dark:text-cream-300/70">
            Freshly baked, made with love
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-5">
          <div className="mx-auto w-full max-w-lg">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex justify-center">
            <CategoryFilter categories={categories} active={activeCategory} onChange={handleCategoryChange} />
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : visibleItems.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No products found"
            description="Try a different search term or category."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-h-[calc(100vh-280px)] overflow-y-auto">
            {visibleItems.map((p) => (
              <ProductCard key={p.id} product={p} onClick={setActiveProduct} />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </div>
  );
}
