import { Product } from './types';

// Sample products for demonstration when database is empty
export const SAMPLE_PRODUCTS: Product[] = [
  // Men
  {
    id: 'sample-men-boots-1',
    name: 'Heritage Leather Boots',
    section: 'men',
    category: 'boots',
    sub_type: 'formal',
    price: 12999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-men-shirt-1',
    name: 'Oxford Cotton Shirt',
    section: 'men',
    category: 'shirt',
    sub_type: 'formal',
    price: 4999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-men-pants-1',
    name: 'Tailored Wool Trousers',
    section: 'men',
    category: 'pants',
    sub_type: 'formal',
    price: 7999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-men-tshirt-1',
    name: 'Premium Cotton Tee',
    section: 'men',
    category: 't-shirt',
    sub_type: 'casual',
    price: 2499,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    is_new: true,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-men-accessories-1',
    name: 'Italian Leather Belt',
    section: 'men',
    category: 'accessories',
    sub_type: 'belt',
    price: 3499,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-men-perfumes-1',
    name: 'Noir Essence EDT',
    section: 'men',
    category: 'perfumes',
    sub_type: 'eau de toilette',
    price: 8999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },

  // Women
  {
    id: 'sample-women-boots-1',
    name: 'Suede Ankle Boots',
    section: 'women',
    category: 'boots',
    sub_type: 'ankle',
    price: 11999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-women-shirt-1',
    name: 'Silk Blouse',
    section: 'women',
    category: 'shirt',
    sub_type: 'formal',
    price: 6999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=500&fit=crop',
    is_new: true,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-women-pants-1',
    name: 'High-Waist Trousers',
    section: 'women',
    category: 'pants',
    sub_type: 'formal',
    price: 5999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-women-tshirt-1',
    name: 'Relaxed Fit Tee',
    section: 'women',
    category: 't-shirt',
    sub_type: 'casual',
    price: 2299,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-women-accessories-1',
    name: 'Pearl Necklace Set',
    section: 'women',
    category: 'accessories',
    sub_type: 'jewelry',
    price: 4999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-women-perfumes-1',
    name: 'Floral Rose Parfum',
    section: 'women',
    category: 'perfumes',
    sub_type: 'eau de parfum',
    price: 9999,
    original_price: 12999,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },

  // Kids
  {
    id: 'sample-kids-boots-1',
    name: 'Canvas Sneaker Boots',
    section: 'kids',
    category: 'boots',
    sub_type: 'casual',
    price: 3999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=500&fit=crop',
    is_new: true,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-kids-shirt-1',
    name: 'Striped Cotton Shirt',
    section: 'kids',
    category: 'shirt',
    sub_type: 'casual',
    price: 1999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-kids-pants-1',
    name: 'Cargo Joggers',
    section: 'kids',
    category: 'pants',
    sub_type: 'casual',
    price: 2499,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-kids-tshirt-1',
    name: 'Graphic Print Tee',
    section: 'kids',
    category: 't-shirt',
    sub_type: 'casual',
    price: 1499,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-kids-accessories-1',
    name: 'Fun Backpack',
    section: 'kids',
    category: 'accessories',
    sub_type: 'bag',
    price: 2999,
    original_price: null,
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
  {
    id: 'sample-kids-toys-1',
    name: 'Wooden Building Blocks',
    section: 'kids',
    category: 'toys',
    sub_type: 'educational',
    price: 1999,
    original_price: 2499,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=500&fit=crop',
    is_new: false,
    created_at: new Date().toISOString(),
    flipkart_link: null,
    amazon_link: null
  },
];

export function getSampleProducts(section?: string, category?: string): Product[] {
  let filtered = SAMPLE_PRODUCTS;
  
  if (section) {
    filtered = filtered.filter(p => p.section === section);
  }
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  return filtered;
}

export function getSampleProduct(id: string): Product | null {
  return SAMPLE_PRODUCTS.find(p => p.id === id) || null;
}
