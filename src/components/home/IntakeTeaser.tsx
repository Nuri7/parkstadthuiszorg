import { Link } from 'react-router-dom';
import { MessageSquarePlus, Stethoscope, Handshake, HeartPulse } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { Button } from '../ui/Button';

export function IntakeTeaser() {
  const steps = [
    {
      icon: MessageSquarePlus,
      title: "1. Neem Contact Op",
      text: "Bel ons direct of vul het eenvoudige online formulier in."
    },
    {
      icon: Stethoscope,
      title: "2. Inventarisatie",
      text: "Wij plannen binnen 24 uur een vrijblijvend intakegesprek in, bij u thuis of telefonisch."
    },
    {
      icon: Handshake,
      title: "3. Zorgplan",
      text: "Samen stellen we een zorgplan op dat naadloos aansluit op uw behoeften en ritme."
    },
    {
      icon: HeartPulse,
      title: "4. Zorg Start",
      text: "Onze vaste verpleegkundigen of verzorgenden komen bij u langs en de zorg begint."
    }
  ];

  return (
    <section className="section-padding bg-white dark:bg-[#1e2e25]">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[#4A9C6E] font-semibold tracking-wider text-sm uppercase mb-3">Hoe Werkt Het?</h2>
          <h3 className="text-3xl md:text-4xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
            In 4 eenvoudige stappen zorg geregeld
          </h3>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg">
            Wij begrijpen dat het regelen van thuiszorg overweldigend kan zijn. Daarom hebben we het proces zo drempelvrij mogelijk gemaakt. U kunt altijd rekenen op onze begeleiding.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (hidden on mobile, visible on lg screens) */}
          <div className="hidden lg:block absolute top-[2.5rem] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#dce8de] via-[#7c9a82] to-[#dce8de] dark:from-[#086370] dark:via-[#5b7f63] dark:to-[#086370] z-0" />

          {steps.map((step, index) => (
            <AnimatedSection key={index} delay={index * 0.15} className="relative z-10 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-[#243029] shadow-lg border-2 border-[#e5f2f4] dark:border-[#086370] mx-auto flex items-center justify-center mb-6 relative group transition-transform hover:-translate-y-1">
                <step.icon className="w-8 h-8 text-[#5b7f63] dark:text-[#7c9a82]" />
                
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#4A9C6E] text-white flex items-center justify-center font-bold text-sm border-4 border-white dark:border-[#1e2e25]">
                  {index + 1}
                </div>
              </div>
              <h4 className="text-xl font-bold text-[#064a54] dark:text-[#fefdfc] mb-3">
                {step.title.substring(3)} {/* Remove "1. " from title here as we show it in the badge */}
              </h4>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd]">
                {step.text}
              </p>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.6} className="mt-16 text-center">
          <div className="bg-[#e5f2f4] dark:bg-[#243029] p-8 md:p-10 rounded-3xl inline-block max-w-3xl border border-[#dce8de] dark:border-[#086370]">
            <h4 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">Direct zorg nodig?</h4>
            <p className="text-[#4f6b6f] dark:text-[#5cb0bd] mb-8">
              Wacht niet langer met het ongemak of de zorgen. Wij helpen uw indicatie (PGB/ZVW) aan te vragen. Dat is het mooie van volledige ontzorging.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="primary" size="lg">
                <Link to="/contact">Intake Aanvragen</Link>
              </Button>
               <Button asChild variant="outline" size="lg" className="bg-white dark:bg-[#02191c]">
                <a href="tel:+31644745471">Bel Ons Direct</a>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
