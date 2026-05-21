"use client";

import { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingContact() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
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
          {/* WhatsApp Button — with pulse animation */}
          <a
            href="https://wa.me/31644745471"
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#128C7E] transition-colors animate-pulse-soft"
            aria-label="Stuur een WhatsApp bericht"
          >
            <MessageCircle className="w-7 h-7" />
          </a>
          
          {/* Phone Button */}
          <a
            href="tel:+31644745471"
            className="w-16 h-16 bg-[#E8734A] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#D4603A] transition-colors"
            aria-label="Bel Parkstad Thuiszorg"
          >
            <Phone className="w-7 h-7" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
