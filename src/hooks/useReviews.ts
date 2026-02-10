import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Joined
  profile?: { first_name: string | null; last_name: string | null };
  product?: { title: string; slug: string };
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews' as any)
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ProductReview[];
    },
    enabled: !!productId,
  });
}

export function useUserReviewForProduct(productId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['user-review', productId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews' as any)
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', userId!)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as ProductReview | null;
    },
    enabled: !!productId && !!userId,
  });
}

export function useUserOrdersForProduct(productId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['user-orders-for-product', productId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select('order_id, orders!order_items_order_id_fkey(id, status, user_id)')
        .eq('product_id', productId);
      
      if (error) throw error;
      // Filter to user's delivered/shipped/confirmed orders
      const validOrders = (data || []).filter((item: any) => {
        const order = item.orders;
        return order && order.user_id === userId && ['delivered', 'shipped', 'confirmed'].includes(order.status);
      });
      return validOrders;
    },
    enabled: !!productId && !!userId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { product_id: string; user_id: string; order_id: string; rating: number; title: string; body: string }) => {
      const { data, error } = await supabase
        .from('product_reviews' as any)
        .insert(review)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.product_id] });
      queryClient.invalidateQueries({ queryKey: ['user-review', variables.product_id] });
    },
  });
}

// Admin hooks
export function useAdminReviews() {
  return useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews' as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ProductReview[];
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('product_reviews' as any)
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_reviews' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function getAverageRating(reviews: ProductReview[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
