import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '@/contexts/CartContext';
import { Product } from './useProducts';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country?: string;
}

interface CreateOrderData {
  items: CartItem[];
  products: Product[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
}

function generateOrderNumber(): string {
  const prefix = 'FV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id || null;

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: generateOrderNumber(),
          user_id: userId,
          subtotal: data.subtotal,
          shipping: data.shipping,
          total: data.total,
          shipping_address: JSON.parse(JSON.stringify(data.shippingAddress)),
          status: 'pending',
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = data.items.map(item => {
        const product = data.products.find(p => p.id === item.productId);
        const variant = product?.variants.find(v => v.id === item.variantId);
        const image = product?.images[0];

        return {
          order_id: order.id,
          product_id: item.productId,
          variant_id: item.variantId,
          product_title: product?.title || 'Unknown Product',
          variant_name: variant?.name || 'Default',
          quantity: item.quantity,
          price: variant?.price || 0,
          image_url: image?.url || null,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create initial order event
      await supabase.from('order_events').insert({
        order_id: order.id,
        event_type: 'order_created',
        description: 'Ordre oprettet',
        metadata: {},
      });

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });
}

export function useUserOrders() {
  return useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];

      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch items for each order
      const orderIds = (orders || []).map(o => o.id);
      if (orderIds.length === 0) return [];

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      const itemsByOrder = (items || []).reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      return (orders || []).map(order => ({
        ...order,
        shipping_address: typeof order.shipping_address === 'string'
          ? JSON.parse(order.shipping_address)
          : order.shipping_address,
        items: itemsByOrder[order.id] || [],
      }));
    },
  });
}
