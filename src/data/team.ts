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
    name: "Meyrem Bayrak",
    role: "Wijkverpleegkundige & Oprichter",
    qualifications: "Mbo-Verpleegkundige | Indicatiesteller wijkverpleging | BIG-geregistreerd | Kwaliteitsregister V&V | 20+ jaar ervaring",
    quote: "Mijn doel is altijd: zorg verlenen zoals ik die voor mijn eigen ouders zou wensen. Met tijd, respect en oprechte aandacht.",
    image: `/images/team-member-1.webp`
  }
];
