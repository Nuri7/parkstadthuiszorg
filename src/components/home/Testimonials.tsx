"use client";

import { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { AnimatedSection } from '../ui/AnimatedSection';
import { testimonials } from '../../data/testimonials';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };

  const next = () => {
    setCurrentIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  };

  return (
    <section id="ervaringen" className="section-padding bg-white dark:bg-[var(--color-sage-900)]" aria-label="Ervaringen van cliënten">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-[#4A9C6E] font-semibold tracking-wider text-sm uppercase mb-3">Ervaringen</h2>
          <h3 className="text-3xl md:text-4xl font-heading text-[#064a54] dark:text-[#fefdfc]">
            Wat cliënten over ons zeggen
          </h3>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="relative">
          <div 
            className="overflow-hidden relative min-h-[300px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="Cliënt ervaringen"
            aria-live="polite"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') prev();
              if (e.key === 'ArrowRight') next();
            }}
          >
             {testimonials.map((testimonial, idx) => (
                <div 
                  key={testimonial.id}
                  className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out flex flex-col items-center justify-center text-center px-4 md:px-16 ${
                    idx === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
                  }`}
                >
                  <Quote className="w-12 h-12 text-[#b8d1bc] dark:text-[#086370] mb-6 opacity-50" />
                  <p className="text-xl md:text-2xl text-[#064a54] dark:text-[#e2e8e2] font-medium leading-relaxed mb-8">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#FACC15] text-[#FACC15]" />
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-[#5b7f63] dark:text-[#5cb0bd] text-lg">{testimonial.author}</div>
                    <div className="text-sm text-[#4f6b6f] dark:text-[#a0afa0]">{testimonial.relation}</div>
                  </div>
                </div>
             ))}
          </div>

          <div className="flex justify-center gap-4 mt-8 absolute top-[calc(50%-2rem)] -left-4 -right-4 md:-left-12 md:-right-12 z-10 w-[calc(100%+2rem)] md:w-[calc(100%+6rem)] justify-between pointer-events-none">
            <button 
              onClick={prev}
              className="pointer-events-auto p-3 rounded-full bg-white dark:bg-[#02191c] shadow-md border border-[#ede7db] dark:border-[#086370] text-[#5b7f63] hover:bg-[#e5f2f4] dark:hover:bg-[#064a54] transition-colors"
              aria-label="Vorige review"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={next}
              className="pointer-events-auto p-3 rounded-full bg-white dark:bg-[#02191c] shadow-md border border-[#ede7db] dark:border-[#086370] text-[#5b7f63] hover:bg-[#e5f2f4] dark:hover:bg-[#064a54] transition-colors"
              aria-label="Volgende review"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-[#4A9C6E]' : 'bg-[#dce8de] dark:bg-[#476550]'
                }`}
                aria-label={`Ga naar review ${idx + 1}`}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
