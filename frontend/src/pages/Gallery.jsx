import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Lightbox from '../components/Lightbox';
import api from '../utils/api';

// Local images
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import image4 from '../assets/images/image4.jpg';
import image5 from '../assets/images/image5.jpg';

const CATEGORIES = ['All', 'Interior', 'Exterior', 'Construction', 'Renovation', 'Landscape'];

const FALLBACK_IMAGES = [
  { _id: 'g1', title: 'Living Room Interior', category: 'Interior', image: image1 },
  { _id: 'g2', title: 'Villa Exterior', category: 'Exterior', image: image2 },
  { _id: 'g3', title: 'Construction Site', category: 'Construction', image: image3 },
  { _id: 'g4', title: 'Kitchen Renovation', category: 'Renovation', image: image4 },
  { _id: 'g5', title: 'Garden Landscape', category: 'Landscape', image: image5 },
  { _id: 'g6', title: 'Office Interior', category: 'Interior', image: image1 },
  { _id: 'g7', title: 'Commercial Building', category: 'Exterior', image: image2 },
  { _id: 'g8', title: 'Bedroom Suite', category: 'Interior', image: image3 },
];

const Gallery = () => {
  const [images, setImages] = useState(FALLBACK_IMAGES);
  const [category, setCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    api
      .get('/gallery?limit=100')
      .then((res) => res.data.data.length && setImages(res.data.data))
      .catch(() => {});
  }, []);

  const filtered = category === 'All' ? images : images.filter((img) => img.category === category);

  return (
    <>
      <SEO title="Gallery" description="Browse photos of PrimeInfraStudio's construction and interior design work across Pune, Maharashtra." />
      <PageHeader subtitle="Visual Showcase" title="Our Gallery" bgImage={image4} />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === c
                    ? 'bg-amber-600 text-white'
                    : 'bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-200 hover:bg-charcoal-200 dark:hover:bg-charcoal-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <motion.button
                key={img._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                onClick={() => setLightboxIndex(i)}
                className="block w-full break-inside-avoid rounded-xl overflow-hidden group relative"
              >
                <img src={img.image} alt={img.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-4">
                  <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{img.title}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={filtered.map((f) => f.image)}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % filtered.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length)}
      />
    </>
  );
};

export default Gallery;
