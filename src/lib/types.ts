// Supabase types and constants - use supabase client from @/integrations/supabase/client

export type Section = 'men' | 'women' | 'kids';

// Category type is now dynamic - fetched from database
// These are kept for backward compatibility but the app now uses database categories
export type Category = string;

export interface Product {
  id: string;
  name: string;
  section: Section;
  category: string;
  sub_type: string | null;
  price: number;
  original_price: number | null;
  image: string;
  is_new: boolean | null;
  created_at: string;
  flipkart_link?: string | null;
  amazon_link?: string | null;
  meesho_link?: string | null;
  vanshe_link?: string | null;
  amazon_enabled?: boolean;
  flipkart_enabled?: boolean;
  meesho_enabled?: boolean;
  vanshe_enabled?: boolean;
  buy_now_enabled?: boolean;
}

export const SECTIONS: Section[] = ['men', 'women', 'kids'];

// Legacy CATEGORIES and CATEGORY_LABELS - now dynamic from database
// Kept for backward compatibility, these serve as fallbacks
export const CATEGORIES: Record<Section, string[]> = {
  men: [],
  women: [],
  kids: [],
};

export const CATEGORY_LABELS: Record<string, string> = {};

export const SECTION_LABELS: Record<Section, string> = {
  men: 'Men',
  women: 'Women',
  kids: 'Kids',
};

export const SECTION_HERO_TITLES: Record<Section, string> = {
  men: "MEN'S ATELIER",
  women: "WOMEN'S ATELIER",
  kids: "CHILDREN'S COUTURE",
};

export const COLLECTION_NAMES: Record<Section, string> = {
  men: 'The Heritage Series',
  women: 'The Aeriter Collection',
  kids: 'The Petite Collection',
};
