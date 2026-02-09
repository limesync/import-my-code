import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Package, Clock } from 'lucide-react';

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
  }[];
}

export default function OrdersPage() {
  const { isAuthenticated, loading, user } = useAuthContext();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const statusLabels: Record<string, string> = {
    pending: 'Afventer',
    confirmed: 'Bekræftet',
    shipped: 'Afsendt',
    delivered: 'Leveret',
    cancelled: 'Annulleret',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-accent/20 text-accent',
    confirmed: 'bg-primary/20 text-primary',
    shipped: 'bg-primary/30 text-primary',
    delivered: 'bg-success/20 text-success',
    cancelled: 'bg-destructive/20 text-destructive',
  };

  if (loading || isLoading) {
    return (
      <div className="store-container py-16 text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground mt-4">Indlæser ordrer...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
            <h1 className="font-display text-2xl md:text-3xl text-foreground">
              Mine ordrer
            </h1>
            <p className="text-sm text-muted-foreground">{orders.length} ordrer</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <Clock size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="font-display text-xl text-foreground mb-2">Ingen ordrer endnu</h2>
            <p className="text-muted-foreground mb-6">Når du har afgivet en ordre, vil den blive vist her.</p>
            <Link to="/produkter" className="btn-primary">
              Start med at handle
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-display text-lg font-medium">{order.order_number}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('da-DK', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
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
                      {item.image_url && (
                        <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image_url} alt={item.product_title} className="w-full h-full object-cover" />
                        </div>
                      )}
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
