import {
  ArtikelLayout,
  artikelMetadata,
  BronLink,
  H2,
  InfoKader,
  SiteLink,
  Strong,
  UL,
} from '@/components/kennisbank/ArtikelLayout';
import { getKennisbankArtikel } from '@/data/kennisbank';

const artikel = getKennisbankArtikel('thuiszorg-aanvragen')!;

export const metadata = artikelMetadata(artikel);

export default function ThuiszorgAanvragenPage() {
  return (
    <ArtikelLayout artikel={artikel}>
      <p>
        Merkt u dat het thuis niet meer vanzelf gaat — na een ziekenhuisopname, door
        ouderdom of door een chronische aandoening? Dan is thuiszorg vaak sneller
        geregeld dan veel mensen denken. In Nederland heeft u{' '}
        <Strong>geen verwijzing van de huisarts nodig</Strong> voor wijkverpleging: u
        mag rechtstreeks contact opnemen met een thuiszorgorganisatie. Hieronder leest
        u hoe het aanvragen stap voor stap werkt.
      </p>

      <H2>Stap 1: neem contact op met een thuiszorgorganisatie</H2>
      <p>
        De kortste route naar wijkverpleging en persoonlijke verzorging loopt via de
        thuiszorgorganisatie zelf. U (of een naaste) belt of mailt, beschrijft kort de
        situatie, en de organisatie plant een kennismaking in. Ook het{' '}
        <Strong>transferbureau van het ziekenhuis</Strong> kan dit regelen als u na een
        opname naar huis gaat — zij schakelen dan een thuiszorgorganisatie in uw regio in.
      </p>
      <p>
        Twijfelt u welk type zorg u nodig heeft? Kijk dan eens bij{' '}
        <SiteLink href="/diensten">de verschillende zorgvormen</SiteLink> — van
        wijkverpleging en persoonlijke verzorging tot begeleiding en nachtzorg.
      </p>

      <H2>Stap 2: de wijkverpleegkundige stelt de indicatie</H2>
      <p>
        Voor zorg uit de basisverzekering (de Zorgverzekeringswet, Zvw) is een{' '}
        <Strong>indicatie</Strong> nodig. Die wordt niet gesteld door uw huisarts of
        zorgverzekeraar, maar door een <Strong>hbo-opgeleide wijkverpleegkundige</Strong>.
        Zij komt bij u thuis, bekijkt samen met u wat u zelf nog kunt, wat uw omgeving
        kan opvangen en welke professionele zorg nodig is. Op basis daarvan stelt zij
        vast welke zorg u krijgt en hoeveel uur.
      </p>
      <InfoKader>
        De indicatie door de wijkverpleegkundige is landelijk zo geregeld; u leest er
        meer over bij de{' '}
        <BronLink href="https://www.rijksoverheid.nl/onderwerpen/verpleging-en-verzorging-thuis">
          Rijksoverheid — verpleging en verzorging thuis
        </BronLink>
        . Wijkverpleging valt onder de basisverzekering, zonder eigen risico en zonder
        eigen bijdrage.
      </InfoKader>

      <H2>Stap 3: het intakegesprek en het zorgplan</H2>
      <p>Tijdens de intake bij u thuis bespreekt de wijkverpleegkundige onder meer:</p>
      <UL>
        <li>
          <Strong>Uw zorgvraag</Strong> — wat gaat er moeilijk, en op welke momenten van
          de dag heeft u ondersteuning nodig?
        </li>
        <li>
          <Strong>Uw gezondheid en medicatie</Strong> — vaak in afstemming met huisarts,
          apotheek of specialist.
        </li>
        <li>
          <Strong>Uw netwerk</Strong> — wat doen partner, familie of mantelzorgers al,
          en waar is verlichting nodig?
        </li>
        <li>
          <Strong>Uw wensen</Strong> — uw dagritme, gewoontes en wat u zelf wilt blijven
          doen.
        </li>
      </UL>
      <p>
        De afspraken komen in een <Strong>zorgplan</Strong>: wie komt wanneer, welke
        zorg wordt geleverd en wat het doel is. Het zorgplan wordt regelmatig met u
        geëvalueerd en bijgesteld als uw situatie verandert.
      </p>

      <H2>Welke rol speelt de huisarts?</H2>
      <p>
        Een verwijzing is dus niet nodig, maar de huisarts blijft een belangrijke
        schakel. Hij of zij kent uw medische voorgeschiedenis, kan thuiszorg adviseren
        als u er zelf nog niet aan dacht, en werkt bij medische handelingen (zoals
        wondzorg of medicatie) nauw samen met de wijkverpleegkundige. Bespreek uw
        zorgen dus gerust eerst met uw huisarts — die kan ook rechtstreeks een
        thuiszorgorganisatie voor u benaderen.
      </p>

      <H2>Hulp bij het huishouden of begeleiding? Dat loopt via de gemeente</H2>
      <p>
        Niet alle zorg thuis valt onder de wijkverpleegkundige. Voor{' '}
        <Strong>huishoudelijke hulp, dagbesteding en individuele begeleiding</Strong>{' '}
        klopt u aan bij het Wmo-loket van uw eigen gemeente — bijvoorbeeld{' '}
        <SiteLink href="/thuiszorg/heerlen">Heerlen</SiteLink>,{' '}
        <SiteLink href="/thuiszorg/kerkrade">Kerkrade</SiteLink> of{' '}
        <SiteLink href="/thuiszorg/landgraaf">Landgraaf</SiteLink>. De gemeente doet dan
        een eigen onderzoek naar uw situatie. Op{' '}
        <BronLink href="https://www.regelhulp.nl/">Regelhulp.nl</BronLink> (een
        wegwijzer van de overheid) ziet u per situatie welke route van toepassing is.
      </p>

      <H2>En wie betaalt dat allemaal?</H2>
      <p>
        Dat hangt af van het soort zorg: de basisverzekering (Zvw), de gemeente (Wmo)
        of de Wet langdurige zorg (Wlz). In het artikel{' '}
        <SiteLink href="/kennisbank/wie-betaalt-de-thuiszorg">
          Wie betaalt de thuiszorg?
        </SiteLink>{' '}
        zetten we de vier routes op een rij, en op onze{' '}
        <SiteLink href="/vergoedingen">vergoedingenpagina</SiteLink> leest u hoe dit
        bij ons werkt.
      </p>

      <H2>Samengevat</H2>
      <UL>
        <li>Bel direct een thuiszorgorganisatie — een verwijzing is niet nodig.</li>
        <li>De wijkverpleegkundige stelt bij u thuis de indicatie en het zorgplan op.</li>
        <li>Wijkverpleging kost u niets extra: geen eigen risico, geen eigen bijdrage.</li>
        <li>Huishoudelijke hulp en begeleiding vraagt u aan via het Wmo-loket van uw gemeente.</li>
      </UL>
    </ArtikelLayout>
  );
}
