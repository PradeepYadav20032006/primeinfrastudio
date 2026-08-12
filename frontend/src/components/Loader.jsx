import { motion } from 'framer-motion';

// Full-page loading animation shown during initial app load / route transitions
const Loader = () => (
  <div className="fixed inset-0 z-[100] bg-white dark:bg-charcoal-950 flex flex-col items-center justify-center gap-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-amber-600"
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-charcoal-500 dark:text-charcoal-400 text-sm tracking-widest uppercase"
    >
      PrimeInfraStudio
    </motion.p>
  </div>
);

export const Spinner = ({ size = 20 }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    style={{ width: size, height: size }}
    className="rounded-full border-2 border-white/30 border-t-white"
  />
);

export default Loader;
