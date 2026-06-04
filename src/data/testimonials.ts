// Cliëntreviews.
//
// LET OP: hier horen ALLEEN ECHTE, met toestemming gedeelde cliëntervaringen.
// Verzonnen reviews zijn misleidend (oneerlijke handelspraktijk), een AVG- en
// keurmerkrisico (Kiwa), en werken averechts richting verwijzers en cliënten.
//
// Zodra je echte reviews hebt (met schriftelijke toestemming, zie AVG-formulier 03):
//   1. Voeg ze hieronder toe in hetzelfde format.
//   2. Zet <Testimonials /> terug aan in src/app/page.tsx.

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  relation: string;
  rating: number;
}

export const testimonials: Testimonial[] = [];
