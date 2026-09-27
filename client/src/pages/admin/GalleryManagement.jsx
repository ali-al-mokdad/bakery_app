import { useEffect, useRef, useState } from 'react';
import { galleryService } from '../../services/galleryService';
import { uploadService } from '../../services/uploadService';
import { useToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { resolveImageUrl } from '../../services/api';

export default function GalleryManagement() {
  const { showToast } = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingCaption, setEditingCaption] = useState(null);
  const [captionValue, setCaptionValue] = useState('');
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await galleryService.getAll({ all: true });
      setImages(data);
    } catch (err) {
      showToast('Failed to load gallery.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await uploadService.uploadMultiple(files);
      const paths = uploaded.map((u) => u.path);
      await galleryService.create({ images: paths });
      showToast(`${paths.length} image(s) added to gallery.`);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload images.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await galleryService.remove(deleteTarget.id);
      showToast('Image deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast('Failed to delete image.', 'error');
    }
  };

  const toggleVisibility = async (img) => {
    try {
      await galleryService.update(img.id, { isVisible: !img.isVisible });
      load();
    } catch (err) {
      showToast('Failed to update visibility.', 'error');
    }
  };

  const startEditCaption = (img) => {
    setEditingCaption(img.id);
    setCaptionValue(img.caption || '');
  };

  const saveCaption = async (img) => {
    try {
      await galleryService.update(img.id, { caption: captionValue });
      setEditingCaption(null);
      load();
    } catch (err) {
      showToast('Failed to update caption.', 'error');
    }
  };

  const move = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    setImages(reordered);
    try {
      await galleryService.reorder(reordered.map((img, idx) => ({ id: img.id, displayOrder: idx })));
    } catch (err) {
      showToast('Failed to reorder gallery.', 'error');
      load();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-bakery-900 dark:text-cream-50">
            Gallery Management
          </h1>
          <p className="mt-1 text-sm text-bakery-500 dark:text-cream-300/60">
            Upload and manage bakery gallery images
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-primary disabled:opacity-60"
        >
          {uploading ? 'Uploading...' : '+ Upload Images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <Spinner />
        ) : images.length === 0 ? (
          <EmptyState icon="🖼️" title="No gallery images yet" description="Upload images to showcase your bakery." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, idx) => (
              <div key={img.id} className="card overflow-hidden">
                <div className="relative aspect-video">
                  <img src={resolveImageUrl(img.image)} alt={img.caption || ''} className="h-full w-full object-cover" />
                  <div className="absolute right-2 top-2 flex gap-1">
                    <button onClick={() => move(idx, -1)} disabled={idx === 0} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs disabled:opacity-40">▲</button>
                    <button onClick={() => move(idx, 1)} disabled={idx === images.length - 1} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs disabled:opacity-40">▼</button>
                  </div>
                </div>
                <div className="p-4">
                  {editingCaption === img.id ? (
                    <div className="flex gap-2">
                      <input
                        className="input !py-1.5"
                        value={captionValue}
                        onChange={(e) => setCaptionValue(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => saveCaption(img)} className="text-xs font-bold text-bakery-600">Save</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditCaption(img)}
                      className="text-left text-sm text-bakery-700 hover:underline dark:text-cream-200"
                    >
                      {img.caption || <span className="italic text-bakery-400">Add caption...</span>}
                    </button>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => toggleVisibility(img)}
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        img.isVisible
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-bakery-100 text-bakery-500 dark:bg-bakery-700 dark:text-cream-300/60'
                      }`}
                    >
                      {img.isVisible ? 'Visible' : 'Hidden'}
                    </button>
                    <button onClick={() => setDeleteTarget(img)} className="text-xs font-semibold text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete image?"
        message="This will permanently delete this gallery image."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
