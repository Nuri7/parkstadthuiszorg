import { AnimatedSection } from '../ui/AnimatedSection';
import { Heart, Coffee, ShieldCheck, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '../ui/Button';

export function MantelzorgSection() {
  const supports = [
    {
      icon: Coffee,
      title: 'Respijtzorg',
      description: 'Wij nemen de zorg tijdelijk over, zodat u even op adem kunt komen. Een weekendje weg of gewoon een rustige middag — u verdient het.'
    },
    {
      icon: ShieldCheck,
      title: 'Professionele Ondersteuning',
      description: 'Onze verpleegkundigen verlichten uw dagelijkse zorgtaken: persoonlijke verzorging, medicatie, maaltijdbereiding en meer.'
    },
    {
      icon: Heart,
      title: 'Emotionele Steun',
      description: 'Mantelzorg is zwaar. Wij bieden een luisterend oor en helpen u bij het vinden van de juiste balans tussen zorgen en leven.'
    }
  ];

  return (
    <section id="mantelzorg" className="section-padding bg-[#e5f2f4] dark:bg-[#02191c] relative overflow-hidden">
      <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[80%] rounded-full bg-white/30 dark:bg-black/10 blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2">
            <AnimatedSection>
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#E8734A]/10 text-[#E8734A] font-semibold text-sm mb-4 border border-[#E8734A]/20">
                Voor Mantelzorgers
              </span>
              <h2 className="text-3xl md:text-4xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
                Zorgt u voor een naaste? Dan zorgen wij voor <span className="text-gradient">ú</span>.
              </h2>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg mb-8 leading-relaxed">
                Als mantelzorger geeft u elke dag het beste van uzelf. Maar wie zorgt er voor ú? 
                Bij Parkstad Thuiszorg ondersteunen we niet alleen de cliënt, maar ook de mantelzorger. 
                U hoeft het niet alleen te doen — en hulp vragen is geen zwakte, maar wijsheid.
              </p>
              
              <div className="space-y-6 mb-8">
                {supports.map((support, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-[#243029] flex-shrink-0 flex items-center justify-center shadow-sm">
                      <support.icon className="w-6 h-6 text-[#E8734A]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#064a54] dark:text-[#fefdfc] mb-1">{support.title}</h4>
                      <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-sm">{support.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="cta" size="md">
                  <a href="tel:+31644745471" className="group">
                    <Phone className="w-4 h-4 mr-2" />
                    Bel voor respijtzorg
                  </a>
                </Button>
                <Button asChild variant="outline" size="md">
                  <Link href="/#contact" className="group">
                    Vraag ondersteuning aan
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>

          <div className="w-full lg:w-1/2">
            <AnimatedSection delay={0.2}>
              <div className="bg-white dark:bg-[#243029] p-8 md:p-10 rounded-3xl shadow-xl border border-[#ede7db] dark:border-[#086370]">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto bg-[#fdf4ef] dark:bg-[#3f1f14] rounded-2xl flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-[#E8734A]" />
                  </div>
                  <h3 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-2">Herkenbaar?</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    'U bezoekt uw ouder(s) dagelijks en het begint te zwaar te worden',
                    'U combineert mantelzorg met een baan en/of eigen gezin',
                    'U voelt zich schuldig als u hulp vraagt',
                    'U maakt zich zorgen over de veiligheid van uw naaste overdag of \'s nachts',
                    'U heeft behoefte aan professioneel advies over de juiste zorgvorm',
                    'U wilt weten hoe u WMO of PGB kunt aanvragen'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#4f6b6f] dark:text-[#5cb0bd]">
                      <span className="text-[#E8734A] mt-1 text-lg">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 p-4 bg-[#fdf4ef] dark:bg-[#3f1f14]/30 rounded-xl border border-[#E8734A]/10">
                  <p className="text-sm text-[#064a54] dark:text-[#fefdfc] font-medium text-center">
                    Wij helpen u graag bij het regelen van de juiste zorg en vergoedingen — <strong>kosteloos en vrijblijvend</strong>.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
          
        </div>
      </div>
    </section>
  );
}
