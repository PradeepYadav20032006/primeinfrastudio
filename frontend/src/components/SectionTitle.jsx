import { motion } from 'framer-motion';

const SectionTitle = ({ tag, title, description, center = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`max-w-2xl mb-12 ${center ? 'mx-auto text-center' : ''}`}
  >
    {tag && <span className="section-tag">{tag}</span>}
    <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal-900 dark:text-white mb-4">{title}</h2>
    {description && <p className="text-charcoal-500 dark:text-charcoal-400">{description}</p>}
  </motion.div>
);

export default SectionTitle;
