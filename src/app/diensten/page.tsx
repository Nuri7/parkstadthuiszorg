import { CheckCircle2, Stethoscope, HeartHandshake, Flower2, BrainCircuit, Moon, Pill, Activity, HandHeart } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { services } from '@/data/services';

export const metadata = {
  alternates: {
    canonical: "/diensten",
  },
  title: "Onze Zorgvormen & Diensten | Parkstad Thuiszorg",
  description: "Bekijk ons zorgaanbod: van wijkverpleging en persoonlijke verzorging tot palliatieve zorg en nachtzorg in Landgraaf, Heerlen en Kerkrade.",
};


const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  HeartHandshake,
  Flower2,
  BrainCircuit,
  Moon,
  Pill,
  Activity,
  HandHeart
};

export default function DienstenPage() {
  return (
    <div className="pt-32 pb-20 bg-warm-gradient min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
            Onze <span className="text-gradient">Zorgvormen</span>
          </h1>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg md:text-xl">
            Bij Parkstad Thuiszorg bieden we een breed pakket aan diensten. Altijd afgestemd op uw persoonlijke behoeften, ritme en wensen. Lees hieronder meer over wat we voor u kunnen betekenen.
          </p>
        </AnimatedSection>

        <div className="space-y-12 md:space-y-24">
          {services.map((service, index) => {
             const IconComponent = iconMap[service.icon] || HeartHandshake;
             const isEven = index % 2 === 0;

             return (
               <AnimatedSection 
                 key={service.id} 
                 id={service.id}
                 className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
               >
                 <div className="w-full lg:w-1/2">
                    <div className="bg-white dark:bg-[#243029] p-8 md:p-10 rounded-[2rem] shadow-xl border border-[#ede7db] dark:border-[#086370] relative">
                      <div className="w-16 h-16 rounded-2xl bg-[#e5f2f4] dark:bg-[#02191c] flex items-center justify-center mb-6 absolute -top-8 -left-4 md:-left-8 shadow-lg">
                        <IconComponent className="w-8 h-8 text-[#5b7f63] dark:text-[#7c9a82]" />
                      </div>
                      
                      <h2 className="text-3xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4 mt-4">{service.title}</h2>
                      <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg mb-8 leading-relaxed">
                        {service.fullDescription}
                      </p>
                      
                      <h3 className="font-semibold text-[#064a54] dark:text-[#dce8de] mb-4">Wat kunt u verwachten?</h3>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-3 text-[#4f6b6f] dark:text-[#5cb0bd]">
                            <CheckCircle2 className="w-5 h-5 text-[#4A9C6E] shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                 </div>
                 
                 <div className="w-full lg:w-1/2 flex justify-center">
                    {/* Abstract design representation instead of generic images for every service to save loading time/requests */}
                    <div className="w-full max-w-md aspect-square bg-[#e5f2f4] dark:bg-[#02191c] rounded-[3rem] relative overflow-hidden flex items-center justify-center border-4 border-white dark:border-[#243029] shadow-2xl">
                      <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #5b7f63 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                      <IconComponent className="w-32 h-32 text-[#b8d1bc] dark:text-[#086370] opacity-50 relative z-10" />
                      
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#4A9C6E]/20 rounded-full blur-3xl"></div>
                      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#5b7f63]/20 rounded-full blur-3xl"></div>
                    </div>
                 </div>
               </AnimatedSection>
             );
          })}
        </div>

      </div>
    </div>
  );
}
