import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Image, ArrowLeft, Settings, Star } from 'lucide-react';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';

export default function AdminSidebar() {
  const { t } = useAdminLocale();

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: t('sidebar.dashboard'), end: true },
    { to: '/admin/produkter', icon: Package, label: t('sidebar.products'), end: false },
    { to: '/admin/ordrer', icon: ShoppingCart, label: t('sidebar.orders'), end: false },
    { to: '/admin/anmeldelser', icon: Star, label: t('sidebar.reviews'), end: false },
    { to: '/admin/forside', icon: Image, label: t('sidebar.frontpage'), end: false },
    { to: '/admin/indstillinger', icon: Settings, label: t('sidebar.settings'), end: false },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Thumbie
        </h2>
        <p className="text-xs text-muted-foreground mt-1">{t('sidebar.admin')}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={18} />
          {t('sidebar.backToShop')}
        </NavLink>
      </div>
    </aside>
  );
}
