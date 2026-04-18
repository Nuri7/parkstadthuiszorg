import { Helmet } from 'react-helmet-async';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { MultiStepForm } from '../components/intake/MultiStepForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="pt-32 pb-20 bg-warm-gradient min-h-screen">
      <Helmet>
        <title>Contact & Intake | Parkstad Thuiszorg</title>
        <meta name="description" content="Vraag direct thuiszorg aan of neem contact op met Parkstad Thuiszorg voor een vrijblijvend intakegesprek in Landgraaf, Heerlen of Kerkrade." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-6">
            Neem Contact Op / <span className="text-gradient">Intake Aanvragen</span>
          </h1>
          <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg">
            Heeft u vragen of wilt u direct zorg aanvragen? Vul het onderstaande formulier in of neem telefonisch contact met op voor een vrijblijvend gesprek.
          </p>
        </AnimatedSection>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          <div className="w-full lg:w-5/12">
            <AnimatedSection>
              <div className="bg-[#064a54] dark:bg-[#02191c] text-white p-8 md:p-10 rounded-3xl shadow-xl h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#394f40] dark:bg-[#1e2e25] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <h3 className="text-2xl font-heading mb-8 relative z-10">Onze Gegevens</h3>
                
                <ul className="space-y-8 relative z-10">
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#394f40] dark:bg-[#243029] flex items-center justify-center shrink-0 text-[#b8d1bc]">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[#b8d1bc] text-sm font-semibold mb-1 uppercase tracking-wider">Telefoon</h4>
                      <a href="tel:+31644745471" className="text-xl font-medium hover:text-[#4A9C6E] transition-colors block">06 44 74 54 71</a>
                      <p className="text-[#5cb0bd] text-sm mt-1">24/7 bereikbaar voor spoed</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#394f40] dark:bg-[#243029] flex items-center justify-center shrink-0 text-[#b8d1bc]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[#b8d1bc] text-sm font-semibold mb-1 uppercase tracking-wider">E-mail</h4>
                      <a href="mailto:info@parkstadthuiszorg.nl" className="text-lg font-medium hover:text-[#4A9C6E] transition-colors break-all">info@parkstadthuiszorg.nl</a>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#394f40] dark:bg-[#243029] flex items-center justify-center shrink-0 text-[#b8d1bc]">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[#b8d1bc] text-sm font-semibold mb-1 uppercase tracking-wider">Adres / Hoofdkantoor</h4>
                      <p className="text-lg font-medium leading-relaxed">
                        Hoofdstraat 1<br />
                        6461 AB Kerkrade
                      </p>
                      <p className="text-[#5cb0bd] text-sm mt-1">Regio Parkstad (Landgraaf, Heerlen, Kerkrade)</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#394f40] dark:bg-[#243029] flex items-center justify-center shrink-0 text-[#b8d1bc]">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[#b8d1bc] text-sm font-semibold mb-1 uppercase tracking-wider">Kantoortijden</h4>
                      <p className="text-lg font-medium leading-relaxed">
                        Ma - Vr: 08:30 - 17:00<br />
                      </p>
                      <p className="text-[#5cb0bd] text-sm mt-1">Buiten kantoortijden doorschakeling voor cliënten.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          <div className="w-full lg:w-7/12">
            <AnimatedSection delay={0.2}>
              <MultiStepForm />
            </AnimatedSection>
          </div>
          
        </div>
      </div>
    </div>
  );
}
