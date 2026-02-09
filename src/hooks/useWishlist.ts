import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useWishlist() {
  const { user, isAuthenticated } = useAuthContext();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlistIds = useCallback(async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id);

    if (data) {
      setWishlistIds(new Set(data.map(item => item.product_id)));
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistIds();
    } else {
      setWishlistIds(new Set());
    }
  }, [isAuthenticated, fetchWishlistIds]);

  const isInWishlist = (productId: string) => wishlistIds.has(productId);

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Log ind for at tilføje til ønskeliste');
      return;
    }

    setLoading(true);

    if (isInWishlist(productId)) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        toast.error('Kunne ikke fjerne fra ønskeliste');
      } else {
        setWishlistIds(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success('Fjernet fra ønskeliste');
      }
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: productId });

      if (error) {
        toast.error('Kunne ikke tilføje til ønskeliste');
      } else {
        setWishlistIds(prev => new Set([...prev, productId]));
        toast.success('Tilføjet til ønskeliste');
      }
    }

    setLoading(false);
  };

  return {
    isInWishlist,
    toggleWishlist,
    loading,
    wishlistCount: wishlistIds.size,
  };
}
