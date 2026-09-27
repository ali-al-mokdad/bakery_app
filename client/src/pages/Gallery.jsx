import { useEffect, useState } from 'react';
import { galleryService } from '../services/galleryService';
import GalleryGrid from '../components/GalleryGrid';
import Spinner from '../components/Spinner';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryService
      .getAll()
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="section-title">Our Gallery</h1>
          <p className="mt-3 text-bakery-600/80 dark:text-cream-300/70">
            A closer look at our bakery, creations, and moments
          </p>
        </div>
        {loading ? <Spinner /> : <GalleryGrid images={images} />}
      </div>
    </div>
  );
}
