import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Package, Truck, Check, X, Clock, Send, MapPin, User, Mail, Phone, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const STATUS_CONFIG = {
  pending: { label: 'Afventer', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Bekræftet', color: 'bg-blue-100 text-blue-800', icon: Check },
  shipped: { label: 'Afsendt', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Leveret', color: 'bg-green-100 text-green-800', icon: Package },
  cancelled: { label: 'Annulleret', color: 'bg-red-100 text-red-800', icon: X },
};

const STATUS_FLOW = ['pending', 'confirmed', 'shipped', 'delivered'];

interface OrderEvent {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const queryClient = useQueryClient();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: async () => {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (orderError) throw orderError;
      if (!orderData) throw new Error('Ordre ikke fundet');

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      const { data: eventsData } = await supabase
        .from('order_events')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      setTrackingNumber(orderData.tracking_number || '');
      setTrackingUrl(orderData.tracking_url || '');
      setNotes(orderData.notes || '');

      return {
        ...orderData,
        shipping_address: typeof orderData.shipping_address === 'string'
          ? JSON.parse(orderData.shipping_address)
          : orderData.shipping_address,
        items: itemsData || [],
        events: (eventsData || []) as OrderEvent[],
      };
    },
    enabled: !!orderId,
  });

  const sendOrderEmail = async (emailType: string, trackingNum?: string, trackingLink?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-order-email', {
        body: { 
          orderId, 
          emailType,
          trackingNumber: trackingNum,
          trackingUrl: trackingLink,
        },
      });
      
      if (error) {
        console.error('Email error:', error);
        return;
      }
      
      if (data?.success) {
        toast.success('Email sendt til kunden');
      } else if (data?.message) {
        console.log('Email info:', data.message);
      }
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  };

  const updateStatus = useMutation({
    mutationFn: async ({ newStatus, sendEmail = true }: { newStatus: string; sendEmail?: boolean }) => {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          status_updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Add event to timeline
      await supabase.from('order_events').insert({
        order_id: orderId,
        event_type: 'status_change',
        description: `Status ændret til ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label || newStatus}`,
        metadata: { new_status: newStatus },
      });

      // Send email based on status change
      if (sendEmail) {
        if (newStatus === 'confirmed') {
          await sendOrderEmail('order_confirmation');
        } else if (newStatus === 'shipped') {
          await sendOrderEmail('order_shipped', trackingNumber, trackingUrl);
        } else if (newStatus === 'delivered') {
          await sendOrderEmail('order_delivered');
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Ordrestatus opdateret');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Kunne ikke opdatere status');
    },
  });

  const saveTracking = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('orders')
        .update({ 
          tracking_number: trackingNumber,
          tracking_url: trackingUrl,
        })
        .eq('id', orderId);

      if (error) throw error;

      if (trackingNumber) {
        await supabase.from('order_events').insert({
          order_id: orderId,
          event_type: 'tracking_added',
          description: `Tracking-nummer tilføjet: ${trackingNumber}`,
          metadata: { tracking_number: trackingNumber, tracking_url: trackingUrl },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] });
      setShowTrackingForm(false);
      toast.success('Tracking-information gemt');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Kunne ikke gemme tracking');
    },
  });

  const saveNotes = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('orders')
        .update({ notes })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', orderId] });
      toast.success('Noter gemt');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Kunne ikke gemme noter');
    },
  });

  const markAsShipped = () => {
    if (!trackingNumber) {
      setShowTrackingForm(true);
      return;
    }
    updateStatus.mutate({ newStatus: 'shipped' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ordre ikke fundet</p>
        <Link to="/admin/ordrer" className="text-primary hover:underline mt-2 inline-block">
          Tilbage til ordrer
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/admin/ordrer" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={16} />
          Tilbage til ordrer
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-semibold">{order.order_number}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                <StatusIcon size={14} />
                {statusConfig.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(order.created_at).toLocaleDateString('da-DK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <p className="font-display text-3xl font-semibold">{Number(order.total).toLocaleString('da-DK')} kr</p>
        </div>
      </div>

      {/* Status Actions */}
      {order.status !== 'cancelled' && order.status !== 'delivered' && (
        <div className="admin-card mb-6">
          <h3 className="font-medium mb-4">Handlinger</h3>
          <div className="flex flex-wrap gap-3">
            {order.status === 'pending' && (
              <Button 
                onClick={() => updateStatus.mutate({ newStatus: 'confirmed' })} 
                className="gap-2"
                disabled={updateStatus.isPending}
              >
                {updateStatus.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Bekræft ordre
              </Button>
            )}
            {order.status === 'confirmed' && (
              <Button 
                onClick={markAsShipped} 
                className="gap-2"
                disabled={updateStatus.isPending}
              >
                {updateStatus.isPending ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
                Markér som afsendt
              </Button>
            )}
            {order.status === 'shipped' && (
              <Button 
                onClick={() => updateStatus.mutate({ newStatus: 'delivered' })} 
                className="gap-2"
                disabled={updateStatus.isPending}
              >
                {updateStatus.isPending ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
                Markér som leveret
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => updateStatus.mutate({ newStatus: 'cancelled', sendEmail: false })}
              className="text-destructive hover:text-destructive"
              disabled={updateStatus.isPending}
            >
              <X size={16} />
              Annuller ordre
            </Button>
          </div>
        </div>
      )}

      {/* Tracking Form */}
      {showTrackingForm && (
        <div className="admin-card mb-6 border-2 border-primary/20">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Send size={18} />
            Tilføj tracking-information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tracking-nummer *</label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="f.eks. 1234567890"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tracking-link (valgfrit)</label>
              <Input
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => { 
                saveTracking.mutate(); 
                updateStatus.mutate({ newStatus: 'shipped' }); 
              }}
              disabled={saveTracking.isPending || updateStatus.isPending}
            >
              {(saveTracking.isPending || updateStatus.isPending) && <Loader2 size={16} className="animate-spin mr-2" />}
              Gem og markér som afsendt
            </Button>
            <Button variant="outline" onClick={() => setShowTrackingForm(false)}>
              Annuller
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="admin-card">
            <h3 className="font-medium mb-4">Produkter</h3>
            <div className="divide-y">
              {order.items.map((item: { id: string; image_url: string | null; product_title: string; variant_name: string; quantity: number; price: number }) => (
                <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.product_title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={24} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product_title}</p>
                    <p className="text-sm text-muted-foreground">{item.variant_name}</p>
                    <p className="text-sm text-muted-foreground">Antal: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{(Number(item.price) * item.quantity).toLocaleString('da-DK')} kr</p>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{Number(order.subtotal).toLocaleString('da-DK')} kr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fragt</span>
                <span>{Number(order.shipping).toLocaleString('da-DK')} kr</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>{Number(order.total).toLocaleString('da-DK')} kr</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="admin-card">
            <h3 className="font-medium mb-4">Tidslinje</h3>
            {order.events.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ingen hændelser endnu</p>
            ) : (
              <div className="space-y-4">
                {order.events.map((event: OrderEvent) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.created_at).toLocaleDateString('da-DK', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="admin-card">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <FileText size={18} />
              Interne noter
            </h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tilføj interne noter om denne ordre..."
              className="mb-3"
              rows={4}
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => saveNotes.mutate()}
              disabled={saveNotes.isPending}
            >
              Gem noter
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="admin-card">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <User size={18} />
              Kunde
            </h3>
            <div className="space-y-3">
              <p className="font-medium">
                {order.shipping_address?.firstName} {order.shipping_address?.lastName}
              </p>
              {order.shipping_address?.email && (
                <a 
                  href={`mailto:${order.shipping_address.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail size={14} />
                  {order.shipping_address.email}
                </a>
              )}
              {order.shipping_address?.phone && (
                <a 
                  href={`tel:${order.shipping_address.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Phone size={14} />
                  {order.shipping_address.phone}
                </a>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="admin-card">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <MapPin size={18} />
              Leveringsadresse
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.zip} {order.shipping_address?.city}</p>
              <p>{order.shipping_address?.country}</p>
            </div>
          </div>

          {/* Tracking */}
          {(order.tracking_number || order.status === 'shipped' || order.status === 'delivered') && (
            <div className="admin-card">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Truck size={18} />
                Tracking
              </h3>
              {order.tracking_number ? (
                <div className="space-y-2">
                  <p className="text-sm font-mono bg-secondary px-3 py-2 rounded">
                    {order.tracking_number}
                  </p>
                  {order.tracking_url && (
                    <a 
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Spor forsendelse →
                    </a>
                  )}
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowTrackingForm(true)}
                  className="w-full"
                >
                  Tilføj tracking
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
