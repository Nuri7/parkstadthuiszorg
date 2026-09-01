import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

import { AnimatedSection } from '@/components/ui/AnimatedSection';
import type { KennisbankArtikel } from '@/data/kennisbank';

const BASE_URL = 'https://parkstadthuiszorg.nl';

export function artikelMetadata(artikel: KennisbankArtikel): Metadata {
  return {
    title: `${artikel.title} | Kennisbank Parkstad Thuiszorg`,
    description: artikel.description,
    alternates: {
      canonical: `/kennisbank/${artikel.slug}`,
    },
    openGraph: {
      title: artikel.title,
      description: artikel.description,
      url: `${BASE_URL}/kennisbank/${artikel.slug}`,
      type: 'article',
      locale: 'nl_NL',
      siteName: 'Parkstad Thuiszorg',
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'Parkstad Thuiszorg — een vertrouwd gezicht, een gerust gevoel.',
        },
      ],
    },
  };
}

export function artikelJsonLd(artikel: KennisbankArtikel) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${BASE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Kennisbank',
            item: `${BASE_URL}/kennisbank`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: artikel.title,
            item: `${BASE_URL}/kennisbank/${artikel.slug}`,
          },
        ],
      },
      {
        '@type': 'Article',
        headline: artikel.title,
        description: artikel.description,
        inLanguage: 'nl',
        datePublished: artikel.datePublished,
        mainEntityOfPage: `${BASE_URL}/kennisbank/${artikel.slug}`,
        author: {
          '@type': 'Organization',
          name: 'Parkstad Thuiszorg',
          url: BASE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Parkstad Thuiszorg',
          url: BASE_URL,
        },
      },
    ],
  };
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-heading text-[#064a54] dark:text-[#fefdfc] pt-6">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl font-heading text-[#064a54] dark:text-[#fefdfc] pt-2">
      {children}
    </h3>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 space-y-2">{children}</ul>;
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="text-[#064a54] dark:text-white">{children}</strong>;
}

/** Externe link naar een officiële bron. */
export function BronLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#0A7C8C] dark:text-[#5cb0bd] underline underline-offset-2 hover:text-[#086370] transition-colors"
    >
      {children}
    </a>
  );
}

/** Interne link binnen de site. */
export function SiteLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[#5b7f63] dark:text-[#7c9a82] font-medium underline underline-offset-2 hover:text-[#476550] transition-colors"
    >
      {children}
    </Link>
  );
}

export function InfoKader({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#e5f2f4] dark:bg-[#1e2e25] p-5 rounded-xl text-sm text-[#086370] dark:text-[#5cb0bd] border border-[#c9e2e6] dark:border-[#086370]">
      {children}
    </div>
  );
}

export function ArtikelLayout({
  artikel,
  children,
}: {
  artikel: KennisbankArtikel;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-32 pb-20 bg-warm-gradient min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(artikelJsonLd(artikel)).replace(/</g, '\\u003c'),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <AnimatedSection>
          <nav aria-label="Kruimelpad" className="mb-8 text-sm text-[#8ab0b6]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#5b7f63] transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/kennisbank" className="hover:text-[#5b7f63] transition-colors">
                  Kennisbank
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[#4f6b6f] dark:text-[#5cb0bd]">{artikel.title}</li>
            </ol>
          </nav>
        </AnimatedSection>

        {/* Header */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-3 mb-4 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e5f2f4] dark:bg-[#02191c] text-[#086370] dark:text-[#5cb0bd] font-semibold uppercase tracking-wider">
              <BookOpen className="w-3 h-3" />
              {artikel.category}
            </span>
            <span className="flex items-center gap-1 text-[#8ab0b6]">
              <Clock className="w-3 h-3" />
              {artikel.readTime} leestijd
            </span>
            <span className="text-[#8ab0b6]">{artikel.date}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-5 leading-tight">
            {artikel.title}
          </h1>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg leading-relaxed">
            {artikel.description}
          </p>
        </AnimatedSection>

        {/* Inhoud */}
        <AnimatedSection delay={0.1}>
          <div className="artikel-inhoud space-y-6 text-[#4f6b6f] dark:text-[#dce8de] leading-relaxed">
            {children}
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.15} className="mt-16">
          <div className="bg-[#064a54] dark:bg-[#1e2e25] p-8 md:p-10 rounded-3xl text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '16px 16px',
              }}
            ></div>
            <div className="relative z-10 text-center">
              <h2 className="text-2xl md:text-3xl font-heading mb-4">
                Liever persoonlijk advies?
              </h2>
              <p className="text-[#5cb0bd] mb-6 max-w-lg mx-auto">
                Wij denken graag vrijblijvend met u mee over de zorg die bij uw situatie
                past — en helpen desgewenst bij de indicatie en de aanvraag.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 bg-[#4A9C6E] hover:bg-[#3b7c58] text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                Neem contact op <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Terug */}
        <AnimatedSection delay={0.2} className="mt-10 text-center">
          <Link
            href="/kennisbank"
            className="text-[#5b7f63] dark:text-[#7c9a82] font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            Terug naar de kennisbank <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </div>
    </div>
  );
}
