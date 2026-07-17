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

// Supabase products table shape
export interface Product {
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
}

// Convert a Supabase product row to a Game for the storefront UI
export function productToGame(product: Product): Game {
  return {
    id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title: product.name,
    genre: 'Uncategorized',
    description: product.description || 'No description provided.',
    price: product.price,
    poster: product.image_url || DEFAULT_LOGO_POSTER,
    released: '',
    platforms: ['PC']
  };
}

export const DEFAULT_LOGO_POSTER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260" fill="none"><rect width="200" height="260" fill="%230c0c0e"/><rect x="2" y="2" width="196" height="256" rx="10" stroke="%23ff2e4d" stroke-width="2" stroke-opacity="0.4"/><path d="M50 110H70M60 100V120" stroke="%23ff2e4d" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="105" r="6" fill="%23ff2e4d"/><circle cx="145" cy="118" r="6" fill="%23ff2e4d"/><path d="M60 155C75 170 125 170 140 155" stroke="%23ff2e4d" stroke-width="4" stroke-linecap="round"/><text x="100" y="220" fill="%23ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="900" letter-spacing="1" text-anchor="middle">YASIN STORE</text></svg>`;

export const staticGames: Game[] = [];
