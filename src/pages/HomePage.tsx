import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/home/Hero';
import { TrustBar } from '../components/home/TrustBar';
import { ServicesOverview } from '../components/home/ServicesOverview';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ProcessTimeline } from '../components/home/ProcessTimeline';
import { TeamIntro } from '../components/home/TeamIntro';
import { Testimonials } from '../components/home/Testimonials';
import { VergoedingenSummary } from '../components/home/VergoedingenSummary';
import { MultiStepForm } from '../components/intake/MultiStepForm';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Parkstad Thuiszorg | Persoonlijke thuiszorg met hart</title>
        <meta name="description" content="Parkstad Thuiszorg biedt persoonlijke, professionele thuiszorg en verpleging in Landgraaf, Heerlen, Kerkrade en omgeving. Gratis intakegesprek." />
      </Helmet>
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <WhyChooseUs />
      <ProcessTimeline />
      <TeamIntro />
      <Testimonials />
      <VergoedingenSummary />
      
      <section id="contact" className="section-padding bg-[var(--color-beige-200)] dark:bg-[var(--color-sage-900)]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-heading text-[var(--color-sage-800)] dark:text-white mb-6">
              Neem direct contact op
            </h2>
            <p className="text-lg text-[var(--color-sage-600)] dark:text-[var(--color-sage-200)]">
              Liever bellen? Wij zijn direct bereikbaar op <a href="tel:+31612345678" className="font-bold underline hover:text-[var(--color-sage-500)] text-[var(--color-sage-500)]">06 1234 5678</a>. U kunt ook veilig en snel het formulier hieronder invullen en wij bellen u binnen 24 uur terug (vaak nog dezelfde dag).
            </p>
          </div>
          <MultiStepForm />
        </div>
      </section>
    </>
  );
}
