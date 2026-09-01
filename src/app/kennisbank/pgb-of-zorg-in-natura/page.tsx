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

const artikel = getKennisbankArtikel('pgb-of-zorg-in-natura')!;

export const metadata = artikelMetadata(artikel);

export default function PgbOfZorgInNaturaPage() {
  return (
    <ArtikelLayout artikel={artikel}>
      <p>
        Krijgt u een indicatie voor zorg thuis, dan volgt vaak nog een keuze: neemt u{' '}
        <Strong>zorg in natura</Strong> af, of regelt u uw zorg zelf met een{' '}
        <Strong>persoonsgebonden budget (pgb)</Strong>? Beide leveren dezelfde soort
        zorg op, maar de organisatie en verantwoordelijkheid liggen heel anders. Er is
        geen &ldquo;beste&rdquo; keuze — wel een keuze die beter bij uw situatie past.
      </p>

      <H2>Wat is zorg in natura?</H2>
      <p>
        Bij zorg in natura levert een zorgaanbieder de zorg en regelt die ook de
        administratie eromheen. De aanbieder declareert rechtstreeks bij de
        zorgverzekeraar, gemeente of het zorgkantoor. U kiest een aanbieder en maakt
        samen afspraken over de invulling van de zorg — daarna hoeft u zelf niets te
        regelen.
      </p>

      <H2>Wat is een pgb?</H2>
      <p>
        Met een persoonsgebonden budget krijgt u een bedrag toegekend waarmee u{' '}
        <Strong>zelf zorgverleners kiest en contracteert</Strong>. Dat kan een
        professionele organisatie zijn, een zzp&apos;er, of in veel gevallen ook een
        familielid of bekende. U wordt daarmee zelf de opdrachtgever: u sluit
        zorgovereenkomsten af, bewaakt de kwaliteit en houdt de administratie bij. Bij
        een pgb uit de Wmo of de Wlz beheert de{' '}
        <BronLink href="https://www.svb.nl/nl/pgb">SVB</BronLink> het budget en
        betaalt zij uw zorgverleners uit (het zogeheten trekkingsrecht).
      </p>

      <H2>De verschillen naast elkaar</H2>

      <H3>Regie en keuzevrijheid</H3>
      <UL>
        <li>
          <Strong>Pgb:</Strong> maximale regie. U bepaalt wie er over de vloer komt, op
          welke tijden en hoe de zorg wordt ingevuld — ook met zorgverleners zonder
          contract met verzekeraar of gemeente.
        </li>
        <li>
          <Strong>Zorg in natura:</Strong> u kiest de aanbieder, maar de planning en
          personele invulling liggen bij de organisatie. Veel aanbieders werken
          overigens wél met vaste gezichten en flexibele tijden.
        </li>
      </UL>

      <H3>Administratie en verantwoordelijkheid</H3>
      <UL>
        <li>
          <Strong>Pgb:</Strong> u sluit zelf zorgovereenkomsten, keurt declaraties goed
          en legt verantwoording af over de besteding. Dit vraagt om
          &ldquo;pgb-vaardigheid&rdquo;: overzicht, administratie en assertiviteit —
          of een naaste die dit als vertegenwoordiger op zich neemt.
        </li>
        <li>
          <Strong>Zorg in natura:</Strong> de aanbieder doet de administratie en
          declaratie. U heeft er geen omkijken naar.
        </li>
      </UL>

      <H3>Continuïteit en vervanging</H3>
      <UL>
        <li>
          <Strong>Pgb:</Strong> valt een zorgverlener uit, dan moet u zelf vervanging
          organiseren.
        </li>
        <li>
          <Strong>Zorg in natura:</Strong> de organisatie is verantwoordelijk voor
          continuïteit, ook bij ziekte of vakantie van een medewerker.
        </li>
      </UL>

      <InfoKader>
        De overheid heeft de voorwaarden en de taken die bij een pgb horen op een rij
        gezet op{' '}
        <BronLink href="https://www.rijksoverheid.nl/onderwerpen/persoonsgebonden-budget-pgb">
          Rijksoverheid.nl — persoonsgebonden budget
        </BronLink>
        . Op <BronLink href="https://www.regelhulp.nl/">Regelhulp.nl</BronLink> vindt u
        per zorgwet hoe u een pgb aanvraagt.
      </InfoKader>

      <H2>Wanneer past wat?</H2>
      <p>
        <Strong>Een pgb past vaak goed</Strong> als u precies weet welke zorg u wilt en
        van wie, als u zorgverleners wilt inzetten die geen contract hebben met uw
        verzekeraar of gemeente (bijvoorbeeld een informele zorgverlener uit uw
        omgeving), en als u — of uw vertegenwoordiger — de administratie aankan.
      </p>
      <p>
        <Strong>Zorg in natura past vaak goed</Strong> als u vooral ontzorgd wilt
        worden, geen administratie wilt bijhouden, en het prettig vindt dat één
        organisatie de kwaliteit, planning en vervanging regelt.
      </p>
      <p>
        Een combinatie kan ook: sommige mensen nemen een deel van de zorg in natura af
        en regelen een ander deel met een pgb.
      </p>

      <H2>Hoe wij hiermee werken</H2>
      <p>
        Parkstad Thuiszorg levert zorg die vanuit een pgb wordt betaald en helpt u
        desgewenst bij de aanvraag en het beheer ervan. Welke zorgvormen dat kunnen
        zijn, ziet u bij <SiteLink href="/diensten">onze diensten</SiteLink>; hoe de
        financiering in elkaar zit, leest u op de{' '}
        <SiteLink href="/vergoedingen">vergoedingenpagina</SiteLink> en in{' '}
        <SiteLink href="/kennisbank/wie-betaalt-de-thuiszorg">
          Wie betaalt de thuiszorg?
        </SiteLink>{' '}
        Wij werken in de hele regio Parkstad — van{' '}
        <SiteLink href="/thuiszorg/kerkrade">Kerkrade</SiteLink> en{' '}
        <SiteLink href="/thuiszorg/heerlen">Heerlen</SiteLink> tot{' '}
        <SiteLink href="/thuiszorg/simpelveld">Simpelveld</SiteLink> en{' '}
        <SiteLink href="/thuiszorg/voerendaal">Voerendaal</SiteLink>. Twijfelt u wat
        bij u past? We zetten de opties graag vrijblijvend voor u op een rij.
      </p>
    </ArtikelLayout>
  );
}
