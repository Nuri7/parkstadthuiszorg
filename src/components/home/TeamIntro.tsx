import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { team } from '../../data/team';
import { AnimatedSection } from '../ui/AnimatedSection';

export function TeamIntro() {
  return (
    <section id="over-ons" className="section-padding bg-[#fefdfc] dark:bg-[#02191c]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <AnimatedSection className="max-w-2xl">
            <h2 className="text-[#4A9C6E] font-semibold tracking-wider text-sm uppercase mb-3">Ons Zorgteam</h2>
            <h3 className="text-3xl md:text-4xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">
              Lokaal talent, landelijke kwaliteit
            </h3>
            <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg">
              Wij geloven dat goede zorg begint bij goede mensen. Ons team bestaat uit gediplomeerde, gepassioneerde zorgverleners uit de regio Parkstad.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <Link 
              to="/over-ons" 
              className="inline-flex items-center text-[#5b7f63] dark:text-[#5cb0bd] font-medium hover:text-[#4A9C6E] transition-colors group"
            >
              Maak kennis met ons hele team 
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <AnimatedSection key={member.id} delay={index * 0.1}>
              <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-[0_4px_24px_rgba(124,154,130,0.1)] transition-transform duration-300 hover:-translate-y-2 cursor-pointer">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#02191c]/90 via-[#02191c]/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Content */}
                <div className="absolute bottom-0 w-full p-6 text-white text-left transition-transform duration-300 flex flex-col justify-end translate-y-8 group-hover:translate-y-0">
                  <span className="text-[#b8d1bc] text-sm uppercase tracking-wider mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {member.role}
                  </span>
                  <h4 className="text-2xl font-heading mb-2">{member.name}</h4>
                  <p className="text-sm text-gray-200 line-clamp-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    "{member.quote}"
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
