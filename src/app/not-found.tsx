import Link from 'next/link';

import { Home, ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: "Pagina niet gevonden | Parkstad Thuiszorg",
  description: "Deze pagina bestaat niet. Ga terug naar de homepage van Parkstad Thuiszorg.",
};


export default function NotFoundPage() {
  return (
    <div className="pt-32 pb-20 bg-warm-gradient min-h-screen flex items-center">
      
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="text-8xl font-heading text-[var(--color-sage-300)] dark:text-[var(--color-sage-700)] mb-6">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-heading text-[#064a54] dark:text-[#fefdfc] mb-4">
          Pagina niet gevonden
        </h1>
        <p className="text-[#4f6b6f] dark:text-[#5cb0bd] text-lg mb-10">
          De pagina die u zoekt bestaat niet of is verplaatst. Geen zorgen — we helpen u graag verder.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="primary" size="lg">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Naar de homepage
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="tel:+31626591818">
              <Phone className="w-5 h-5 mr-2" />
              Bel ons direct
            </a>
          </Button>
        </div>
        <p className="mt-12 text-sm text-[#8ab0b6]">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-[var(--color-sage-500)] transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Terug naar home
          </Link>
        </p>
      </div>
    </div>
  );
}
