import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Stethoscope,
  HeartHandshake,
  Flower2,
  BrainCircuit,
  Moon,
  Pill,
  Activity,
  HandHeart,
  Phone,
  ArrowRight,
  MapPin,
  Euro,
} from 'lucide-react';

import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/Button';
import { services } from '@/data/services';
import { gemeenten, getGemeente } from '@/data/gemeenten';

export const dynamicParams = false;

export function generateStaticParams() {
  return gemeenten.map((g) => ({ gemeente: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gemeente: string }>;
}): Promise<Metadata> {
  const { gemeente: slug } = await params;
  const gemeente = getGemeente(slug);
  if (!gemeente) return {};

  const title = `Thuiszorg ${gemeente.name} — wijkverpleging & persoonlijke verzorging | Parkstad Thuiszorg`;

  return {
    title,
    description: gemeente.intro,
    alternates: {
      canonical: `/thuiszorg/${gemeente.slug}`,
    },
    openGraph: {
      title,
      description: gemeente.intro,
      url: `https://parkstadthuiszorg.nl/thuiszorg/${gemeente.slug}`,
      type: 'website',
      locale: 'nl_NL',
      siteName: 'Parkstad Thuiszorg',
    },
  };
}

const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  HeartHandshake,
  Flower2,
  BrainCircuit,
  Moon,
  Pill,
  Activity,
  HandHeart,
};

export default async function GemeentePage({
  params,
}: {
  params: Promise<{ gemeente: string }>;
}) {
  const { gemeente: slug } = await params;
  const gemeente = getGemeente(slug);
  if (!gemeente) notFound();

  const otherGemeenten = gemeenten.filter((g) => g.slug !== gemeente.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://parkstadthuiszorg.nl/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `Thuiszorg in ${gemeente.name}`,
            item: `https://parkstadthuiszorg.nl/thuiszorg/${gemeente.slug}`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: `Thuiszorg in ${gemeente.name}`,
        serviceType: 'Thuiszorg',
        description: gemeente.intro,
        areaServed: {
          '@type': 'City',
          name: gemeente.name,
        },
        provider: {
          '@type': ['MedicalBusiness', 'LocalBusiness'],
          name: 'Parkstad Thuiszorg',
          url: 'https://parkstadthuiszorg.nl',
          telephone: '+31626591818',
          email: 'info@parkstadthuiszorg.nl',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Kerkrade',
            addressRegion: 'Limburg',
            addressCountry: 'NL',
          },
        },
        availableChannel: {
          '@type': 'ServiceChannel',
          servicePhone: {
            '@type': 'ContactPoint',
            telephone: '+31626591818',
            contactType: 'customer service',
            availableLanguage: 'nl',
          },
        },
      },
    ],
  };

  return (
    <div className="pt-32 pb-20 bg-warm-gradient min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e5f2f4] dark:bg-[#02191c] text-[#086370] dark:text-[#5cb0bd] text-sm mb-6">
            <MapPin className="w-4 h-4" />
            Regio Parkstad Limburg
          </div>
          <h1 className="text-4xl md:text-5xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
            Thuiszorg in <span className="text-gradient">{gemeente.name}</span>
          </h1>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg md:text-xl mb-6">
            {gemeente.intro}
          </p>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-base md:text-lg">
            {gemeente.context}
          </p>
        </AnimatedSection>

        {/* Diensten */}
        <AnimatedSection className="mb-16">
          <h2 className="text-3xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-3 text-center">
            Onze zorgvormen in {gemeente.name}
          </h2>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-center max-w-2xl mx-auto mb-10">
            Alle zorg die wij bieden, leveren we ook bij u thuis in {gemeente.name}. Altijd
            afgestemd op uw persoonlijke behoeften, ritme en wensen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || HeartHandshake;
              return (
                <Link
                  key={service.id}
                  href={`/diensten#${service.id}`}
                  className="bg-white dark:bg-[#243029] p-6 rounded-3xl shadow-md border border-[#ede7db] dark:border-[#086370] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#e5f2f4] dark:bg-[#02191c] flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-[#5b7f63] dark:text-[#7c9a82]" />
                  </div>
                  <h3 className="text-xl font-heading text-[#064a54] dark:text-[#fefdfc]">
                    {service.title}
                  </h3>
                  <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-sm leading-relaxed flex-1">
                    {service.shortDescription}
                  </p>
                  <span className="text-[#5b7f63] dark:text-[#7c9a82] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Meer over deze zorg <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Vergoedingen */}
        <AnimatedSection className="mb-16">
          <div className="bg-white dark:bg-[#243029] p-8 md:p-10 rounded-[2rem] shadow-md border border-[#ede7db] dark:border-[#086370] max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-[#e8f0e9] dark:bg-[#1e2e25] rounded-xl text-[#5b7f63]">
                <Euro className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading text-[#064a54] dark:text-[#fefdfc]">
                Hoe wordt uw zorg in {gemeente.name} vergoed?
              </h2>
            </div>
            <p className="text-[#4f6b6f] dark:text-[#5cb0bd] leading-relaxed mb-4">
              Wijkverpleging en persoonlijke verzorging worden bekostigd vanuit uw
              basisverzekering (Zvw) — zonder eigen risico en zonder eigen bijdrage.
              Begeleiding en huishoudelijke ondersteuning lopen via de Wmo van de gemeente{' '}
              {gemeente.name}, en bij blijvende intensieve zorg kan de Wlz van toepassing
              zijn. Ook zorg vanuit een Persoonsgebonden Budget (PGB) is mogelijk; wij
              helpen u desgewenst bij de indicatiestelling en de aanvraag.
            </p>
            <Link
              href="/vergoedingen"
              className="text-[#5b7f63] dark:text-[#7c9a82] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
            >
              Alles over vergoedingen (Zvw, Wmo, Wlz, PGB)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>

        {/* Andere gemeenten */}
        <AnimatedSection className="mb-16 text-center">
          <h2 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
            Ook actief in de rest van Parkstad
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {otherGemeenten.map((g) => (
              <Link
                key={g.slug}
                href={`/thuiszorg/${g.slug}`}
                className="px-5 py-2 rounded-full bg-white dark:bg-[#243029] border border-[#ede7db] dark:border-[#086370] text-[#064a54] dark:text-[#dce8de] text-sm font-medium hover:bg-[#e5f2f4] dark:hover:bg-[#02191c] hover:shadow-md transition-all"
              >
                Thuiszorg in {g.name}
              </Link>
            ))}
          </div>
        </AnimatedSection>

        {/* Contact CTA */}
        <AnimatedSection>
          <div className="bg-[#064a54] dark:bg-[#1e2e25] p-8 md:p-12 rounded-[2rem] shadow-xl text-white relative overflow-hidden max-w-4xl mx-auto text-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '16px 16px',
              }}
            ></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-heading mb-4">
                Thuiszorg nodig in {gemeente.name}?
              </h2>
              <p className="text-[#5cb0bd] text-lg mb-8 max-w-2xl mx-auto">
                Bel of app ons gerust voor een vrijblijvend kennismakingsgesprek bij u
                thuis. We denken graag met u mee over de zorg die bij u past.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild variant="primary" className="bg-[#4A9C6E] hover:bg-[#0A7C8C] border-none">
                  <Link href="/#contact">Neem contact op</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                  <a href="tel:+31626591818" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    06 26 59 18 18
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
