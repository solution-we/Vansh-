import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CommonColor {
  id: string;
  name: string;
  hex_code: string;
}

export const useCommonColors = () => {
  const [colors, setColors] = useState<CommonColor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const { data, error } = await supabase
        .from('common_colors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setColors(data || []);
    } catch (error) {
      console.error('Error fetching common colors:', error);
    } finally {
      setLoading(false);
    }
  };

  return { colors, loading, refetch: fetchColors };
};
