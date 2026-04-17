import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
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
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/60 dark:bg-[#1a2420]/60 backdrop-blur-sm text-[#5b7f63] font-semibold text-sm mb-6 border border-[#7c9a82]/20">
                PGB & ZVW Thuiszorg in Parkstad
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-heading mb-6 text-[#2d3b2d] dark:text-[#fdfbf7]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Persoonlijke thuiszorg <span className="text-gradient">met hart</span> in regio Parkstad
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl text-[#6B7B6B] dark:text-[#94ba9a] mb-8 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Warme, professionele zorg bij u thuis in Landgraaf, Heerlen en Kerkrade. Een vast gezicht, oprechte aandacht en deskundige medische begeleiding.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
                <Link to="/contact" className="group">
                  Start Aanvraag
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 dark:bg-transparent backdrop-blur-sm">
                <a href="tel:+31612345678">
                  <Phone className="w-5 h-5 mr-2" />
                  Bel 06 1234 5678
                </a>
              </Button>
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
                 src={`${import.meta.env.BASE_URL}images/hero-caregiver.webp`} 
                 alt="Vriendelijke verpleegkundige drinkt thee met oudere dame in woonkamer"
                 className="w-full h-full object-cover"
               />
               
               {/* Floating elements */}
               <motion.div
                 className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 flex items-center gap-4 animate-float"
                 style={{ animationDelay: '0s' }}
               >
                 <div className="w-12 h-12 rounded-full bg-[#fdf4ef] flex items-center justify-center">
                   <div className="text-[#C67D5B] font-bold text-xl">5★</div>
                 </div>
                 <div>
                   <div className="text-sm font-bold text-[#2d3b2d] dark:text-[#fdfbf7]">Google Reviews</div>
                   <div className="text-xs text-[#5b7f63] dark:text-[#94ba9a]">Wordt aanbevolen</div>
                 </div>
               </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
