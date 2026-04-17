import { Link } from 'react-router-dom';
import { HeartPulse, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a2420] text-[#f0f5f1] pt-16 pb-24 md:pb-8 border-t border-[#344a3c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-[#7c9a82] text-white p-1.5 rounded-lg">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-heading text-xl text-white font-semibold">
                Parkstad Thuiszorg
              </span>
            </Link>
            <p className="text-[#94ba9a] text-sm leading-relaxed">
              Persoonlijke, professionele thuiszorg met hart in de regio Parkstad. BIG-geregistreerd en altijd dichtbij als u ons nodig heeft.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg text-white mb-4">Snel Naar</h3>
            <ul className="space-y-3">
              {['Home', 'Diensten', 'Over Ons', 'Vergoedingen', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-[#94ba9a] hover:text-white transition-colors flex items-center gap-2 text-sm group"
                  >
                    <ArrowRight className="w-3 h-3 text-[#7c9a82] group-hover:text-white transition-colors" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="font-heading text-lg text-white mb-4">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="tel:+31612345678" className="flex items-center gap-3 text-[#94ba9a] hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#2d3b2d] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#7c9a82]" />
                  </div>
                  <span>06 1234 5678</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@parkstadthuiszorg.nl" className="flex items-center gap-3 text-[#94ba9a] hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#2d3b2d] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#7c9a82]" />
                  </div>
                  <span>info@parkstadthuiszorg.nl</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-[#94ba9a]">
                <div className="w-8 h-8 rounded-full bg-[#2d3b2d] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#7c9a82]" />
                </div>
                <span>
                  Hoofdstraat 1<br />
                  6461 AB Kerkrade
                </span>
              </li>
            </ul>
          </div>

          {/* Info Col */}
          <div>
            <h3 className="font-heading text-lg text-white mb-4">Werkgebied</h3>
            <p className="text-[#94ba9a] text-sm mb-4">
              Wij zijn voornamelijk actief in de regio Parkstad Limburg:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#2d3b2d] text-[#b8d1bc]">Kerkrade</span>
              <span className="px-3 py-1 rounded-full bg-[#2d3b2d] text-[#b8d1bc]">Heerlen</span>
              <span className="px-3 py-1 rounded-full bg-[#2d3b2d] text-[#b8d1bc]">Landgraaf</span>
              <span className="px-3 py-1 rounded-full bg-[#2d3b2d] text-[#b8d1bc]">Brunssum</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#344a3c] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#7c9a82]">
          <p>&copy; {currentYear} Parkstad Thuiszorg. Alle rechten voorbehouden.</p>
          <div className="flex space-x-4">
            <Link to="/contact" className="hover:text-white transition-colors">Privacybeleid</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Algemene Voorwaarden</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
