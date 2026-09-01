"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Mail, MapPin, Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { useAnchorNavigation } from '../../hooks/useAnchorNavigation';
import { gemeenten } from '../../data/gemeenten';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { handleNavClick } = useAnchorNavigation();
  const pathname = usePathname();

  // Verberg de footer op de admin- en login-pagina's
  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  return (
    <footer className="bg-[#02191c] text-[#e5f2f4] pt-16 pb-24 md:pb-8 border-t border-[#086370]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img 
                src={`/images/logo.svg`} 
                alt="Parkstad Thuiszorg logo" 
                className="w-8 h-8"
              />
              <span className="font-heading text-xl text-[var(--color-beige-50)] font-semibold">
                Parkstad Thuiszorg
              </span>
            </Link>
            <p className="text-[var(--color-sage-300)] text-sm leading-relaxed">
              Een vertrouwd gezicht, een gerust gevoel. Professionele thuiszorg in de regio Parkstad. BIG-geregistreerd en altijd dichtbij als u ons nodig heeft.
            </p>
            <dl className="mt-4 text-xs text-[var(--color-sage-400)] space-y-1">
              <div className="flex gap-2">
                <dt className="font-semibold text-[var(--color-sage-300)]">Handelsnaam:</dt>
                <dd>Parkstad Thuiszorg</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-[var(--color-sage-300)]">KvK:</dt>
                <dd>42026060</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-[var(--color-sage-300)]">AGB-code:</dt>
                <dd>91133634</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-[var(--color-sage-300)]">BIG-nummer:</dt>
                <dd>19923300630</dd>
              </div>
            </dl>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg text-[var(--color-beige-50)] mb-4">Snel Naar</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Diensten', path: '/#diensten' },
                { name: 'Hoe het Werkt', path: '/#hoe-werkt-het' },
                { name: 'Over Ons', path: '/#over-ons' },
                { name: 'Kennisbank', path: '/kennisbank' },
                { name: 'Contact', path: '/#contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                    className="text-[var(--color-sage-300)] hover:text-white transition-colors flex items-center gap-2 text-sm group"
                  >
                    <ArrowRight className="w-3 h-3 text-[var(--color-sage-400)] group-hover:text-white transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="font-heading text-lg text-[var(--color-beige-50)] mb-4">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="tel:+31626591818" className="flex items-center gap-3 text-[var(--color-sage-300)] hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-sage-800)] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[var(--color-sage-400)]" />
                  </div>
                  <span>06 26 59 18 18</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/31626591818" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-sage-300)] hover:text-[#25D366] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-sage-800)] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <span>WhatsApp ons</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@parkstadthuiszorg.nl" className="flex items-center gap-3 text-[var(--color-sage-300)] hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-sage-800)] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[var(--color-sage-400)]" />
                  </div>
                  <span>info@parkstadthuiszorg.nl</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-[var(--color-sage-300)]">
                <div className="w-8 h-8 rounded-full bg-[var(--color-sage-800)] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[var(--color-sage-400)]" />
                </div>
                <span>
                  Kerkrade, regio Parkstad Limburg
                </span>
              </li>
            </ul>
          </div>

          {/* Info Col */}
          <div>
            <h3 className="font-heading text-lg text-[var(--color-beige-50)] mb-4">Werkgebied</h3>
            <p className="text-[var(--color-sage-300)] text-sm mb-4">
              Wij zijn voornamelijk actief in de regio Parkstad Limburg:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {gemeenten.map((g) => (
                <Link
                  key={g.slug}
                  href={`/thuiszorg/${g.slug}`}
                  className="px-3 py-1 rounded-full bg-[var(--color-sage-800)] text-[var(--color-sage-200)] hover:bg-[var(--color-sage-700)] hover:text-white transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[var(--color-sage-700)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--color-sage-400)]">
          <p>&copy; {currentYear} Parkstad Thuiszorg. Alle rechten voorbehouden.</p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacybeleid</Link>
            <Link href="/voorwaarden" className="hover:text-white transition-colors">Algemene Voorwaarden</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
