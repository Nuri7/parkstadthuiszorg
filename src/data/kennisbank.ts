export type KennisbankArtikel = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string; // leesbare datum voor de kaart
  datePublished: string; // ISO, voor JSON-LD
};

export const kennisbankArtikelen: KennisbankArtikel[] = [
  {
    slug: 'thuiszorg-aanvragen',
    title: 'Hoe vraagt u thuiszorg aan?',
    description:
      'Stap voor stap: van het eerste gesprek met de wijkverpleegkundige of huisarts tot de indicatie en de start van de zorg. Zo werkt thuiszorg aanvragen in Nederland.',
    category: 'Zorg regelen',
    readTime: '6 min',
    date: 'September 2026',
    datePublished: '2026-09-01',
  },
  {
    slug: 'wie-betaalt-de-thuiszorg',
    title: 'Wie betaalt de thuiszorg? Zvw, Wmo, Wlz en pgb uitgelegd',
    description:
      'Wijkverpleging valt onder uw basisverzekering, huishoudelijke hulp onder de gemeente en langdurige zorg onder de Wlz. Zo zitten de vier routes in elkaar.',
    category: 'Vergoedingen',
    readTime: '7 min',
    date: 'September 2026',
    datePublished: '2026-09-01',
  },
  {
    slug: 'pgb-of-zorg-in-natura',
    title: 'Pgb of zorg in natura: wat past bij u?',
    description:
      'Met een persoonsgebonden budget regelt u zelf uw zorgverleners, bij zorg in natura neemt de aanbieder de organisatie uit handen. Een neutrale vergelijking.',
    category: 'Vergoedingen',
    readTime: '6 min',
    date: 'September 2026',
    datePublished: '2026-09-01',
  },
];

export function getKennisbankArtikel(slug: string): KennisbankArtikel | undefined {
  return kennisbankArtikelen.find((a) => a.slug === slug);
}
