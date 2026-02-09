import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminOrder {
  id: string;
  order_number: string;
  user_id: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  shipping_address: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
  created_at: string;
  items: AdminOrderItem[];
}

export interface AdminOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_title: string;
  variant_name: string;
  quantity: number;
  price: number;
  image_url: string | null;
}

export function useAdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items
      const orderIds = ordersData.map(o => o.id);
      
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      if (itemsError) throw itemsError;

      const itemsByOrder = (itemsData || []).reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push(item);
        return acc;
      }, {} as Record<string, AdminOrderItem[]>);

      return ordersData.map(o => ({
        ...o,
        shipping_address: typeof o.shipping_address === 'string' 
          ? JSON.parse(o.shipping_address) 
          : o.shipping_address,
        items: itemsByOrder[o.id] || [],
      })) as AdminOrder[];
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Ordrestatus opdateret');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunne ikke opdatere ordrestatus');
    },
  });

  return {
    orders,
    isLoading,
    error,
    updateOrderStatus,
  };
}
