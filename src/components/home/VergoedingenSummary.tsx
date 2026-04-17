import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export function VergoedingenSummary() {
  return (
    <section id="vergoedingen" className="section-padding bg-white dark:bg-[#02191c]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-[var(--color-sage-500)]"
            >
              <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center text-white">
                <h3 className="text-3xl font-heading mb-6">Volledig vergoed door uw zorgverzekeraar</h3>
                <p className="text-lg opacity-90 mb-8">Wij hebben contracten met vrijwel alle zorgverzekeraars. Wijkverpleging valt onder het basispakket, wat betekent dat u geen eigen risico betaalt.</p>
                <ul className="space-y-4">
                  {['Zorgverzekeringswet (Zvw)', 'Wet langdurige zorg (Wlz)', 'Persoonsgebonden budget (Pgb)', 'Geen eigen risico via Zvw'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#25D366]" />
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-heading text-[var(--color-sage-800)] dark:text-white mb-6">
              Heldere afspraken over uw vergoeding
            </h2>
            <p className="text-lg text-[var(--color-sage-600)] dark:text-[var(--color-sage-200)] mb-8">
              Zorg aanvragen kan soms overweldigend zijn door alle regels en instanties. Wij nemen deze administratieve last graag voor u uit handen. We vertellen u precies waar u recht op heeft en regelen de aanvraag bij de wijkverpleegkundige of het CIZ.
            </p>
            <Button asChild variant="outline" size="lg">
              <a href="#contact" className="group">
                Vraag vrijblijvend advies aan
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
