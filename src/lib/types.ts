// Supabase types and constants - use supabase client from @/integrations/supabase/client

export type Section = 'men' | 'women' | 'kids';
export type Category = 'pants' | 'shirt' | 't-shirt' | 'boots' | 'accessories' | 'perfumes' | 'toys';

export interface Product {
  id: string;
  name: string;
  section: Section;
  category: Category;
  sub_type: string | null;
  price: number;
  original_price: number | null;
  image: string;
  is_new: boolean | null;
  created_at: string;
  flipkart_link?: string | null;
  amazon_link?: string | null;
}

export const SECTIONS: Section[] = ['men', 'women', 'kids'];

export const CATEGORIES: Record<Section, Category[]> = {
  men: ['pants', 'shirt', 't-shirt', 'boots', 'accessories', 'perfumes'],
  women: ['pants', 'shirt', 't-shirt', 'boots', 'accessories', 'perfumes'],
  kids: ['pants', 'shirt', 't-shirt', 'boots', 'accessories', 'toys'],
};

export const CATEGORY_LABELS: Record<Category, string> = {
  pants: 'Pants',
  shirt: 'Shirts',
  't-shirt': 'T-Shirts',
  boots: 'Boots',
  accessories: 'Accessories',
  perfumes: 'Perfumes',
  toys: 'Toys',
};

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
