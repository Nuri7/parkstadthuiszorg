"use client";

import { motion } from 'framer-motion';
import { MessageCircle, Phone, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-warm-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/60 dark:bg-[#02191c]/60 backdrop-blur-sm text-[#5b7f63] font-semibold text-sm mb-6 border border-[#7c9a82]/20">
                PGB & ZVW Thuiszorg in Parkstad
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-heading mb-6 text-[#064a54] dark:text-[#fefdfc]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Parkstad Thuiszorg <br/>
              <span className="text-[var(--color-sage-500)] text-3xl md:text-5xl lg:text-5xl mt-2 block group relative">
                Een vertrouwd gezicht, een gerust gevoel
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-sage-500)] to-[var(--color-terra-400)] rounded-full hidden lg:block"></span>
              </span>
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl text-[#4f6b6f] dark:text-[#5cb0bd] mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Warme, professionele zorg bij u thuis in Landgraaf, Heerlen, Kerkrade, Brunssum en omgeving. Een vast gezicht, oprechte aandacht en deskundige medische begeleiding — gewoon in het Limburgs als u dat fijn vindt.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button asChild variant="cta" size="lg" className="w-full sm:w-auto">
                <a href="tel:+31644745471" className="group">
                  <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Bel direct
                </a>
              </Button>
              <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
                <a href="https://wa.me/31644745471" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp ons
                </a>
              </Button>
            </motion.div>
            
            {/* New Badges Layout Below CTAs */}
            <motion.div 
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-sm font-medium text-[var(--color-sage-600)] dark:text-[var(--color-sage-300)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4A9C6E]" /> Vast zorgteam
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4A9C6E]" /> Persoonlijke aandacht
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4A9C6E]" /> Geen wachtlijst
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4A9C6E]" /> PGB & ZVW
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#4A9C6E]" /> 24/7 spoedlijn
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Decorative background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#b8d1bc]/30 dark:bg-[#5b7f63]/20 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen" />
            
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/40 dark:border-[#243029]/50 aspect-[4/3] max-w-xl mx-auto align-middle flex items-center justify-center bg-gray-100 dark:bg-gray-800">
               <img 
                 src={`/images/hero-caregiver.webp`} 
                 alt="Vriendelijke verpleegkundige drinkt thee met oudere dame in woonkamer"
                 className="w-full h-full object-cover"
                 fetchPriority="high"
               />
               
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
