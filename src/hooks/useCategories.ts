import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  display_name: string;
  section: string;
  thumbnail_url: string;
}

export const useCategories = (section?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [section]);

  const fetchCategories = async () => {
    try {
      let query = supabase
        .from('categories')
        .select('*')
        .order('display_name');

      if (section) {
        query = query.eq('section', section);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setLoading(true);
    fetchCategories();
  };

  return { categories, loading, refetch };
};

export const useAllCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('section')
          .order('display_name');

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  return { categories, loading };
};

// Get unique category names for dropdowns (across all sections)
export const useUniqueCategoryNames = () => {
  const { categories, loading } = useAllCategories();
  
  const uniqueCategories = categories.reduce((acc, cat) => {
    if (!acc.find(c => c.name === cat.name)) {
      acc.push({ name: cat.name, display_name: cat.display_name });
    }
    return acc;
  }, [] as { name: string; display_name: string }[]);

  return { uniqueCategories, loading };
};
