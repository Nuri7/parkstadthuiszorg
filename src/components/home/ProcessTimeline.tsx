import { motion } from 'framer-motion';
import { PhoneCall, CalendarHeart, FileHeart, HeartHandshake } from 'lucide-react';

const steps = [
  {
    icon: PhoneCall,
    title: '1. Contact',
    description: 'Neem vrijblijvend contact op via telefoon, formulier of WhatsApp. We plannen snel een afspraak.',
  },
  {
    icon: CalendarHeart,
    title: '2. Kennismaking',
    description: 'Onze wijkverpleegkundige komt bij u thuis voor een persoonlijk gesprek om uw zorgvraag helder te krijgen.',
  },
  {
    icon: FileHeart,
    title: '3. Zorgplan & Indicatie',
    description: 'We regelen de benodigde indicatie (ZVW/WMO/WLZ) en stellen samen een zorgplan op.',
  },
  {
    icon: HeartHandshake,
    title: '4. Start Zorg',
    description: 'U ontvangt direct de warme, vertrouwde zorg van ons vaste team. Altijd dichtbij wanneer u ons nodig heeft.',
  }
];

export function ProcessTimeline() {
  return (
    <section id="hoe-werkt-het" className="section-padding bg-[var(--color-beige-200)] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[var(--color-sage-500)] font-semibold tracking-wider uppercase text-sm mb-4 block">
            Hoe Werkt Het?
          </span>
          <h2 className="text-3xl md:text-5xl font-heading text-[var(--color-sage-800)] dark:text-white mb-6">
            Zorg regelen in 4 stappen
          </h2>
          <p className="text-lg text-[var(--color-sage-600)] dark:text-[var(--color-sage-300)] max-w-2xl mx-auto">
            We maken het regelen van thuiszorg zo makkelijk mogelijk voor u en uw mantelzorgers.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line connector */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-1 bg-[var(--color-beige-300)] dark:bg-[var(--color-sage-700)] -translate-x-1/2 rounded-full" />
          
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="hidden md:block w-1/2 px-12" />
                  
                  <div className="absolute left-0 md:left-1/2 -ml-2 md:-ml-0 -translate-x-0 md:-translate-x-1/2 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[var(--color-terra-400)] border-4 border-[var(--color-beige-200)] dark:border-[var(--color-sage-900)] flex items-center justify-center shadow-lg relative z-10 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className={`w-full md:w-1/2 pl-20 pr-0 md:px-12 py-2 text-left ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <h3 className="text-2xl font-bold text-[var(--color-sage-800)] dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-sage-600)] dark:text-[var(--color-sage-300)]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
