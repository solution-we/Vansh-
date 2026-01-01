import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SiteImage {
  id: string;
  image_key: string;
  image_url: string;
  description: string | null;
  page: string;
  image_type: string;
  section: string | null;
  category: string | null;
}

export function useSiteImages(page?: string) {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, [page]);

  const fetchImages = async () => {
    try {
      let query = supabase
        .from('site_images')
        .select('*');

      if (page) {
        query = query.eq('page', page);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Convert to a key-value map for easy access
      const imageMap: Record<string, string> = {};
      (data || []).forEach((img: SiteImage) => {
        imageMap[img.image_key] = img.image_url;
      });

      setImages(imageMap);
    } catch (error) {
      console.error('Error fetching site images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image with fallback placeholder
  const getImage = (key: string, fallbackText?: string): string => {
    if (images[key] && images[key].length > 0) {
      return images[key];
    }
    // Return a placeholder data URL with the description text
    return '';
  };

  return { images, loading, getImage, refetch: fetchImages };
}

export function useAllSiteImages() {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .order('page')
        .order('image_type')
        .order('section');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching site images:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateImage = async (id: string, imageUrl: string) => {
    const { error } = await supabase
      .from('site_images')
      .update({ image_url: imageUrl })
      .eq('id', id);

    if (error) throw error;
    await fetchImages();
  };

  return { images, loading, refetch: fetchImages, updateImage };
}
