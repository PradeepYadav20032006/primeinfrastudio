import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => (
  <>
    <SEO title="Page Not Found" description="The page you are looking for could not be found." />
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-charcoal-950 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center container-custom"
      >
        <h1 className="text-8xl md:text-9xl font-display font-bold text-amber-600 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-charcoal-900 dark:text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-charcoal-500 dark:text-charcoal-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <Home size={18} /> Back to Home
        </Link>
      </motion.div>
    </section>
  </>
);

export default NotFound;
