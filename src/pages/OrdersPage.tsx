import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Package, Clock } from 'lucide-react';
import { getProductImage } from '@/hooks/useProducts';

interface Order {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  items: {
    id: string;
    product_title: string;
    variant_name: string;
    quantity: number;
    price: number;
    image_url: string | null;
    product_id: string | null;
  }[];
}

// Slug lookup cache
const slugCache: Record<string, string> = {};

export default function OrdersPage() {
  const { isAuthenticated, loading, user } = useAuthContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productSlugs, setProductSlugs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        setIsLoading(false);
        return;
      }

      if (ordersData.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const orderIds = ordersData.map(o => o.id);
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

      // Fetch product slugs for image lookup
      const productIds = [...new Set((itemsData || []).filter(i => i.product_id).map(i => i.product_id!))];
      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from('products')
          .select('id, slug')
          .in('id', productIds);
        
        const slugMap: Record<string, string> = {};
        (products || []).forEach(p => { slugMap[p.id] = p.slug; });
        setProductSlugs(slugMap);
      }

      const itemsByOrder: Record<string, Order['items']> = {};
      (itemsData || []).forEach(item => {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
        itemsByOrder[item.order_id].push(item);
      });

      setOrders(ordersData.map(o => ({
        ...o,
        items: itemsByOrder[o.id] || [],
      })));
      setIsLoading(false);
    }

    if (user) fetchOrders();
  }, [user]);

  const statusLabels: Record<string, string> = {
    pending: 'Afventer',
    confirmed: 'Bekræftet',
    shipped: 'Afsendt',
    delivered: 'Leveret',
    cancelled: 'Annulleret',
    refunded: 'Refunderet',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-accent/15 text-accent',
    confirmed: 'bg-primary/15 text-primary',
    shipped: 'bg-accent/10 text-accent',
    delivered: 'bg-success/15 text-success',
    cancelled: 'bg-destructive/15 text-destructive',
    refunded: 'bg-muted text-muted-foreground',
  };

  if (loading || isLoading) {
    return (
      <div className="store-container py-16 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const getItemImage = (item: Order['items'][0]) => {
    // Try product slug first for local images
    if (item.product_id && productSlugs[item.product_id]) {
      return getProductImage(productSlugs[item.product_id]);
    }
    // Fallback to stored URL
    if (item.image_url && !item.image_url.startsWith('/local')) {
      return item.image_url;
    }
    return '/placeholder.svg';
  };

  return (
    <div className="store-container py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/konto"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider mb-6"
        >
          <ArrowLeft size={14} /> Tilbage til konto
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Package size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground">Mine ordrer</h1>
            <p className="text-sm text-muted-foreground">{orders.length} ordrer</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <Clock size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="font-display text-xl text-foreground mb-2">Ingen ordrer endnu</h2>
            <p className="text-muted-foreground mb-6">Når du har afgivet en ordre, vil den blive vist her.</p>
            <Link to="/produkter" className="btn-primary">Start med at handle</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-5 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-display text-lg font-medium">{order.order_number}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-secondary text-foreground'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="font-display text-lg font-semibold">
                      {Number(order.total).toLocaleString('da-DK')} kr
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                        <img src={getItemImage(item)} alt={item.product_title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product_title}</p>
                        <p className="text-xs text-muted-foreground">{item.variant_name} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{(Number(item.price) * item.quantity).toLocaleString('da-DK')} kr</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
