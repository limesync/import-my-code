import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { Search, Filter, Clock, Check, Truck, Package, X, Eye, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG = {
  pending: { label: 'Afventer', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Bekræftet', color: 'bg-blue-100 text-blue-800', icon: Check },
  shipped: { label: 'Afsendt', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Leveret', color: 'bg-green-100 text-green-800', icon: Package },
  cancelled: { label: 'Annulleret', color: 'bg-red-100 text-red-800', icon: X },
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'Alle ordrer' },
  { value: 'pending', label: 'Afventer' },
  { value: 'confirmed', label: 'Bekræftet' },
  { value: 'shipped', label: 'Afsendt' },
  { value: 'delivered', label: 'Leveret' },
  { value: 'cancelled', label: 'Annulleret' },
];

export default function AdminOrders() {
  const { orders, isLoading, updateOrderStatus } = useAdminOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">Ordrer</h1>
        <p className="text-sm text-muted-foreground mt-1">{orders.length} ordrer total</p>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTIONS.map(option => {
          const count = option.value === 'all' ? orders.length : (orderCounts[option.value] || 0);
          const isActive = statusFilter === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {option.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="admin-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søg efter ordrenummer, kunde eller email..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all' 
              ? 'Ingen ordrer matcher din søgning' 
              : 'Ingen ordrer endnu'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
            const StatusIcon = statusConfig.icon;
            
            return (
              <Link
                key={order.id}
                to={`/admin/ordrer/${order.id}`}
                className="admin-card block hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="hidden md:flex w-12 h-12 bg-secondary rounded-lg items-center justify-center flex-shrink-0">
                      <StatusIcon size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-display font-semibold">{order.order_number}</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                        {order.shipping_address?.email && (
                          <span className="hidden md:inline"> · {order.shipping_address.email}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleDateString('da-DK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center gap-4">
                    <div className="hidden lg:flex -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div 
                          key={item.id}
                          className="w-10 h-10 rounded-lg bg-secondary border-2 border-card overflow-hidden"
                          style={{ zIndex: 3 - i }}
                        >
                          {item.image_url ? (
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-lg bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="font-display text-lg font-semibold">
                        {Number(order.total).toLocaleString('da-DK')} kr
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? 'produkt' : 'produkter'}
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
