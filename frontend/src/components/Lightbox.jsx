import { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Simple accessible image lightbox with keyboard navigation (Esc, Arrow keys)
const Lightbox = ({ images, index, onClose, onNext, onPrev }) => {
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (index === null) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'auto';
    };
  }, [index, handleKey]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 z-10"
          >
            <X size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 text-white/80 hover:text-white p-2 z-10"
          >
            <ChevronLeft size={36} />
          </button>
          <motion.img
            key={images[index]}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            src={images[index]}
            alt={`Gallery item ${index + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Next image"
            className="absolute right-4 md:right-8 text-white/80 hover:text-white p-2 z-10"
          >
            <ChevronRight size={36} />
          </button>
          <div className="absolute bottom-6 text-white/70 text-sm">
            {index + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
