import { Helmet } from 'react-helmet-async';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { FileText } from 'lucide-react';

export function VoorwaardenPage() {
  return (
    <div className="pt-32 pb-20 bg-warm-gradient min-h-screen">
      <Helmet>
        <title>Algemene Voorwaarden | Parkstad Thuiszorg</title>
        <meta name="description" content="Lees de algemene voorwaarden van Parkstad Thuiszorg." />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#e8f0e9] dark:bg-[#1e2e25] rounded-xl text-[#5b7f63]">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading text-[#064a54] dark:text-[#fefdfc]">
              Algemene Voorwaarden
            </h1>
          </div>
        </AnimatedSection>

        <div className="space-y-8">
          {[
            { title: 'Artikel 1 – Definities', content: 'Zorgverlener: Parkstad Thuiszorg, gevestigd te Kerkrade. Cliënt: De persoon die thuiszorg ontvangt. Zorgovereenkomst: De overeenkomst tussen zorgverlener en cliënt. Zorgplan: Het schriftelijke plan waarin de afgesproken zorg en doelen zijn vastgelegd.' },
            { title: 'Artikel 2 – Toepasselijkheid', content: 'Deze voorwaarden zijn van toepassing op alle zorgovereenkomsten, aanbiedingen en diensten van Parkstad Thuiszorg, tenzij schriftelijk anders overeengekomen.' },
            { title: 'Artikel 3 – Zorgverlening', content: 'De zorg wordt verleend op basis van een indicatiestelling en een persoonlijk zorgplan. Wij streven ernaar vaste zorgverleners in te zetten. De zorg wordt verleend door BIG-geregistreerde en/of gediplomeerde medewerkers. Het zorgplan wordt minimaal halfjaarlijks geëvalueerd.' },
            { title: 'Artikel 4 – Verplichtingen cliënt', content: 'De cliënt verstrekt alle informatie die noodzakelijk is voor verantwoorde zorgverlening. De cliënt zorgt voor een veilige werkomgeving. Bij verhindering meldt de cliënt dit uiterlijk 24 uur van tevoren.' },
            { title: 'Artikel 5 – Kosten en betaling', content: 'Zorgkosten worden gedeclareerd bij uw zorgverzekeraar, de gemeente of via de SVB (bij PGB). Eventuele eigen bijdragen worden door het CAK vastgesteld. Bij particuliere zorg worden de tarieven vooraf schriftelijk overeengekomen.' },
            { title: 'Artikel 6 – Beëindiging', content: 'De zorgovereenkomst kan door beide partijen worden beëindigd met inachtneming van een redelijke opzegtermijn. Wij zetten ons in voor een zorgvuldige overdracht.' },
            { title: 'Artikel 7 – Klachten', content: 'Bent u niet tevreden? Neem contact op via info@parkstadthuiszorg.nl of bel 06 44 74 54 71. Wij beschikken over een klachtenregeling conform de Wkkgz.' },
          ].map((article, idx) => (
            <AnimatedSection key={idx} delay={idx * 0.1}>
              <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border border-[#ede7db] dark:border-[#086370]">
                <h2 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">{article.title}</h2>
                <p className="text-[#4f6b6f] dark:text-[#5cb0bd] leading-relaxed">{article.content}</p>
              </div>
            </AnimatedSection>
          ))}
          <p className="text-sm text-[#4f6b6f] dark:text-[#5cb0bd] text-center mt-8">Laatst bijgewerkt: mei 2026</p>
        </div>
      </div>
    </div>
  );
}
