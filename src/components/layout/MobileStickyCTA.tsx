import { Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero (approx 300px)
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#1a2420] border-t border-gray-200 dark:border-[#344a3c] p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] md:hidden flex gap-3"
        >
          <a
            href="tel:+31612345678"
            className="flex-1 flex items-center justify-center gap-2 bg-[#f0f5f1] dark:bg-[#243029] text-[#2d3b2d] dark:text-[#fdfbf7] py-3 px-4 rounded-xl font-medium transition-colors border border-[#dce8de] dark:border-[#344a3c]"
          >
            <Phone className="w-5 h-5 text-[#5b7f63]" />
            <span className="text-sm">Bel Direct</span>
          </a>
          
          <Link
            to="/contact"
            className="flex-1 flex items-center justify-center gap-2 bg-[#C67D5B] text-white py-3 px-4 rounded-xl font-medium shadow-md hover:bg-[#b8623e] transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Intake</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
