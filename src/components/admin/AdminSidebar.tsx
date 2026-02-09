import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Image, ArrowLeft, Settings } from 'lucide-react';

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/produkter', icon: Package, label: 'Produkter', end: false },
  { to: '/admin/ordrer', icon: ShoppingCart, label: 'Ordrer', end: false },
  { to: '/admin/forside', icon: Image, label: 'Forside', end: false },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="font-display text-xl font-semibold text-sidebar-foreground">
          Thumbie
        </h2>
        <p className="text-xs text-sidebar-foreground/50 mt-1">Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <ArrowLeft size={18} />
          Til webshop
        </NavLink>
      </div>
    </aside>
  );
}
