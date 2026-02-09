import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import AnnouncementBar from './AnnouncementBar';
import SearchDialog from './SearchDialog';

const navLinks = [
  { to: '/', label: 'Hjem' },
  { to: '/produkter', label: 'Shop' },
  { to: '/produkter?kategori=Minimalistisk', label: 'Minimalistisk' },
  { to: '/produkter?kategori=Natur', label: 'Natur' },
];

export default function StoreHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { setIsOpen, items } = useCart();
  const { isAuthenticated } = useAuthContext();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm'
            : 'bg-background'
        }`}
      >
        <div className="store-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo with gold accent */}
            <Link to="/" className="flex-shrink-0 group">
              <h1 className="font-display text-xl md:text-2xl font-semibold text-foreground tracking-wide">
                Thumbie
              </h1>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1 md:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors hidden md:block"
                aria-label="Søg"
              >
                <Search size={20} />
              </button>
              
              <Link
                to={isAuthenticated ? '/konto' : '/login'}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Konto"
              >
                <User size={20} />
              </Link>

              <Link
                to="/oenskeliste"
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hidden md:block"
                aria-label="Ønskeliste"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Indkøbskurv"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <nav className="store-container py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-3 text-base font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <Link
                  to="/oenskeliste"
                  className="flex items-center gap-3 py-3 text-base font-medium text-foreground"
                >
                  <Heart size={18} />
                  Ønskeliste
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 py-3 text-base font-medium text-foreground"
                >
                  Admin
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}