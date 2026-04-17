import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function WhatsAppButton() {
  const phoneNumber = '31612345678'; 
  const message = 'Hallo Parkstad Thuiszorg, ik zou graag meer informatie willen over de thuiszorg mogelijkheden.';
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-green-900/20 hover:bg-[#20bd5a] hover:scale-105 transition-all flex items-center justify-center"
      aria-label="Contacteer ons via WhatsApp"
      whileHover={{ y: -4 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', delay: 1 }}
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}
