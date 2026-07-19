export interface Game {
  id: string;
  title: string;
  genre: string;
  description: string;
  price: number;
  asiaPrice: number | null;
  poster: string;
  released: string;
  platforms: string[];
  platform: number;
  glowColor?: string | null;
  customGraphic?: string | null;
  tag?: string | null;
  badgeText?: string | null;
  discountPrice?: number | null;
  discountAsiaPrice?: number | null;
  discountUntil?: string | null;
}

// Supabase products table shape (matches exact column names)
export interface Product {
  name: string;
  Price: number;
  asia_price: number | null;
  description: string | null;
  image_url: string | null;
  platform: number; // bitmask — see PLATFORM_OPTIONS
  glow_color?: string | null;
  custom_graphic?: string | null;
  tag?: string | null;
  badge_text?: string | null;
  discount_price?: number | null;
  discount_asia_price?: number | null;
  discount_until?: string | null;
}

// Platform bitmask options — each is a power of 2
export const PLATFORM_OPTIONS = [
  { value: 1,  label: 'PC',          icon: '🖥️' },
  { value: 2,  label: 'PlayStation', icon: '🎮' },
  { value: 4,  label: 'Xbox',        icon: '🟢' },
  { value: 8,  label: 'Nintendo',    icon: '🕹️' },
  { value: 16, label: 'Mobile',      icon: '📱' },
];

// Helper: bitmask → array of labels
export function getPlatformLabels(bitmask: number): string[] {
  return PLATFORM_OPTIONS
    .filter(p => (bitmask & p.value) !== 0)
    .map(p => p.label);
}

// Helper: bitmask → single display string
export function getPlatformLabel(bitmask: number): string {
  const labels = getPlatformLabels(bitmask);
  return labels.length ? labels.join(', ') : 'Unknown';
}

// Helper: toggle a single platform bit
export function togglePlatformBit(current: number, bit: number): number {
  return current ^ bit;
}

// Helper: check if a bit is set
export function hasPlatformBit(bitmask: number, bit: number): boolean {
  return (bitmask & bit) !== 0;
}

// Convert a Supabase product row to a Game for the storefront UI
export function productToGame(product: Product): Game {
  return {
    id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title: product.name,
    genre: 'Uncategorized',
    description: product.description || 'No description provided.',
    price: product.Price,
    asiaPrice: product.asia_price,
    poster: product.image_url || DEFAULT_LOGO_POSTER,
    released: '',
    platforms: getPlatformLabels(product.platform),
    platform: product.platform,
    glowColor: product.glow_color || null,
    customGraphic: product.custom_graphic || null,
    tag: product.tag || null,
    badgeText: product.badge_text || null,
    discountPrice: product.discount_price || null,
    discountAsiaPrice: product.discount_asia_price || null,
    discountUntil: product.discount_until || null,
  };
}

// Helper: truncate a UUID to just the first segment for display
export function shortUUID(uuid: string): string {
  return uuid.split('-')[0].toUpperCase();
}

export const DEFAULT_LOGO_POSTER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260" fill="none"><rect width="200" height="260" fill="%230c0c0e"/><rect x="2" y="2" width="196" height="256" rx="10" stroke="%23ff2e4d" stroke-width="2" stroke-opacity="0.4"/><path d="M50 110H70M60 100V120" stroke="%23ff2e4d" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="105" r="6" fill="%23ff2e4d"/><circle cx="145" cy="118" r="6" fill="%23ff2e4d"/><path d="M60 155C75 170 125 170 140 155" stroke="%23ff2e4d" stroke-width="4" stroke-linecap="round"/><text x="100" y="220" fill="%23ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="900" letter-spacing="1" text-anchor="middle">YASIN STORE</text></svg>`;

export const staticGames: Game[] = [];
