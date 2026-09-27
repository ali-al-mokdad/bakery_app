import { useRef, useState } from 'react';
import { uploadService } from '../services/uploadService';
import { resolveImageUrl } from '../services/api';
import { useToast } from './Toast';

/**
 * Single-image uploader with preview. Calls onUploaded(path) once the file
 * has been uploaded to the server (path is the stored "/uploads/xyz" path).
 */
export default function ImageUploader({ value, onUploaded, label = 'Image' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { showToast } = useToast();

  const handleFile = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await uploadService.uploadImage(file);
      onUploaded(result.path);
    } catch (err) {
      showToast(err.response?.data?.message || 'Image upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const displayImage = preview || resolveImageUrl(value);

  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        className="group relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-bakery-300 bg-bakery-50 transition hover:border-bakery-500 dark:border-bakery-700 dark:bg-bakery-900"
      >
        {displayImage ? (
          <img src={displayImage} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-bakery-500 dark:text-cream-300/60">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h16M4 4h16v16H4V4z"
              />
            </svg>
            <span className="text-xs font-semibold">Click to upload image</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
