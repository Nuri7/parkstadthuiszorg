export interface Gemeente {
  slug: string;
  name: string;
  /** Korte, unieke introductie (2-3 zinnen) voor de landingspagina. */
  intro: string;
  /** Tweede alinea met eerlijke, geografische context — geen verzonnen cijfers of kantoren. */
  context: string;
}

export const gemeenten: Gemeente[] = [
  {
    slug: 'kerkrade',
    name: 'Kerkrade',
    intro:
      'Parkstad Thuiszorg is gevestigd in Kerkrade en levert hier thuiszorg aan huis: wijkverpleging, persoonlijke verzorging en begeleiding. Omdat dit onze thuisbasis is, zijn we snel bij u — van Kerkrade-Centrum tot de wijken daaromheen.',
    context:
      'Kerkrade ligt in het hart van ons werkgebied, direct aan de Duitse grens. Vanuit hier bedienen we ook de buurgemeenten Landgraaf, Heerlen en Simpelveld. Onze zorg wordt verleend door een BIG-geregistreerde wijkverpleegkundige, met korte lijnen naar uw huisarts en apotheek in de buurt.',
  },
  {
    slug: 'heerlen',
    name: 'Heerlen',
    intro:
      'Parkstad Thuiszorg levert thuiszorg in en rond Heerlen: van wijkverpleging en persoonlijke verzorging tot begeleiding en nachtzorg. Vanuit onze thuisbasis in Kerkrade is ons team snel ter plaatse, ook in Heerlen.',
    context:
      'Heerlen is de grootste stad van de regio Parkstad en grenst direct aan ons vestigingsgebied. Wij komen bij cliënten thuis in heel de gemeente en werken daarbij samen met de huisartsen en apotheken waar u al bekend bent. Ook in de omliggende gemeenten Landgraaf, Brunssum en Voerendaal zijn we actief.',
  },
  {
    slug: 'landgraaf',
    name: 'Landgraaf',
    intro:
      'Woont u in Landgraaf en zoekt u thuiszorg? Parkstad Thuiszorg biedt er wijkverpleging, persoonlijke verzorging en begeleiding aan huis. Landgraaf grenst direct aan Kerkrade, waar wij gevestigd zijn — ons team is er dus snel.',
    context:
      'Landgraaf ligt tussen Heerlen en Kerkrade, midden in de regio Parkstad waar wij dagelijks werken. Of het nu gaat om zorg na een ziekenhuisopname of structurele ondersteuning bij u thuis: we stemmen de zorg af op uw ritme en houden korte lijnen met uw eigen huisarts.',
  },
  {
    slug: 'brunssum',
    name: 'Brunssum',
    intro:
      'Ook in Brunssum kunt u rekenen op Parkstad Thuiszorg: professionele wijkverpleging, persoonlijke verzorging en begeleiding in uw eigen huis. Wij werken vanuit Kerkrade en komen graag bij u langs voor een vrijblijvend kennismakingsgesprek.',
    context:
      'Brunssum ligt aan de noordkant van Parkstad, met Heerlen en Landgraaf als directe buren — allemaal gemeenten waar wij actief zijn. Onze BIG-geregistreerde wijkverpleegkundige stelt zelf indicaties, zodat u niet hoeft te wachten op een externe partij om de zorg te starten.',
  },
  {
    slug: 'voerendaal',
    name: 'Voerendaal',
    intro:
      'Parkstad Thuiszorg verleent ook thuiszorg in Voerendaal en de omliggende kerkdorpen: wijkverpleging, persoonlijke verzorging, begeleiding en meer. Vanuit Kerkrade rijden we graag naar u toe — ook in het buitengebied.',
    context:
      'Voerendaal is een landelijke gemeente aan de westrand van Parkstad, grenzend aan Heerlen en Simpelveld. Juist in de kleinere kernen is vertrouwde zorg aan huis waardevol: u houdt een vast gezicht en wij houden contact met uw huisarts en apotheek in de regio.',
  },
  {
    slug: 'simpelveld',
    name: 'Simpelveld',
    intro:
      'In Simpelveld en Bocholtz biedt Parkstad Thuiszorg zorg aan huis: van wijkverpleging en persoonlijke verzorging tot mantelzorgondersteuning. Simpelveld grenst direct aan onze thuisbasis Kerkrade, dus we zijn snel bij u in de buurt.',
    context:
      'Simpelveld ligt in het zuiden van Parkstad, tussen Kerkrade, Voerendaal en het Heuvelland. Wij geloven in kleinschalige zorg met een vertrouwd gezicht: dezelfde zorgverlener die uw situatie kent, op tijden die passen bij uw dag.',
  },
];

export function getGemeente(slug: string): Gemeente | undefined {
  return gemeenten.find((g) => g.slug === slug);
}
