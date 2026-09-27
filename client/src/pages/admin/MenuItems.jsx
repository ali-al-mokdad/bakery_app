import { useEffect, useState } from 'react';
import { menuService } from '../../services/menuService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploader from '../../components/ImageUploader';
import { resolveImageUrl } from '../../services/api';
import { formatPrice } from '../../components/ProductCard';
import { useSettings } from '../../context/SettingsContext';

const emptyForm = {
  id: null,
  name: '',
  description: '',
  price: '',
  image: '',
  categoryId: '',
  isAvailable: true,
  isFeatured: false,
  isVisible: true,
};

export default function MenuItems() {
  const { showToast } = useToast();
  const { settings } = useSettings();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const [menuData, catData] = await Promise.all([
        menuService.getAll({ all: true }),
        categoryService.getAll({ all: true }),
      ]);
      setItems(menuData);
      setCategories(catData);
    } catch (err) {
      showToast('Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price ?? '',
      image: item.image || '',
      categoryId: item.categoryId || '',
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      isVisible: item.isVisible,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: form.price === '' ? null : Number(form.price),
        image: form.image || null,
        categoryId: form.categoryId || null,
        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
        isVisible: form.isVisible,
      };
      if (form.id) {
        await menuService.update(form.id, payload);
        showToast('Product updated.');
      } else {
        await menuService.create(payload);
        showToast('Product created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await menuService.remove(deleteTarget.id);
      showToast('Product deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast('Failed to delete product.', 'error');
    }
  };

  const toggleField = async (item, field) => {
    try {
      await menuService.update(item.id, { [field]: !item[field] });
      load();
    } catch (err) {
      showToast('Failed to update product.', 'error');
    }
  };

  const move = async (index, direction, list) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= list.length) return;
    const reordered = [...list];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setItems((prev) => {
      const others = prev.filter((p) => !list.find((l) => l.id === p.id));
      return [...others, ...reordered].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    try {
      await menuService.reorder(reordered.map((c, idx) => ({ id: c.id, displayOrder: idx })));
    } catch (err) {
      showToast('Failed to reorder products.', 'error');
      load();
    }
  };

  const filteredItems =
    categoryFilter === 'all' ? items : items.filter((i) => String(i.categoryId) === categoryFilter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bakery-900 dark:text-cream-50">
            Menu Items
          </h1>
          <p className="mt-1 text-sm text-bakery-500 dark:text-cream-300/60">
            Manage your bakery products
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + Add Product
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
            categoryFilter === 'all' ? 'bg-bakery-600 text-white' : 'bg-bakery-100 text-bakery-700 dark:bg-bakery-800 dark:text-cream-200'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(String(c.id))}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              categoryFilter === String(c.id) ? 'bg-bakery-600 text-white' : 'bg-bakery-100 text-bakery-700 dark:bg-bakery-800 dark:text-cream-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : filteredItems.length === 0 ? (
          <EmptyState icon="🥐" title="No products yet" description="Add your first bakery product." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-bakery-100 bg-white dark:border-bakery-800 dark:bg-bakery-800">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-bakery-50 text-xs uppercase tracking-wide text-bakery-500 dark:bg-bakery-900 dark:text-cream-300/60">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Image</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Available</th>
                  <th className="px-5 py-3">Featured</th>
                  <th className="px-5 py-3">Visible</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bakery-100 dark:divide-bakery-700">
                {filteredItems.map((item, idx) => (
                  <tr key={item.id} className="text-bakery-800 dark:text-cream-100">
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => move(idx, -1, filteredItems)} disabled={idx === 0} className="text-xs disabled:opacity-30">▲</button>
                        <button onClick={() => move(idx, 1, filteredItems)} disabled={idx === filteredItems.length - 1} className="text-xs disabled:opacity-30">▼</button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {item.image ? (
                        <img src={resolveImageUrl(item.image)} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bakery-100 dark:bg-bakery-700">🍰</div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold">{item.name}</td>
                    <td className="px-5 py-3">{item.category?.name || '—'}</td>
                    <td className="px-5 py-3">{formatPrice(item.price, settings?.currency)}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleField(item, 'isAvailable')} className={`rounded-full px-3 py-1 text-xs font-bold ${item.isAvailable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'}`}>
                        {item.isAvailable ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleField(item, 'isFeatured')} className={`rounded-full px-3 py-1 text-xs font-bold ${item.isFeatured ? 'bg-accent-500/20 text-accent-600' : 'bg-bakery-100 text-bakery-500 dark:bg-bakery-700 dark:text-cream-300/60'}`}>
                        {item.isFeatured ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleField(item, 'isVisible')} className={`rounded-full px-3 py-1 text-xs font-bold ${item.isVisible ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-bakery-100 text-bakery-500 dark:bg-bakery-700 dark:text-cream-300/60'}`}>
                        {item.isVisible ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEdit(item)} className="mr-3 text-bakery-600 hover:underline dark:text-bakery-300">Edit</button>
                      <button onClick={() => setDeleteTarget(item)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 animate-fade-in">
          <form
            onSubmit={handleSave}
            className="animate-scale-in my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-card dark:bg-bakery-800 sm:p-8"
          >
            <h2 className="font-display text-xl font-bold text-bakery-900 dark:text-cream-50">
              {form.id ? 'Edit Product' : 'Add Product'}
            </h2>

            <div className="mt-6 space-y-4">
              <ImageUploader
                label="Product Image"
                value={form.image}
                onUploaded={(path) => setForm((f) => ({ ...f, image: path }))}
              />
              <div>
                <label className="label">Name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price ({settings?.currency || 'USD'})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    placeholder="Leave empty for 'Contact us'"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select
                    className="input"
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm font-semibold text-bakery-700 dark:text-cream-200">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))} className="h-4 w-4 rounded" />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-bakery-700 dark:text-cream-200">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} className="h-4 w-4 rounded" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-bakery-700 dark:text-cream-200">
                  <input type="checkbox" checked={form.isVisible} onChange={(e) => setForm((f) => ({ ...f, isVisible: e.target.checked }))} className="h-4 w-4 rounded" />
                  Visible
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full px-4 py-2 text-sm font-semibold text-bakery-700 hover:bg-bakery-100 dark:text-cream-200 dark:hover:bg-bakery-700">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product?"
        message={`This will permanently delete "${deleteTarget?.name}".`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
