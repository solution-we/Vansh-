import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

interface WishlistItem {
  id: string;
  product: Product;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  totalItems: number;
  loading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuthContext();

  const fetchWishlistItems = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          product_id,
          products (
            id,
            name,
            price,
            original_price,
            image,
            section,
            category,
            sub_type,
            is_new
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const wishlistItems: WishlistItem[] = (data || []).map((item: any) => ({
        id: item.id,
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          original_price: item.products.original_price,
          image: item.products.image,
          section: item.products.section,
          category: item.products.category,
          sub_type: item.products.sub_type,
          is_new: item.products.is_new,
          created_at: item.products.created_at || new Date().toISOString(),
        },
      }));

      setItems(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [user]);

  const addToWishlist = async (product: Product): Promise<boolean> => {
    if (!user) return false;

    // Check if already in wishlist
    if (isInWishlist(product.id)) return true;

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          product_id: product.id,
        });

      if (error) throw error;
      await fetchWishlistItems();
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!user) return false;

    // Find the wishlist item by product ID
    const wishlistItem = items.find(item => item.product.id === productId);
    if (!wishlistItem) return false;

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItem.id)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== wishlistItem.id));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  const getWishlistItemId = (productId: string): string | undefined => {
    const item = items.find(item => item.product.id === productId);
    return item?.id;
  };

  const clearWishlist = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        totalItems: items.length,
        loading,
        refreshWishlist: fetchWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

// Helper hook to get wishlist item ID by product ID
export function useWishlistItemId(productId: string): string | undefined {
  const { items } = useWishlist();
  const item = items.find(item => item.product.id === productId);
  return item?.id;
}
