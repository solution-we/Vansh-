import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  color_hex: string | null;
  stock: number;
  is_available: boolean | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  color: string | null;
  is_primary: boolean | null;
  is_common: boolean | null;
  display_order: number | null;
  alt_text: string | null;
}

export interface Size {
  value: string;
  label: string;
  inStock: boolean;
}

export interface Color {
  value: string;
  label: string;
  hex: string;
  inStock: boolean;
}

export function useProductVariants(productId: string) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    async function fetchVariants() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productId);

        if (fetchError) throw fetchError;
        
        setVariants(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch variants');
      } finally {
        setLoading(false);
      }
    }

    fetchVariants();
  }, [productId]);

  // Parse sizes from variants - sizes can be comma-separated
  const sizes: Size[] = variants.length > 0
    ? (() => {
        const sizeSet = new Map<string, boolean>();
        variants.forEach(v => {
          // Handle comma-separated sizes like "XS, S, M, L, XL"
          const sizeParts = v.size.split(',').map(s => s.trim());
          sizeParts.forEach(size => {
            if (size) {
              const isInStock = v.is_available !== false && v.stock > 0;
              // If size already exists, keep inStock as true if any variant has it in stock
              if (sizeSet.has(size)) {
                sizeSet.set(size, sizeSet.get(size) || isInStock);
              } else {
                sizeSet.set(size, isInStock);
              }
            }
          });
        });
        return Array.from(sizeSet.entries()).map(([size, inStock]) => ({
          value: size,
          label: size,
          inStock,
        }));
      })()
    : [];

  // Parse colors from variants
  const colors: Color[] = variants.length > 0
    ? (() => {
        const colorMap = new Map<string, { hex: string; inStock: boolean }>();
        variants.forEach(v => {
          const isInStock = v.is_available !== false && v.stock > 0;
          if (colorMap.has(v.color)) {
            const existing = colorMap.get(v.color)!;
            colorMap.set(v.color, {
              hex: existing.hex,
              inStock: existing.inStock || isInStock,
            });
          } else {
            colorMap.set(v.color, {
              hex: v.color_hex || '#000000',
              inStock: isInStock,
            });
          }
        });
        return Array.from(colorMap.entries()).map(([color, data]) => ({
          value: color.toLowerCase().replace(/\s+/g, '-'),
          label: color,
          hex: data.hex,
          inStock: data.inStock,
        }));
      })()
    : [];

  // Check overall stock status
  const hasStock = variants.some(v => v.is_available !== false && v.stock > 0);
  const lowStock = variants.some(v => v.is_available !== false && v.stock > 0 && v.stock < 10);
  const stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' = 
    !hasStock ? 'out-of-stock' : lowStock ? 'low-stock' : 'in-stock';

  return { variants, sizes, colors, stockStatus, loading, error, hasVariants: variants.length > 0 };
}

export function useProductImages(productId: string, selectedColor?: string | null) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    async function fetchImages() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', productId)
          .order('display_order', { ascending: true });

        if (fetchError) throw fetchError;
        
        setImages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch images');
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [productId]);

  // Normalize color for comparison
  const normalizeColor = (color: string | null | undefined) => 
    color?.toLowerCase().replace(/\s+/g, '-') || '';

  // Filter images based on selected color
  const filteredImages = images.length > 0
    ? (() => {
        // Get common images (always shown)
        const commonImages = images.filter(img => img.is_common);
        
        console.log('[useProductImages] All images:', images.map(i => ({ color: i.color, is_common: i.is_common, url: i.image_url.slice(-20) })));
        console.log('[useProductImages] Selected color:', selectedColor);
        console.log('[useProductImages] Normalized selected color:', normalizeColor(selectedColor));
        
        // Get color-specific images
        const colorImages = selectedColor
          ? images.filter(img => {
              const imgColorNorm = normalizeColor(img.color);
              const selectedColorNorm = normalizeColor(selectedColor);
              console.log(`[useProductImages] Comparing: "${imgColorNorm}" === "${selectedColorNorm}" = ${imgColorNorm === selectedColorNorm}`);
              return !img.is_common && imgColorNorm === selectedColorNorm;
            })
          : [];

        console.log('[useProductImages] Color-specific images found:', colorImages.length);

        // If no color selected or no color-specific images, show primary or first available
        const fallbackImages = colorImages.length === 0
          ? images.filter(img => !img.is_common)
          : [];

        // Combine: color-specific first, then common, then fallback
        const combined = colorImages.length > 0 
          ? [...colorImages, ...commonImages]
          : [...fallbackImages, ...commonImages];
        
        console.log('[useProductImages] Final combined images:', combined.length);
        
        // Return unique images by URL
        const seen = new Set<string>();
        return combined.filter(img => {
          if (seen.has(img.image_url)) return false;
          seen.add(img.image_url);
          return true;
        });
      })()
    : [];

  const imageUrls = filteredImages.map(img => img.image_url);

  return { images, filteredImages, imageUrls, loading, error, hasImages: images.length > 0 };
}
