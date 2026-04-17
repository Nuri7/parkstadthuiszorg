import { AnimatedSection } from '../ui/AnimatedSection';
import { Heart, Users2, Clock, CheckCircle2 } from 'lucide-react';

export function WhyChooseUs() {
  const benefits = [
    {
      title: 'Vaste Zorgverlener',
      description: 'Geen continue wisseling van gezichten. U krijgt vaste, vertrouwde zorgverleners over de vloer.',
      icon: Users2
    },
    {
      title: 'Met Liefde & Aandacht',
      description: 'Wij nemen de tijd. Niet alleen voor de medische handeling, maar ook voor een praatje en een kopje thee.',
      icon: Heart
    },
    {
      title: 'Geen Wachtlijsten',
      description: 'Zorg is vaak direct nodig. Wij streven ernaar de zorg binnen 48 uur op te starten na de intake.',
      icon: Clock
    },
    {
      title: 'Lokaal Betrokken',
      description: 'Als organisatie uit de regio kennen we de cultuur en spreken we letterlijk en figuurlijk dezelfde taal.',
      icon: CheckCircle2
    }
  ];

  return (
    <section id="waarom-ons" className="section-padding bg-[#e5f2f4] dark:bg-[#02191c] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-white/40 dark:bg-black/10 blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-5/12">
            <AnimatedSection>
              <h2 className="text-[#4A9C6E] font-semibold tracking-wider text-sm uppercase mb-3">Waarom Parkstad Thuiszorg</h2>
              <h3 className="text-3xl md:text-4xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
                Persoonlijk, warm en betrouwbaar
              </h3>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg mb-8">
                Grote zorgorganisaties voelen vaak onpersoonlijk. Wij doen het anders. Wij zien de mens achter de cliënt en stemmen onze zorg af op úw ritme, niet andersom.
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-[#243029] flex-shrink-0 flex items-center justify-center shadow-sm">
                      <benefit.icon className="w-6 h-6 text-[#7c9a82] dark:text-[#5b7f63]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#064a54] dark:text-[#fefdfc] mb-2">{benefit.title}</h4>
                      <p className="text-[#4f6b6f] dark:text-[#5cb0bd]">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          <div className="w-full lg:w-7/12 relative">
            <AnimatedSection delay={0.2} className="relative z-10 rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
              <img 
                src={`${import.meta.env.BASE_URL}images/team-group.webp`} 
                alt="Het team van Parkstad Thuiszorg lacht in een tuin" 
                className="w-full h-full object-cover"
              />
            </AnimatedSection>
            
            {/* Decorative offset card */}
             <AnimatedSection delay={0.4} className="absolute -bottom-8 -left-8 md:bottom-12 md:-left-12 z-20 hidden sm:block">
              <div className="bg-white dark:bg-[#064a54] p-6 rounded-2xl shadow-xl border border-[#ede7db] dark:border-[#086370] max-w-[280px]">
                <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#fdf4ef] dark:bg-[#3f1f14] flex-shrink-0 flex items-center justify-center">
                   <Clock className="w-5 h-5 text-[#4A9C6E]" />
                 </div>
                 <div>
                   <div className="font-bold text-[#064a54] dark:text-[#fefdfc]">Snel Zorg Nodig?</div>
                   <div className="text-sm text-[#4f6b6f] dark:text-[#5cb0bd] mt-1">Start de aanvraag online en wij nemen binnen 24 uur contact op.</div>
                 </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
          
        </div>
      </div>
    </section>
  );
}
