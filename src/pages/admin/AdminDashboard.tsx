import { Link } from 'react-router-dom';
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';

export default function AdminDashboard() {
  const { products, isLoading: productsLoading } = useAdminProducts();
  const { orders, isLoading: ordersLoading } = useAdminOrders();
  const { t } = useAdminLocale();

  const isLoading = productsLoading || ordersLoading;

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const lowStock = products.filter(p => p.variants.some(v => v.inventory <= 5)).length;

  const stats = [
    { label: t('dashboard.products'), value: totalProducts, sub: `${activeProducts} ${t('dashboard.active')}`, icon: Package, color: 'text-primary' },
    { label: t('dashboard.orders'), value: totalOrders, sub: `${pendingOrders} ${t('dashboard.pending')}`, icon: ShoppingCart, color: 'text-accent' },
    { label: t('dashboard.revenue'), value: `${totalRevenue.toLocaleString('da-DK')} kr`, sub: t('dashboard.total'), icon: TrendingUp, color: 'text-primary' },
    { label: t('dashboard.lowStock'), value: lowStock, sub: t('dashboard.productsLabel'), icon: AlertTriangle, color: 'text-destructive' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="admin-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <p className="font-display text-2xl font-semibold mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
              </div>
              <stat.icon size={20} className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">{t('dashboard.recentOrders')}</h2>
          <Link to="/admin/ordrer" className="text-xs font-medium uppercase tracking-wider text-primary hover:underline">
            {t('dashboard.viewAll')}
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">{t('dashboard.noOrders')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('dashboard.order')}</th>
                  <th className="text-left py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('dashboard.customer')}</th>
                  <th className="text-left py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('dashboard.status')}</th>
                  <th className="text-right py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t('dashboard.totalCol')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-b border-border/50">
                    <td className="py-3 font-medium">{order.order_number}</td>
                    <td className="py-3 text-muted-foreground">
                      {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                    </td>
                    <td className="py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 text-right font-medium">{Number(order.total).toLocaleString('da-DK')} kr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const { t } = useAdminLocale();
  const styles: Record<string, string> = {
    pending: 'bg-accent/20 text-accent-foreground',
    confirmed: 'bg-primary/20 text-primary',
    shipped: 'bg-primary/10 text-primary',
    delivered: 'bg-primary/20 text-primary',
    cancelled: 'bg-destructive/20 text-destructive',
  };
  const key = `status.${status}` as any;

  return (
    <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${styles[status] || ''}`}>
      {t(key) || status}
    </span>
  );
}
