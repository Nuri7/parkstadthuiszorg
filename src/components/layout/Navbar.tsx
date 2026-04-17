import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, HeartPulse, Phone } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Diensten', path: '/diensten' },
    { name: 'Over Ons', path: '/over-ons' },
    { name: 'Vergoedingen', path: '/vergoedingen' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#1a2420]/90 backdrop-blur-md shadow-sm border-b border-[#ede7db] dark:border-[#344a3c] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-[#7c9a82] dark:bg-[#5b7f63] text-white p-2 rounded-xl group-hover:bg-[#5b7f63] transition-colors">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="font-heading text-xl md:text-2xl text-[#2d3b2d] dark:text-[#fdfbf7] font-semibold">
              Parkstad Thuiszorg
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#C67D5B] font-semibold'
                    : 'text-[#5b7f63] dark:text-[#94ba9a] hover:text-[#2d3b2d] dark:hover:text-[#fdfbf7] hover:bg-[#f0f5f1] dark:hover:bg-[#243029]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <a href="tel:+31612345678" className="text-[#5b7f63] dark:text-[#94ba9a] hover:text-[#2d3b2d] dark:hover:text-[#fdfbf7] transition-colors flex items-center gap-2 font-medium">
              <Phone className="w-4 h-4" />
              <span>06 1234 5678</span>
            </a>
            <Button asChild variant="primary" size="sm">
              <Link to="/contact">Intake Aanvragen</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-[#5b7f63] dark:text-[#94ba9a]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#1a2420] shadow-lg border-b border-[#ede7db] dark:border-[#344a3c]">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-[#C67D5B] bg-[#fdf4ef] dark:bg-[#3f1f14]'
                    : 'text-[#5b7f63] dark:text-[#94ba9a] hover:bg-[#f0f5f1] dark:hover:bg-[#243029]'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-6 space-y-3 px-3">
              <a href="tel:+31612345678" className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-[#7c9a82] text-[#5b7f63] dark:text-[#94ba9a] font-medium">
                <Phone className="w-5 h-5" />
                Bel 06 1234 5678
              </a>
              <Button asChild variant="primary" className="w-full justify-center">
                <Link to="/contact">Gratis Intakegesprek</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
