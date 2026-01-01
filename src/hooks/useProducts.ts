import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product, Section, Category } from '@/lib/types';

// Input validation constants
const MAX_SEARCH_LENGTH = 100;

// Sanitize search input to prevent potential issues
function sanitizeSearchQuery(query: string): string {
  // Trim whitespace and limit length
  const trimmed = query.trim().slice(0, MAX_SEARCH_LENGTH);
  // Remove potentially dangerous characters for LIKE patterns
  return trimmed.replace(/[%_\\]/g, '');
}

interface UseProductsOptions {
  section?: Section;
  category?: Category;
  subType?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest';
  searchQuery?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subTypes, setSubTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [options.section, options.category, options.subType, options.minPrice, options.maxPrice, options.sortBy, options.searchQuery]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('products').select('*');

      if (options.section) {
        query = query.eq('section', options.section);
      }

      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.subType) {
        query = query.eq('sub_type', options.subType);
      }

      if (options.minPrice !== undefined) {
        query = query.gte('price', options.minPrice);
      }

      if (options.maxPrice !== undefined) {
        query = query.lte('price', options.maxPrice);
      }

      if (options.searchQuery) {
        const sanitized = sanitizeSearchQuery(options.searchQuery);
        if (sanitized.length > 0) {
          query = query.ilike('name', `%${sanitized}%`);
        }
      }

      // Apply sorting
      switch (options.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      const finalProducts: Product[] = (data || []) as Product[];
      setProducts(finalProducts);

      // Extract unique sub_types for filters
      const uniqueSubTypes = [...new Set(finalProducts.map(p => p.sub_type).filter(Boolean))] as string[];
      setSubTypes(uniqueSubTypes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, subTypes, refetch: fetchProducts };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    async function fetchProduct() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (fetchError) throw fetchError;
        
        setProduct(data as Product | null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

export function useSearchProducts(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    // Validate and sanitize input
    const sanitized = sanitizeSearchQuery(query);
    if (sanitized.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${sanitized}%`)
          .limit(10);
        
        setResults((data || []) as Product[]);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}
