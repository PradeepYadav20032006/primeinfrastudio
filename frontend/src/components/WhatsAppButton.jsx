import { motion } from 'framer-motion';
import { COMPANY } from '../utils/constants';

const WhatsAppButton = () => {
  const message = encodeURIComponent("Hi PrimeInfraStudio, I'd like to know more about your services.");
  return (
    <motion.a
      href={`https://wa.me/${COMPANY.phoneRaw}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-green-600/30 flex items-center justify-center text-white"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor">
        <path d="M16.001 0C7.164 0 0 7.163 0 16c0 2.822.735 5.474 2.02 7.771L.06 32l8.418-1.968A15.9 15.9 0 0 0 16.001 32C24.837 32 32 24.837 32 16S24.837 0 16.001 0zm0 29.09c-2.554 0-4.94-.755-6.94-2.05l-.498-.31-5.15 1.204 1.223-5.02-.324-.516A12.95 12.95 0 0 1 2.91 16c0-7.22 5.87-13.09 13.091-13.09 7.22 0 13.09 5.87 13.09 13.09 0 7.221-5.87 13.09-13.09 13.09zm7.15-9.79c-.39-.196-2.31-1.14-2.668-1.27-.357-.13-.617-.196-.877.196-.26.39-1.006 1.27-1.234 1.53-.227.26-.454.293-.844.098-.39-.195-1.646-.606-3.135-1.933-1.159-1.034-1.942-2.31-2.17-2.7-.227-.39-.024-.6.171-.795.176-.175.39-.455.585-.683.195-.227.26-.39.39-.65.13-.26.065-.487-.033-.683-.098-.195-.877-2.115-1.202-2.895-.316-.76-.638-.657-.877-.67-.227-.01-.487-.012-.747-.012-.26 0-.683.098-1.04.487-.357.39-1.365 1.334-1.365 3.253 0 1.92 1.397 3.775 1.592 4.036.195.26 2.75 4.2 6.665 5.888.932.402 1.658.642 2.225.822.934.298 1.784.256 2.457.155.75-.112 2.31-.944 2.635-1.856.325-.911.325-1.692.227-1.856-.098-.163-.357-.26-.747-.455z" />
      </svg>
    </motion.a>
  );
};

export default WhatsAppButton;
