import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/home/Hero';
import { TrustBar } from '../components/home/TrustBar';
import { ServicesOverview } from '../components/home/ServicesOverview';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { Testimonials } from '../components/home/Testimonials';
import { TeamIntro } from '../components/home/TeamIntro';
import { IntakeTeaser } from '../components/home/IntakeTeaser';

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
      <Testimonials />
      <TeamIntro />
      <IntakeTeaser />
    </>
  );
}
