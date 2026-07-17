export interface Game {
  id: string;
  title: string;
  genre: string;
  description: string;
  price: number;
  poster: string;
  released: string;
  platforms: string[];
}

export const staticGames: Game[] = [
  {
    id: 'neon-syndicate',
    title: 'Neon Syndicate',
    genre: 'Cyberpunk Action',
    description: 'Navigate the neon-drenched streets of a futuristic metropolis, hacking systems and fighting corporate overlords.',
    price: 75000,
    poster: '/images/neon-syndicate.png',
    released: '2025-11-12',
    platforms: ['PC', 'PS5', 'Xbox Series X']
  },
  {
    id: 'eldritch-realms',
    title: 'Eldritch Realms',
    genre: 'Dark Fantasy RPG',
    description: 'Embark on an epic journey through a cursed kingdom, mastering ancient spells and slaying mythical beasts.',
    price: 60000,
    poster: '/images/eldritch-realms.png',
    released: '2026-03-24',
    platforms: ['PC', 'PS5']
  },
  {
    id: 'apex-velocity',
    title: 'Apex Velocity',
    genre: 'Racing Simulation',
    description: 'Feel the adrenaline in this high-speed, realistic street racing simulator with customizable supercars.',
    price: 50000,
    poster: '/images/apex-velocity.png',
    released: '2025-08-05',
    platforms: ['PC', 'PS5', 'Xbox Series X', 'Switch']
  },
  {
    id: 'starfall-horizon',
    title: 'Starfall: Horizon',
    genre: 'Sci-Fi Exploration',
    description: 'Explore uncharted galaxies, gather resources, and build your space empire in this open-world sandbox.',
    price: 40000,
    poster: '/images/starfall-horizon.png',
    released: '2026-01-15',
    platforms: ['PC', 'Xbox Series X']
  },
  {
    id: 'shadow-vanguard',
    title: 'Shadow Vanguard',
    genre: 'Tactical Stealth',
    description: 'Execute covert missions behind enemy lines, utilizing stealth, high-tech gadgets, and lethal precision.',
    price: 55000,
    poster: '/images/shadow-vanguard.png',
    released: '2025-06-18',
    platforms: ['PC', 'PS5', 'Xbox Series X']
  }
];
