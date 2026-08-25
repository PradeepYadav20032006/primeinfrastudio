import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import api from '../utils/api';

const FALLBACK = [
  { _id: 't1', clientName: 'Rohan Deshmukh', clientRole: 'Homeowner, Baner', rating: 5, message: 'PrimeInfraStudio transformed our vision into a stunning reality. Their attention to detail is unmatched.' },
  { _id: 't2', clientName: 'Anjali Kulkarni', clientRole: 'Business Owner, Koregaon Park', rating: 5, message: 'Professional, punctual, and genuinely talented. Our penthouse interiors exceeded expectations.' },
  { _id: 't3', clientName: 'Vikram Joshi', clientRole: 'Director, Horizon Corp', rating: 5, message: 'From planning to handover, the team kept us informed at every stage. Highly recommended for commercial projects.' },
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(FALLBACK);

  useEffect(() => {
    api
      .get('/testimonials?limit=50')
      .then((res) => res.data.data.length && setTestimonials(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <SEO title="Testimonials" description="Read what PrimeInfraStudio's clients have to say about our construction and interior design services." />
      <PageHeader subtitle="Client Stories" title="What Our Clients Say" bgImage="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600" />

      <section className="section-padding bg-white dark:bg-charcoal-950">
        <div className="container-custom grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-hover bg-charcoal-50 dark:bg-charcoal-900 rounded-2xl p-8 border border-charcoal-100 dark:border-charcoal-800 relative"
            >
              <Quote size={32} className="text-amber-200 dark:text-amber-900 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={16} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-charcoal-600 dark:text-charcoal-300 mb-6 leading-relaxed">"{t.message}"</p>
              <div className="flex items-center gap-3">
                {t.clientImage ? (
                  <img src={t.clientImage} alt={t.clientName} className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold">
                    {t.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-charcoal-900 dark:text-white">{t.clientName}</p>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-400">{t.clientRole}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Testimonials;
