"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

const NAV_LINKS = [
  { name: 'Zorgvormen', path: '/#diensten' },
  { name: 'Waarom Wij', path: '/#waarom-ons' },
  { name: 'Ons Team', path: '/#over-ons' },
  { name: 'Contact', path: '/#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const location = { pathname }; // mocked for smooth transition

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate: resetting UI state on navigation
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;
    
    // Intersection Observer for scroll-spy
    const observers = NAV_LINKS.map(link => {
      if (!link.path.startsWith('/#')) return null;
      const id = link.path.substring(2);
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setActiveSection(link.path);
          }
        },
        { rootMargin: '-10% 0px -80% 0px' }
      );
      observer.observe(element);
      return observer;
    });
    
    // Reset active section if at top
    const handleTopScroll = () => {
      if (window.scrollY < 100) setActiveSection('/');
    };
    window.addEventListener('scroll', handleTopScroll);

    return () => {
      observers.forEach(obs => obs?.disconnect());
      window.removeEventListener('scroll', handleTopScroll);
    }
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('/#') && location.pathname === '/') {
      e.preventDefault();
      const id = path.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', path);
        setActiveSection(path);
      }
      setIsMobileMenuOpen(false);
    } else if (path === '/' && location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      setActiveSection('/');
      setIsMobileMenuOpen(false);
    }
  };

  // Verberg de publieke navigatie op de admin- en login-pagina's
  if (pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#02191c]/90 backdrop-blur-md shadow-sm border-b border-[#ede7db] dark:border-[#086370] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo.svg"
              alt="Parkstad Thuiszorg logo"
              width={40}
              height={40}
              className="w-10 h-10 group-hover:scale-105 transition-transform"
            />
            <span className="font-heading text-xl md:text-2xl text-[#064a54] dark:text-[#fefdfc] font-semibold">
              Parkstad Thuiszorg
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {NAV_LINKS.map((link) => {
              // Determine active state - either by path matching (for separate pages) or scroll-spy matched hash
              const isActive = (location.pathname !== '/' && location.pathname === link.path) || 
                               (location.pathname === '/' && activeSection === link.path);
              
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-[#0A7C8C] font-semibold tracking-wide'
                      : 'text-[var(--color-sage-600)] dark:text-[var(--color-sage-300)] hover:text-[#0A7C8C] hover:bg-[#e5f2f4] dark:hover:bg-[#02191c]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-[#5b7f63] dark:text-[#5cb0bd]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#02191c] shadow-lg border-b border-[#ede7db] dark:border-[#086370]">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = (location.pathname !== '/' && location.pathname === link.path) || 
                               (location.pathname === '/' && activeSection === link.path);
              
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'text-[#0A7C8C] bg-[#e5f2f4] dark:bg-[#02191c]'
                      : 'text-[var(--color-sage-600)] dark:text-[var(--color-sage-300)] hover:bg-[#e5f2f4] dark:hover:bg-[#043138]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

          </div>
        </div>
      )}
    </header>
  );
}
