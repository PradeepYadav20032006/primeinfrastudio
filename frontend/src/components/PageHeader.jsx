import { motion } from 'framer-motion';

// Reusable hero header used at the top of interior pages (About, Services, Projects, etc.)
const PageHeader = ({ title, subtitle, bgImage }) => (
  <section
    className="relative pt-40 pb-24 flex items-center justify-center text-center bg-charcoal-900"
    style={
      bgImage
        ? {
            backgroundImage: `linear-gradient(rgba(10,12,16,0.75), rgba(10,12,16,0.85)), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : {}
    }
  >
    <div className="container-custom">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-tag !text-amber-500"
      >
        {subtitle}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-display font-bold text-white"
      >
        {title}
      </motion.h1>
    </div>
  </section>
);

export default PageHeader;
