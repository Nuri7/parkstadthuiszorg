import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "Privacybeleid | Parkstad Thuiszorg",
  description: "Lees hoe Parkstad Thuiszorg omgaat met uw persoonsgegevens. Wij beschermen uw privacy conform de AVG.",
};


export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 bg-warm-gradient min-h-screen">
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#e8f0e9] dark:bg-[#1e2e25] rounded-xl text-[#5b7f63]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading text-[#064a54] dark:text-[#fefdfc]">
              Privacybeleid
            </h1>
          </div>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg">
            Parkstad Thuiszorg hecht groot belang aan de bescherming van uw persoonsgegevens. Dit privacybeleid is van toepassing op alle diensten van Parkstad Thuiszorg.
          </p>
        </AnimatedSection>

        <div className="space-y-8">
          <AnimatedSection delay={0.1}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border border-[#ede7db] dark:border-[#086370]">
              <h2 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">1. Verantwoordelijke</h2>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] leading-relaxed">
                Parkstad Thuiszorg, eenmanszaak gedreven door Meyrem Bayrak, gevestigd te Kerkrade, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in dit privacybeleid. Wij verwerken uw gegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).
              </p>
              <dl className="mt-4 text-[#4f6b6f] dark:text-[#dce8de] text-sm space-y-1">
                <div className="flex gap-2"><dt className="font-semibold">Handelsnaam:</dt><dd>Parkstad Thuiszorg</dd></div>
                <div className="flex gap-2"><dt className="font-semibold">KvK-nummer:</dt><dd>42026060</dd></div>
                <div className="flex gap-2"><dt className="font-semibold">AGB-code:</dt><dd>91133634</dd></div>
                <div className="flex gap-2"><dt className="font-semibold">BIG-nummer:</dt><dd>19923300630</dd></div>
                <div className="flex gap-2"><dt className="font-semibold">E-mail:</dt><dd><a href="mailto:info@parkstadthuiszorg.nl" className="text-[#5b7f63] underline hover:text-[#4A9C6E] transition-colors">info@parkstadthuiszorg.nl</a></dd></div>
                <div className="flex gap-2"><dt className="font-semibold">Telefoon:</dt><dd><a href="tel:+31626591818" className="text-[#5b7f63] underline">06 26 59 18 18</a></dd></div>
              </dl>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border border-[#ede7db] dark:border-[#086370]">
              <h2 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">2. Persoonsgegevens die wij verwerken</h2>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] leading-relaxed mb-4">
                Wij verwerken de volgende categorieën persoonsgegevens:
              </p>
              <ul className="list-disc pl-5 text-[#4f6b6f] dark:text-[#dce8de] space-y-2">
                <li>Naam, adres, woonplaats en contactgegevens</li>
                <li>Geboortedatum en BSN (voor zorgverlening)</li>
                <li>Medische gegevens in het kader van het zorgdossier</li>
                <li>Gegevens van uw zorgverzekeraar en polisnummer</li>
                <li>Gegevens van uw huisarts en/of specialist</li>
                <li>Indicatiestelling en zorgplan</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border border-[#ede7db] dark:border-[#086370]">
              <h2 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">3. Doel van de verwerking</h2>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] leading-relaxed mb-4">
                Wij gebruiken uw gegevens uitsluitend voor:
              </p>
              <ul className="list-disc pl-5 text-[#4f6b6f] dark:text-[#dce8de] space-y-2">
                <li>Het verlenen van thuiszorg en verpleging</li>
                <li>Het bijhouden van uw elektronisch zorgdossier</li>
                <li>Het declareren bij uw zorgverzekeraar of de SVB</li>
                <li>Het voldoen aan wettelijke verplichtingen</li>
                <li>Het contact opnemen naar aanleiding van uw aanvraag</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border border-[#ede7db] dark:border-[#086370]">
              <h2 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">4. Bewaartermijn</h2>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] leading-relaxed">
                Wij bewaren uw medische gegevens conform de Wet op de geneeskundige behandelingsovereenkomst (WGBO) gedurende minimaal 20 jaar na beëindiging van de zorgrelatie. Overige persoonsgegevens worden niet langer bewaard dan strikt noodzakelijk.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border border-[#ede7db] dark:border-[#086370]">
              <h2 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">5. Uw rechten</h2>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] leading-relaxed mb-4">
                U heeft het recht om:
              </p>
              <ul className="list-disc pl-5 text-[#4f6b6f] dark:text-[#dce8de] space-y-2">
                <li>Uw persoonsgegevens in te zien (inzagerecht)</li>
                <li>Onjuiste gegevens te laten corrigeren</li>
                <li>Uw gegevens te laten verwijderen (binnen wettelijke grenzen)</li>
                <li>Bezwaar te maken tegen de verwerking</li>
                <li>Een klacht in te dienen bij de Autoriteit Persoonsgegevens</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border border-[#ede7db] dark:border-[#086370]">
              <h2 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">6. Beveiliging</h2>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] leading-relaxed">
                Wij nemen de bescherming van uw gegevens serieus en nemen passende maatregelen om misbruik, verlies, onbevoegde toegang en ongewenste openbaarmaking tegen te gaan. Als u het idee heeft dat uw gegevens toch niet goed beveiligd zijn of er aanwijzingen zijn van misbruik, neem dan contact op via <a href="mailto:info@parkstadthuiszorg.nl" className="text-[#5b7f63] underline hover:text-[#4A9C6E] transition-colors">info@parkstadthuiszorg.nl</a>.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.7}>
            <div className="bg-[#e5f2f4] dark:bg-[#02191c] p-8 rounded-3xl border border-[#dce8de] dark:border-[#086370]">
              <h2 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">7. Contact</h2>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] leading-relaxed">
                Heeft u vragen over dit privacybeleid of wilt u een beroep doen op één van uw rechten? Neem dan contact op met ons:
              </p>
              <div className="mt-4 text-[#064a54] dark:text-[#fefdfc] font-medium">
                <p>Parkstad Thuiszorg</p>
                <p>Kasperenstraat 123, 6466 BH Kerkrade</p>
                <p>Telefoon: <a href="tel:+31626591818" className="text-[#5b7f63] underline">06 26 59 18 18</a></p>
                <p>E-mail: <a href="mailto:info@parkstadthuiszorg.nl" className="text-[#5b7f63] underline">info@parkstadthuiszorg.nl</a></p>
              </div>
            </div>
          </AnimatedSection>

          <p className="text-sm text-[#4f6b6f] dark:text-[#5cb0bd] text-center mt-8">
            Laatst bijgewerkt: mei 2026
          </p>
        </div>
      </div>
    </div>
  );
}
