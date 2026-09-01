import { AnimatedSection } from '@/components/ui/AnimatedSection';
import Link from 'next/link';

import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';

export const metadata = {
  alternates: {
    canonical: "/kennisbank",
  },
  title: "Kennisbank & Tips | Parkstad Thuiszorg",
  description: "Handige artikelen over thuiszorg, mantelzorg, PGB, dementie en revalidatie. Kennisbank van Parkstad Thuiszorg.",
};


const articles = [
  {
    id: 'mantelzorg-tips',
    title: 'Mantelzorger? 7 tips om het vol te houden',
    summary: 'Als mantelzorger geef je veel van jezelf. Lees onze tips om overbelasting te voorkomen en op tijd hulp te vragen.',
    category: 'Mantelzorg',
    readTime: '5 min',
    date: 'Mei 2026',
  },
  {
    id: 'thuiszorg-na-operatie',
    title: 'Thuiszorg na een operatie: wat u moet weten',
    summary: 'Na een knie-, heup- of andere operatie wilt u zo snel mogelijk herstellen. Ontdek hoe professionele thuiszorg uw revalidatie thuis versnelt.',
    category: 'Revalidatie',
    readTime: '4 min',
    date: 'Mei 2026',
  },
  {
    id: 'pgb-aanvragen',
    title: 'PGB aanvragen: stap voor stap uitgelegd',
    summary: 'Een Persoonsgebonden Budget geeft u de regie over uw eigen zorg. Wij leggen het aanvraagproces helder uit.',
    category: 'Vergoedingen',
    readTime: '6 min',
    date: 'Mei 2026',
  },
  {
    id: 'dementie-thuis',
    title: 'Omgaan met dementie: thuiszorg als steun',
    summary: 'Hoe kunt u uw naaste met dementie het beste ondersteunen? En wanneer is professionele begeleiding verstandig?',
    category: 'Dementie',
    readTime: '5 min',
    date: 'Mei 2026',
  },
  {
    id: 'copd-thuiszorg',
    title: 'Leven met COPD: thuiszorg en ademhalingsondersteuning',
    summary: 'COPD vraagt om dagelijkse aandacht. Lees hoe wij u thuis ondersteunen bij benauwdheid en medicatie.',
    category: 'Chronische Zorg',
    readTime: '4 min',
    date: 'Mei 2026',
  },
  {
    id: 'flexibele-zorg-jongeren',
    title: 'Jong en zorgbehoevend: flexibele thuiszorg die bij u past',
    summary: 'U bent geen patiënt — u bent een zelfstandig persoon die specifieke ondersteuning nodig heeft. Zo werken wij met jongere cliënten.',
    category: 'Zelfstandigheid',
    readTime: '4 min',
    date: 'Mei 2026',
  },
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-20 bg-warm-gradient min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-[#4A9C6E]" />
            <h1 className="text-4xl md:text-5xl font-heading text-[#064a54] dark:text-[#fefdfc]">
              Kennisbank
            </h1>
          </div>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg">
            Praktische informatie en tips voor cliënten, mantelzorgers en naasten. 
            Geschreven met zorg, net als onze zorgverlening.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <AnimatedSection key={article.id} delay={index * 0.08}>
              <article className="bg-white dark:bg-[#243029] rounded-2xl overflow-hidden shadow-lg border border-[#ede7db] dark:border-[#086370] h-full flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="p-2">
                  <div className="bg-[#e5f2f4] dark:bg-[#02191c] rounded-xl p-6 flex items-center justify-center h-36">
                    <BookOpen className="w-12 h-12 text-[#b8d1bc] dark:text-[#086370] opacity-50" />
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#4A9C6E] mb-2">{article.category}</span>
                  <h2 className="text-xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-3 group-hover:text-[#0A7C8C] transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-sm flex-grow mb-4">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#8ab0b6] mt-auto pt-4 border-t border-[#ede7db] dark:border-[#086370]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.date}</span>
                    </div>
                    <span className="text-[#5b7f63] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lees meer <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5} className="text-center mt-16">
          <div className="bg-[#064a54] dark:bg-[#1e2e25] p-8 md:p-12 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-heading mb-4">Heeft u een vraag?</h3>
              <p className="text-[#5cb0bd] mb-6 max-w-lg mx-auto">
                Staat uw onderwerp er niet tussen? Neem gerust contact met ons op — wij helpen u graag persoonlijk verder.
              </p>
              <Link href="/#contact" className="inline-flex items-center gap-2 bg-[#4A9C6E] hover:bg-[#3b7c58] text-white px-8 py-3 rounded-full font-medium transition-colors">
                Neem contact op <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
