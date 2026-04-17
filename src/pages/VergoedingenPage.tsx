import { Helmet } from 'react-helmet-async';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { FileText, Building2, Heart, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function VergoedingenPage() {
  return (
    <div className="pt-32 pb-20 bg-[#fefdfc] dark:bg-[#02191c] min-h-screen">
      <Helmet>
        <title>Zorgvergoedingen (PGB, WMO, ZVW, WLZ) | Parkstad Thuiszorg</title>
        <meta name="description" content="Alles wat u moet weten over de financiering van uw thuiszorg. Uitleg over PGB, ZVW, WMO en WLZ in regio Parkstad." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
            Hoe wordt uw zorg <span className="text-gradient">vergoed?</span>
          </h1>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg">
            De regelgeving rondom thuiszorg in Nederland kan complex lijken. Wij leggen graag uit via welke wetten (ZVW, WMO, WLZ) en budgetten (PGB) uw zorg vergoed wordt. Wij helpen u desgewenst bij de indicatiestelling.
          </p>
        </AnimatedSection>

        <div className="space-y-8 mb-16">
          
          <AnimatedSection delay={0.1}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border-l-4 border-l-[#5b7f63] border-t border-b border-r border-[#ede7db] dark:border-[#086370]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#e8f0e9] dark:bg-[#1e2e25] rounded-xl text-[#5b7f63]">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc]">Zorgverzekeringswet (Zvw)</h3>
              </div>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] mb-4 leading-relaxed">
                Valt uw zorgvraag onder persoonlijke verzorging of wijkverpleging? Dan wordt dit bekostigd vanuit uw basisverzekering (Zvw).
              </p>
              <ul className="list-disc pl-5 text-[#4f6b6f] dark:text-[#dce8de] space-y-2 mb-4">
                <li><strong className="text-[#064a54] dark:text-white">Geen eigen risico:</strong> Wijkverpleging gaat niet ten koste van uw eigen risico.</li>
                <li><strong className="text-[#064a54] dark:text-white">Geen eigen bijdrage:</strong> U betaalt geen inkomensafhankelijke eigen bijdrage (CAK).</li>
                <li><strong className="text-[#064a54] dark:text-white">Indicatie:</strong> Hiervoor is een indicatie nodig van een (onze) wijkverpleegkundige.</li>
              </ul>
              <div className="bg-[#e5f2f4] dark:bg-[#1e2e25] p-4 rounded-xl text-sm text-[#5b7f63] dark:text-[#5cb0bd]">
                <strong>Onze rol:</strong> Onze BIG-geregistreerde wijkverpleegkundige stelt de indicatie en het zorgplan op basis van uw zorgbehoefte op.
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border-l-4 border-l-[#4A9C6E] border-t border-b border-r border-[#ede7db] dark:border-[#086370]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#fdf4ef] dark:bg-[#3f1f14] rounded-xl text-[#4A9C6E]">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc]">Wet Maatschappelijke Ondersteuning (Wmo)</h3>
              </div>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] mb-4 leading-relaxed">
                Heeft u begeleiding nodig bij dagelijkse activiteiten, dagbesteding of het huishouden? Dit gaat via de gemeente waar u woont (bijvoorbeeld Gemeente Heerlen, Kerkrade of Landgraaf).
              </p>
              <ul className="list-disc pl-5 text-[#4f6b6f] dark:text-[#dce8de] space-y-2 mb-4">
                <li><strong className="text-[#064a54] dark:text-white">Eigen bijdrage:</strong> Ja, er geldt een (vast) abonnementstarief via het CAK (max €20,60 per maand in 2024).</li>
                <li><strong className="text-[#064a54] dark:text-white">Aanvraag:</strong> Via het Wmo-loket van uw gemeente.</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl shadow-md border-l-4 border-l-[#476550] border-t border-b border-r border-[#ede7db] dark:border-[#086370]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#e8f0e9] dark:bg-[#1e2e25] rounded-xl text-[#476550]">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-heading text-[#064a54] dark:text-[#fefdfc]">Wet Langdurige Zorg (Wlz)</h3>
              </div>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] mb-4 leading-relaxed">
                Heeft u blijvend intensieve 24-uurs zorg of toezicht dichtbij nodig? Dan kan er een WLZ-indicatie worden aangevraagd via het CIZ. Met een Volledig Pakket Thuis (VPT), Modulair Pakket Thuis (MPT) of een PGB kunt u deze zorg toch thuis ontvangen.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.4}>
            <div className="bg-[#064a54] dark:bg-[#1e2e25] p-8 md:p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
               {/* Pattern overlay */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
               
               <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <Euro className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-heading">PGB of Zorg in Natura?</h3>
                 </div>
                 
                 <p className="mb-6 text-[#5cb0bd] text-lg leading-relaxed">
                   Bij Parkstad Thuiszorg kunnen wij zorg leveren vanuit een Persoonsgebonden Budget (PGB) of via declaratie (Particuliere Zorgverlening). 
                 </p>
                 
                 <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 backdrop-blur-sm">
                   <h4 className="font-bold text-xl mb-2 text-white">Het voordeel van PGB:</h4>
                   <p className="text-[#b8d1bc]">Met een PGB behoudt u zelf de regie. U bepaalt zelf door wie en op welk tijdstip u zorg ontvangt. Wij ondersteunen u graag bij het aanvragen en beheren van uw PGB via de Sociale Verzekeringsbank (SVB), zodat u niet vastloopt in de administratie.</p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-white font-medium">Hulp nodig bij de aanvraag?</p>
                    <Button asChild variant="primary" className="bg-[#4A9C6E] hover:bg-[#0A7C8C] border-none">
                      <Link to="/contact">Neem contact op</Link>
                    </Button>
                 </div>
               </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </div>
  );
}
