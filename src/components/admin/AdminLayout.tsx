import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminGuard from './AdminGuard';
import { AdminLocaleProvider } from '@/contexts/AdminLocaleContext';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <AdminLocaleProvider>
        <div className="flex min-h-screen bg-muted">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <AdminSidebar />
          </div>

          {/* Mobile sidebar */}
          {sidebarOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
              <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
                <AdminSidebar />
              </div>
            </>
          )}

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile header */}
            <header className="lg:hidden bg-background border-b px-4 py-3 flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-1">
                <Menu size={22} />
              </button>
              <h2 className="font-display text-lg font-semibold">Thumbie Admin</h2>
            </header>

            <main className="flex-1 p-4 md:p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </AdminLocaleProvider>
    </AdminGuard>
  );
}
