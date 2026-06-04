import { Hero } from '@/components/home/Hero';
import { TrustBar } from '@/components/home/TrustBar';
import { ServicesOverview } from '@/components/home/ServicesOverview';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { MantelzorgSection } from '@/components/home/MantelzorgSection';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import { TeamIntro } from '@/components/home/TeamIntro';
import { VergoedingenSummary } from '@/components/home/VergoedingenSummary';
import { MultiStepForm } from '@/components/intake/MultiStepForm';

export default function HomePage() {
  return (
    <>
      
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <WhyChooseUs />
      <MantelzorgSection />
      <ProcessTimeline />
      <TeamIntro />
      {/* <Testimonials /> — tijdelijk uit: tonen zodra er échte cliëntreviews zijn. Vul src/data/testimonials.ts en zet deze regel terug. */}
      <VergoedingenSummary />
      
      <section id="contact" className="section-padding bg-[var(--color-beige-200)] dark:bg-[var(--color-sage-900)]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading text-[var(--color-sage-800)] dark:text-white mb-6">
              Neem direct contact op
            </h2>
            <p className="text-lg text-[var(--color-sage-600)] dark:text-[var(--color-sage-200)]">
              Liever bellen? Wij zijn direct bereikbaar op <a href="tel:+31626591818" className="font-bold underline hover:text-[var(--color-sage-500)] text-[var(--color-sage-500)]">06 26 59 18 18</a>. U kunt ook veilig en snel het formulier hieronder invullen en wij bellen u binnen 24 uur terug (vaak nog dezelfde dag).
            </p>
          </div>
          <MultiStepForm />
        </div>
      </section>
    </>
  );
}
