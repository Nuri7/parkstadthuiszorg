import { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingContact() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling past the hero section
    const handleScroll = () => {
      if (window.scrollY > 400) {
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
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 md:hidden"
        >
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/31612345678"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] transition-colors"
            aria-label="Stuur een WhatsApp bericht"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
          
          {/* Phone Button */}
          <a
            href="tel:+31612345678"
            className="w-14 h-14 bg-[var(--color-sage-500)] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--color-sage-600)] transition-colors"
            aria-label="Bel Parkstad Thuiszorg"
          >
            <Phone className="w-6 h-6" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
