import { Link } from 'react-router-dom';
import { ArrowRight, Stethoscope, HeartHandshake, Flower2, BrainCircuit, Moon, Pill } from 'lucide-react';
import { Card } from '../ui/Card';
import { AnimatedSection } from '../ui/AnimatedSection';
import { services } from '../../data/services';

const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  HeartHandshake,
  Flower2,
  BrainCircuit,
  Moon,
  Pill
};

export function ServicesOverview() {
  return (
    <section id="diensten" className="section-padding bg-white dark:bg-[#043138]">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[#4A9C6E] font-semibold tracking-wider text-sm uppercase mb-3">Onze Zorgvormen</h2>
          <h3 className="text-3xl md:text-4xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
            Zorg op maat, afgestemd op uw behoeften
          </h3>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg">
            Wij bieden een breed scala aan zorgdiensten, van dagelijkse ondersteuning tot gespecialiseerde verpleging. Alles vanuit een PGB of via uw gemeente/zorgverzekeraar.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || HeartHandshake;
            
            return (
              <AnimatedSection key={service.id} delay={index * 0.1}>
                <Card className="h-full flex flex-col group hover:border-[#7c9a82] dark:hover:border-[#5b7f63]">
                  <div className="w-14 h-14 rounded-2xl bg-[#e5f2f4] dark:bg-[#02191c] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-[#5b7f63] dark:text-[#5cb0bd]" />
                  </div>
                  <h4 className="text-xl font-heading font-semibold text-[#064a54] dark:text-[#fefdfc] mb-3">
                    {service.title}
                  </h4>
                  <p className="text-[#4f6b6f] dark:text-[#5cb0bd] flex-grow mb-6">
                    {service.shortDescription}
                  </p>
                  <Link 
                    to={`/diensten#${service.id}`}
                    className="flex items-center text-[#4A9C6E] font-medium group/link mt-auto"
                  >
                    Lees meer 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
