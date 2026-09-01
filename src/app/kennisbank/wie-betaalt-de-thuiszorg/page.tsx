import {
  ArtikelLayout,
  artikelMetadata,
  BronLink,
  H2,
  H3,
  InfoKader,
  SiteLink,
  Strong,
  UL,
} from '@/components/kennisbank/ArtikelLayout';
import { getKennisbankArtikel } from '@/data/kennisbank';

const artikel = getKennisbankArtikel('wie-betaalt-de-thuiszorg')!;

export const metadata = artikelMetadata(artikel);

export default function WieBetaaltDeThuiszorgPage() {
  return (
    <ArtikelLayout artikel={artikel}>
      <p>
        &ldquo;Wat gaat mij dat kosten?&rdquo; is bijna altijd een van de eerste vragen
        bij thuiszorg — en terecht. Het antwoord hangt af van het{' '}
        <Strong>soort zorg</Strong> dat u nodig heeft, want Nederland kent drie wetten
        die zorg thuis vergoeden, plus het persoonsgebonden budget als aparte
        leveringsvorm. Hieronder de vier routes op een rij.
      </p>

      <H2>1. Zorgverzekeringswet (Zvw): wijkverpleging en persoonlijke verzorging</H2>
      <p>
        Verpleging en verzorging thuis — denk aan wondzorg, medicatie, hulp bij wassen
        en aankleden — vallen onder de <Strong>basisverzekering</Strong>. Iedereen in
        Nederland is hiervoor verzekerd.
      </p>
      <UL>
        <li>
          <Strong>Geen eigen risico:</Strong> wijkverpleging gaat niet ten koste van uw
          eigen risico.
        </li>
        <li>
          <Strong>Geen eigen bijdrage:</Strong> u betaalt geen inkomensafhankelijke
          eigen bijdrage.
        </li>
        <li>
          <Strong>Indicatie:</Strong> een wijkverpleegkundige stelt bij u thuis vast
          welke zorg nodig is; een verwijzing van de huisarts is niet vereist.
        </li>
      </UL>
      <p>
        Hoe die indicatie tot stand komt, leest u in{' '}
        <SiteLink href="/kennisbank/thuiszorg-aanvragen">
          Hoe vraagt u thuiszorg aan?
        </SiteLink>
      </p>

      <H2>2. Wet maatschappelijke ondersteuning (Wmo): hulp via de gemeente</H2>
      <p>
        Heeft u <Strong>huishoudelijke hulp, dagbesteding, begeleiding of een
        woningaanpassing</Strong> nodig om zelfstandig te blijven wonen? Dan is uw
        gemeente aan zet. U meldt zich bij het Wmo-loket, waarna de gemeente uw
        situatie onderzoekt en passende ondersteuning toekent.
      </p>
      <UL>
        <li>
          <Strong>Eigen bijdrage:</Strong> voor de meeste Wmo-hulp geldt een vaste
          eigen bijdrage per maand (het abonnementstarief), geïnd door het CAK. De
          hoogte is niet afhankelijk van uw inkomen.
        </li>
        <li>
          <Strong>Aanvraag:</Strong> via het Wmo-loket van de gemeente waar u woont —
          in onze regio bijvoorbeeld{' '}
          <SiteLink href="/thuiszorg/heerlen">Heerlen</SiteLink>,{' '}
          <SiteLink href="/thuiszorg/kerkrade">Kerkrade</SiteLink>,{' '}
          <SiteLink href="/thuiszorg/landgraaf">Landgraaf</SiteLink> of{' '}
          <SiteLink href="/thuiszorg/brunssum">Brunssum</SiteLink>.
        </li>
      </UL>
      <InfoKader>
        Meer over de Wmo en de eigen bijdrage vindt u bij de{' '}
        <BronLink href="https://www.rijksoverheid.nl/onderwerpen/zorg-en-ondersteuning-thuis">
          Rijksoverheid — zorg en ondersteuning thuis
        </BronLink>{' '}
        en op <BronLink href="https://www.regelhulp.nl/">Regelhulp.nl</BronLink>.
      </InfoKader>

      <H2>3. Wet langdurige zorg (Wlz): blijvende, intensieve zorg</H2>
      <p>
        Heeft iemand <Strong>blijvend 24 uur per dag zorg dichtbij of permanent
        toezicht</Strong> nodig — bijvoorbeeld bij vergevorderde dementie of een
        ernstige lichamelijke aandoening — dan komt de Wet langdurige zorg in beeld.
        De indicatie hiervoor vraagt u aan bij het <Strong>CIZ</Strong> (Centrum
        indicatiestelling zorg). Met een Wlz-indicatie kunt u ook thuis blijven wonen,
        via een Volledig Pakket Thuis (VPT), een Modulair Pakket Thuis (MPT) of een
        pgb. Voor Wlz-zorg geldt een eigen bijdrage die afhangt van inkomen, vermogen
        en gezinssituatie; het CAK berekent die.
      </p>

      <H2>4. Pgb: zelf uw zorg inkopen</H2>
      <p>
        Het <Strong>persoonsgebonden budget (pgb)</Strong> is geen aparte wet, maar
        een manier om zorg uit de Zvw, Wmo of Wlz zelf in te kopen. U krijgt een
        budget toegekend en kiest daarmee zelf uw zorgverleners. Bij een pgb uit de
        Wmo of Wlz beheert de{' '}
        <BronLink href="https://www.svb.nl/nl/pgb">
          Sociale Verzekeringsbank (SVB)
        </BronLink>{' '}
        het budget en betaalt de zorgverleners uit; u declareert dus niet zelf. Of een
        pgb bij u past, hangt af van hoeveel regie u zelf wilt en kunt nemen — daarover
        meer in{' '}
        <SiteLink href="/kennisbank/pgb-of-zorg-in-natura">
          Pgb of zorg in natura: wat past bij u?
        </SiteLink>
      </p>

      <H2>Welke route geldt voor u?</H2>
      <H3>Een vuistregel</H3>
      <UL>
        <li>
          <Strong>Verpleging of verzorging aan huis</Strong> (wondzorg, medicatie,
          wassen en aankleden) → Zvw, via de wijkverpleegkundige.
        </li>
        <li>
          <Strong>Huishoudelijke hulp, begeleiding of dagbesteding</Strong> → Wmo, via
          uw gemeente.
        </li>
        <li>
          <Strong>Blijvend intensieve zorg met permanent toezicht</Strong> → Wlz, via
          het CIZ.
        </li>
        <li>
          <Strong>Zelf zorgverleners kiezen en contracteren</Strong> → pgb, binnen elk
          van deze wetten mogelijk.
        </li>
      </UL>
      <p>
        In de praktijk komen combinaties vaak voor: wijkverpleging uit de Zvw naast
        huishoudelijke hulp uit de Wmo, bijvoorbeeld. Op onze{' '}
        <SiteLink href="/vergoedingen">vergoedingenpagina</SiteLink> leest u hoe wij
        hiermee werken, en bij{' '}
        <SiteLink href="/diensten">onze diensten</SiteLink> ziet u welke zorgvormen wij
        thuis leveren. Komt u er niet uit? We kijken graag vrijblijvend met u mee welke
        route bij uw situatie hoort.
      </p>
    </ArtikelLayout>
  );
}
