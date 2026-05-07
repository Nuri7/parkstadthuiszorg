export interface TeamMember {
  id: number;
  name: string;
  role: string;
  qualifications: string;
  quote: string;
  image: string;
}

export const team: TeamMember[] = [
  {
    id: 1,
    name: "Meyrem",
    role: "Wijkverpleegkundige & Oprichter",
    qualifications: "BIG-geregistreerd | HBO-V | 12+ jaar ervaring",
    quote: "Mijn doel is altijd: zorg verlenen zoals ik die voor mijn eigen ouders zou wensen. Met tijd, respect en oprechte aandacht.",
    image: `${import.meta.env.BASE_URL}images/team-member-1.webp`
  },
  {
    id: 2,
    name: "Bram",
    role: "Verpleegkundige",
    qualifications: "BIG-geregistreerd | HBO-V | Palliatieve zorg",
    quote: "Het mooiste aan dit werk is de band die je opbouwt. Je stapt letterlijk het leven van mensen binnen. Dat vertrouwen is heel bijzonder.",
    image: `${import.meta.env.BASE_URL}images/team-member-2.webp`
  },
  {
    id: 3,
    name: "Sandra",
    role: "Verzorgende IG",
    qualifications: "Gediplomeerd IG | Dementie-specialisatie | Sjpreecht plat",
    quote: "Een grapje, een hand op je schouder, even luisteren. Dat is minstens zo belangrijk als de medische handeling zelf.",
    image: `${import.meta.env.BASE_URL}images/team-member-3.webp`
  }
];
