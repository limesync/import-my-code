import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Search, Clock, Check, Truck, Package, X, ChevronRight, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { TranslationKey } from '@/i18n/admin';

export default function AdminOrders() {
  const { orders, isLoading } = useAdminOrders();
  const { t } = useAdminLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const STATUS_CONFIG: Record<string, { labelKey: TranslationKey; color: string; icon: typeof Clock }> = {
    pending: { labelKey: 'status.pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { labelKey: 'status.confirmed', color: 'bg-blue-100 text-blue-800', icon: Check },
    shipped: { labelKey: 'status.shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
    delivered: { labelKey: 'status.delivered', color: 'bg-green-100 text-green-800', icon: Package },
    cancelled: { labelKey: 'status.cancelled', color: 'bg-red-100 text-red-800', icon: X },
    refunded: { labelKey: 'status.refunded' as TranslationKey, color: 'bg-orange-100 text-orange-800', icon: RotateCcw },
  };

  const STATUS_OPTIONS = [
    { value: 'all', labelKey: 'orders.all' as TranslationKey },
    { value: 'pending', labelKey: 'status.pending' as TranslationKey },
    { value: 'confirmed', labelKey: 'status.confirmed' as TranslationKey },
    { value: 'shipped', labelKey: 'status.shipped' as TranslationKey },
    { value: 'delivered', labelKey: 'status.delivered' as TranslationKey },
    { value: 'refunded', labelKey: 'status.refunded' as TranslationKey },
    { value: 'cancelled', labelKey: 'status.cancelled' as TranslationKey },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_address?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">{t('orders.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} {t('orders.totalLabel')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTIONS.map(option => {
          const count = option.value === 'all' ? orders.length : (orderCounts[option.value] || 0);
          const isActive = statusFilter === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {t(option.labelKey)} ({count})
            </button>
          );
        })}
      </div>

      <div className="admin-card mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('orders.search')} className="pl-10" />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all' ? t('orders.noMatch') : t('orders.noOrders')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusConfig.icon;
            return (
              <Link key={order.id} to={`/admin/ordrer/${order.id}`} className="admin-card block hover:shadow-md transition-shadow group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="hidden md:flex w-12 h-12 bg-secondary rounded-lg items-center justify-center flex-shrink-0">
                      <StatusIcon size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-display font-semibold">{order.order_number}</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {t(statusConfig.labelKey)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                        {order.shipping_address?.email && <span className="hidden md:inline"> · {order.shipping_address.email}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden lg:flex -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={item.id} className="w-10 h-10 rounded-lg bg-secondary border-2 border-card overflow-hidden" style={{ zIndex: 3 - i }}>
                          {item.image_url ? (
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-muted-foreground" /></div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-lg bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium">+{order.items.length - 3}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-semibold">{Number(order.total).toLocaleString('da-DK')} kr</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? t('orders.product') : t('orders.productPlural')}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
