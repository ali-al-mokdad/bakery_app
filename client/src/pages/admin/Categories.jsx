import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageUploader from '../../components/ImageUploader';
import { resolveImageUrl } from '../../services/api';

const emptyForm = { id: null, name: '', description: '', image: '', isVisible: true };

export default function Categories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll({ all: true });
      setCategories(data);
    } catch (err) {
      showToast('Failed to load categories.', 'error');
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

  const openEdit = (cat) => {
    setForm({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      isVisible: cat.isVisible,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        image: form.image || null,
        isVisible: form.isVisible,
      };
      if (form.id) {
        await categoryService.update(form.id, payload);
        showToast('Category updated.');
      } else {
        await categoryService.create(payload);
        showToast('Category created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await categoryService.remove(deleteTarget.id);
      showToast('Category deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete category.', 'error');
    }
  };

  const toggleVisibility = async (cat) => {
    try {
      await categoryService.update(cat.id, { isVisible: !cat.isVisible });
      load();
    } catch (err) {
      showToast('Failed to update visibility.', 'error');
    }
  };

  const move = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const reordered = [...categories];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setCategories(reordered);
    try {
      await categoryService.reorder(
        reordered.map((c, idx) => ({ id: c.id, displayOrder: idx }))
      );
    } catch (err) {
      showToast('Failed to reorder categories.', 'error');
      load();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bakery-900 dark:text-cream-50">
            Categories
          </h1>
          <p className="mt-1 text-sm text-bakery-500 dark:text-cream-300/60">
            Manage your bakery product categories
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + Add Category
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner />
        ) : categories.length === 0 ? (
          <EmptyState icon="🗂️" title="No categories yet" description="Create your first category to get started." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-bakery-100 bg-white dark:border-bakery-800 dark:bg-bakery-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-bakery-50 text-xs uppercase tracking-wide text-bakery-500 dark:bg-bakery-900 dark:text-cream-300/60">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Image</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Products</th>
                  <th className="px-5 py-3">Visible</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bakery-100 dark:divide-bakery-700">
                {categories.map((cat, idx) => (
                  <tr key={cat.id} className="text-bakery-800 dark:text-cream-100">
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-xs disabled:opacity-30">▲</button>
                        <button onClick={() => move(idx, 1)} disabled={idx === categories.length - 1} className="text-xs disabled:opacity-30">▼</button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {cat.image ? (
                        <img src={resolveImageUrl(cat.image)} alt={cat.name} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bakery-100 dark:bg-bakery-700">🍞</div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold">{cat.name}</td>
                    <td className="px-5 py-3">{cat._count?.menuItems ?? 0}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleVisibility(cat)}
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          cat.isVisible
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-bakery-100 text-bakery-500 dark:bg-bakery-700 dark:text-cream-300/60'
                        }`}
                      >
                        {cat.isVisible ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEdit(cat)} className="mr-3 text-bakery-600 hover:underline dark:text-bakery-300">Edit</button>
                      <button onClick={() => setDeleteTarget(cat)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <form
            onSubmit={handleSave}
            className="animate-scale-in w-full max-w-lg rounded-2xl bg-white p-6 shadow-card dark:bg-bakery-800 sm:p-8"
          >
            <h2 className="font-display text-xl font-bold text-bakery-900 dark:text-cream-50">
              {form.id ? 'Edit Category' : 'Add Category'}
            </h2>

            <div className="mt-6 space-y-4">
              <ImageUploader
                label="Category Image (optional)"
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
              <label className="flex items-center gap-2 text-sm font-semibold text-bakery-700 dark:text-cream-200">
                <input
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(e) => setForm((f) => ({ ...f, isVisible: e.target.checked }))}
                  className="h-4 w-4 rounded"
                />
                Visible on website
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-full px-4 py-2 text-sm font-semibold text-bakery-700 hover:bg-bakery-100 dark:text-cream-200 dark:hover:bg-bakery-700">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category?"
        message={`This will permanently delete "${deleteTarget?.name}". Products in this category will become uncategorized.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
