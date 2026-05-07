import { Helmet } from 'react-helmet-async';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { HeartPulse, Target, ShieldCheck } from 'lucide-react';
import { team } from '../data/team';

export function OverOnsPage() {
  return (
    <div className="pt-32 pb-20 bg-warm-gradient min-h-screen">
      <Helmet>
        <title>Over Ons | Parkstad Thuiszorg</title>
        <meta name="description" content="Maak kennis met ons zorgteam. Zorg met aandacht en een Limburgs hart in o.a. Kerkrade, Heerlen en Landgraaf." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
          <div className="w-full lg:w-1/2">
            <AnimatedSection>
              <h1 className="text-4xl md:text-5xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
                Zorg met <span className="text-gradient">aandacht</span>. Zorg met een <span className="text-gradient">Limburgs hart</span>.
              </h1>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg mb-6 leading-relaxed">
                Parkstad Thuiszorg is ontstaan uit de wens om de zorg weer menselijk te maken. Geen stopwatch aan het bed, geen continu wisselende gezichten, maar échte aandacht voor de cliënt.
              </p>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg leading-relaxed">
                Als klein, lokaal team in de regio (Kerkrade, Heerlen, Landgraaf, Brunssum, Voerendaal) kennen we de cultuur en mentaliteit. We spreken plat als u dat prettig vindt, maken tijd voor een praatje, kennen de families en bouwen een vertrouwensband op. Of u nu jong of oud bent — wij bieden zorg die bij ú past.
              </p>
            </AnimatedSection>
          </div>
          
          <div className="w-full lg:w-1/2">
            <AnimatedSection delay={0.2} className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl">
              <img 
                src={`${import.meta.env.BASE_URL}images/team-group.webp`} 
                alt="Het volledige zorgteam" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </AnimatedSection>
          </div>
        </div>

        {/* Mission/Vision grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <AnimatedSection delay={0.1}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl h-full shadow-lg border border-[#ede7db] dark:border-[#086370] text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-[#e5f2f4] dark:bg-[#02191c] rounded-2xl flex items-center justify-center mb-6 text-[#5b7f63]">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">Onze Missie</h3>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd]">Kwalitatieve, persoonsgerichte zorg bieden waardoor mensen langer, veiliger en gelukkiger in hun eigen vertrouwde omgeving kunnen blijven wonen.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-[#e5f2f4] dark:bg-[#02191c] p-8 rounded-3xl h-full shadow-lg border border-[#dce8de] dark:border-[#086370] text-center hover:-translate-y-2 transition-transform duration-300 transform scale-105 z-10 relative">
              <div className="w-16 h-16 mx-auto bg-white dark:bg-[#243029] rounded-2xl flex items-center justify-center mb-6 text-[#4A9C6E]">
                <HeartPulse className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">Onze Visie</h3>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd]">Wij geloven dat zorg om ménsen draait. Medisch handelen is belangrijk, maar het gevoel van veiligheid, gehoord worden en respectvolle benadering is cruciaal.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="bg-white dark:bg-[#243029] p-8 rounded-3xl h-full shadow-lg border border-[#ede7db] dark:border-[#086370] text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-[#e5f2f4] dark:bg-[#02191c] rounded-2xl flex items-center justify-center mb-6 text-[#5b7f63]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">Kwaliteit</h3>
              <p className="text-[#4f6b6f] dark:text-[#5cb0bd]">100% BIG-geregistreerd personeel, continue bijscholing en werken volgens de nieuwste kwaliteitskaders in de wijkverpleging.</p>
            </div>
          </AnimatedSection>
        </div>

        {/* Full Team Section */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading text-[#064a54] dark:text-[#fefdfc]">
            Ontmoet Ons Team
          </h2>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] mt-4 max-w-2xl mx-auto">
            Gepassioneerde professionals met hart voor de zorg en de regio.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
             <AnimatedSection key={member.id} delay={index * 0.1}>
              <div className="bg-white dark:bg-[#243029] rounded-2xl overflow-hidden shadow-lg border border-[#ede7db] dark:border-[#086370]">
                <div className="aspect-square relative overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold text-[#064a54] dark:text-[#fefdfc] mb-1">{member.name}</h4>
                  <p className="text-[#4A9C6E] text-sm font-medium mb-2">{member.role}</p>
                  {'qualifications' in member && (
                    <p className="text-[#8ab0b6] text-xs mb-4">{member.qualifications}</p>
                  )}
                  <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-sm italic">"{member.quote}"</p>
                </div>
              </div>
             </AnimatedSection>
          ))}
        </div>

      </div>
    </div>
  );
}
