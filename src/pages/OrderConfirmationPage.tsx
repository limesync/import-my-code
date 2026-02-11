import { useEffect } from 'react';
import { Link, useSearchParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/hooks/useProducts';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-confirmation', orderId],
    queryFn: async () => {
      if (!orderId) return null;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      return {
        ...data,
        shipping_address: typeof data.shipping_address === 'string'
          ? JSON.parse(data.shipping_address)
          : data.shipping_address,
        items: items || [],
      };
    },
    enabled: !!orderId,
  });

  if (!orderId) return <Navigate to="/" replace />;

  if (isLoading) {
    return (
      <div className="store-container py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-secondary rounded mx-auto" />
          <div className="h-4 w-64 bg-secondary rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="store-container py-20 text-center">
        <h1 className="font-display text-2xl mb-4">Ordre ikke fundet</h1>
        <Link to="/" className="text-primary hover:underline">Gå til forsiden</Link>
      </div>
    );
  }

  const address = order.shipping_address as any;

  return (
    <div className="store-container py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-primary" />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-accent text-lg">◆</span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-3">
            Tak for din ordre!
          </h1>
          <p className="text-muted-foreground">
            Vi har modtaget din bestilling og sender en bekræftelse snart.
          </p>
        </div>

        {/* Order info card */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-6" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-3 mb-6">
            <Package size={20} className="text-primary" />
            <h2 className="font-display text-lg font-medium">Ordredetaljer</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-muted-foreground mb-1">Ordrenummer</p>
              <p className="font-semibold font-display">{order.order_number}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent">
                Modtaget
              </span>
            </div>
            {address && (
              <>
                <div>
                  <p className="text-muted-foreground mb-1">Leveres til</p>
                  <p className="font-medium">{address.firstName} {address.lastName}</p>
                  <p className="text-muted-foreground">{address.address}</p>
                  <p className="text-muted-foreground">{address.zip} {address.city}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Kontakt</p>
                  <p className="text-muted-foreground">{address.email}</p>
                  {address.phone && <p className="text-muted-foreground">{address.phone}</p>}
                </div>
              </>
            )}
          </div>

          {/* Items */}
          <div className="border-t border-border pt-5 space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.product_title} className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-medium">{item.product_title}</p>
                    <p className="text-xs text-muted-foreground">{item.variant_name} × {item.quantity}</p>
                  </div>
                </div>
                <p className="font-display font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-border mt-5 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fragt</span>
              <span>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
              <span>Total</span>
              <span className="font-display">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Email notice */}
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 flex items-start gap-4 mb-8">
          <Mail size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Bekræftelse sendt</p>
            <p className="text-muted-foreground">
              Vi har sendt en ordrebekræftelse til {address?.email || 'din email'}.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/produkter" className="btn-primary inline-flex items-center justify-center gap-2">
            Fortsæt med at handle <ArrowRight size={16} />
          </Link>
          <Link to="/konto/ordrer" className="px-6 py-3 border border-border rounded-full text-sm font-medium hover:bg-secondary/50 transition-colors text-center">
            Se mine ordrer
          </Link>
        </div>
      </div>
    </div>
  );
}
