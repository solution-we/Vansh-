import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryData {
  id: string;
  name: string;
  display_name: string;
  section: string;
  thumbnail_url: string;
}

export const useCategories = (section?: string) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [section]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = () => {
    fetchCategories();
  };

  // Helper to get category display name
  const getCategoryLabel = (categoryName: string): string => {
    const category = categories.find(c => c.name === categoryName);
    return category?.display_name || categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, ' ');
  };

  // Get category names for a section
  const getCategoryNames = (): string[] => {
    return categories.map(c => c.name);
  };

  return { categories, loading, refetch, getCategoryLabel, getCategoryNames };
};

export const useAllCategories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllCategories = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const refetch = () => {
    fetchAllCategories();
  };

  // Get all category labels as a map
  const getCategoryLabels = (): Record<string, string> => {
    const labels: Record<string, string> = {};
    categories.forEach(c => {
      labels[c.name] = c.display_name;
    });
    return labels;
  };

  // Get categories for a specific section
  const getCategoriesForSection = (section: string): CategoryData[] => {
    return categories.filter(c => c.section === section);
  };

  // Get category names for a section
  const getCategoryNamesForSection = (section: string): string[] => {
    return categories.filter(c => c.section === section).map(c => c.name);
  };

  // Get category display name
  const getCategoryLabel = (categoryName: string): string => {
    const category = categories.find(c => c.name === categoryName);
    return category?.display_name || categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, ' ');
  };

  // Check if a category exists in a section
  const categoryExistsInSection = (section: string, categoryName: string): boolean => {
    return categories.some(c => c.section === section && c.name === categoryName);
  };

  return { 
    categories, 
    loading, 
    refetch, 
    getCategoryLabels, 
    getCategoriesForSection,
    getCategoryNamesForSection,
    getCategoryLabel,
    categoryExistsInSection
  };
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
