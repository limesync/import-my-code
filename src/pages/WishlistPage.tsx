import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { getProductImage, formatPrice } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    title: string;
    slug: string;
    category: string | null;
    variants: Array<{
      id: string;
      name: string;
      price: number;
      compare_at_price: number | null;
      inventory: number;
    }>;
  };
}

const VARIANT_STORAGE_KEY = 'wishlist_selected_variants';

function getStoredVariants(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(VARIANT_STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function storeVariant(wishlistItemId: string, variantId: string) {
  const stored = getStoredVariants();
  stored[wishlistItemId] = variantId;
  localStorage.setItem(VARIANT_STORAGE_KEY, JSON.stringify(stored));
}

export default function WishlistPage() {
  const { isAuthenticated, user } = useAuthContext();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchWishlist = async () => {
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        id,
        product_id,
        product:products(
          id, title, slug, category,
          variants:product_variants(id, name, price, compare_at_price, inventory)
        )
      `)
      .eq('user_id', user!.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
    } else {
      const wishlistItems = (data as unknown as WishlistItem[]) || [];
      setItems(wishlistItems);
      
      // Restore saved variants from localStorage, fallback to first variant
      const stored = getStoredVariants();
      const defaults: Record<string, string> = {};
      wishlistItems.forEach(item => {
        if (item.product.variants.length > 0) {
          const savedVariant = stored[item.id];
          const validSaved = savedVariant && item.product.variants.some(v => v.id === savedVariant);
          defaults[item.id] = validSaved ? savedVariant : item.product.variants[0].id;
        }
      });
      setSelectedVariants(defaults);
    }
    setLoading(false);
  };

  const handleVariantChange = useCallback((wishlistItemId: string, variantId: string) => {
    setSelectedVariants(prev => ({ ...prev, [wishlistItemId]: variantId }));
    storeVariant(wishlistItemId, variantId);
  }, []);

  const removeFromWishlist = async (wishlistId: string) => {
    const { error } = await supabase.from('wishlist').delete().eq('id', wishlistId);
    if (error) {
      toast.error('Kunne ikke fjerne fra ønskeliste');
    } else {
      setItems(prev => prev.filter(item => item.id !== wishlistId));
      toast.success('Fjernet fra ønskeliste');
      window.dispatchEvent(new CustomEvent('wishlist-changed'));
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    const variantId = selectedVariants[item.id];
    const variant = item.product.variants.find(v => v.id === variantId);
    if (variant && variant.inventory > 0) {
      addItem(item.product.id, variant.id, 1);
      toast.success('Tilføjet til kurv');
    } else {
      toast.error('Denne variant er udsolgt');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="store-container py-20 md:py-32">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-blush/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-blush" size={32} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4">Din ønskeliste</h1>
          <p className="text-muted-foreground mb-8 text-base leading-relaxed">
            Log ind for at gemme dine favoritprodukter og se dem samlet her.
          </p>
          <Link to="/login">
            <Button className="btn-primary gap-2">
              Log ind <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="store-container py-20 md:py-32">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="store-container py-12 md:py-20">
      {/* Header */}
      <div className="mb-10 md:mb-14">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Hjem</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Ønskeliste</span>
        </div>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-accent text-lg">◆</span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <span className="section-label">Dine favoritter</span>
          <h1 className="section-title mb-3">Din ønskeliste</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? 'produkt' : 'produkter'} gemt
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="w-20 h-20 bg-blush/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-blush/40" size={32} />
          </div>
          <h2 className="font-display text-2xl font-medium mb-3">Ingen favoritter endnu</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Udforsk vores kollektion og tryk på hjertet for at gemme dine favoritter.
          </p>
          <Link to="/produkter">
            <Button className="btn-primary gap-2">
              Udforsk produkter <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((item) => {
            const selectedId = selectedVariants[item.id];
            const selectedVariant = item.product.variants.find(v => v.id === selectedId) || item.product.variants[0];
            const hasDiscount = selectedVariant?.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price;
            const discountPercent = hasDiscount 
              ? Math.round((1 - selectedVariant.price / selectedVariant.compare_at_price!) * 100) : 0;

            return (
              <div key={item.id} className="product-card group">
                {/* Image - matches ProductCard aspect ratio */}
                <Link
                  to={`/produkt/${item.product.slug}`}
                  className="block relative aspect-square overflow-hidden bg-secondary/30 rounded-t-2xl"
                >
                  <img
                    src={getProductImage(item.product.slug)}
                    alt={item.product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 badge-sale text-xs">
                      -{discountPercent}%
                    </span>
                  )}
                  {/* Remove button */}
                  <button
                    onClick={(e) => { e.preventDefault(); removeFromWishlist(item.id); }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-white transition-all"
                    aria-label="Fjern fra ønskeliste"
                  >
                    <Trash2 size={16} />
                  </button>
                </Link>

                {/* Content - matches ProductCard styling */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.product.category}</p>
                  <Link
                    to={`/produkt/${item.product.slug}`}
                    className="font-display text-lg font-medium text-foreground hover:text-primary transition-colors block mb-2"
                  >
                    {item.product.title}
                  </Link>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-semibold text-foreground">
                      {selectedVariant && formatPrice(selectedVariant.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(selectedVariant!.compare_at_price!)}
                      </span>
                    )}
                  </div>

                  {/* Variant selection */}
                  {item.product.variants.length > 1 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {item.product.variants.map(v => (
                          <button
                            key={v.id}
                            onClick={() => handleVariantChange(item.id, v.id)}
                            className={`px-2 py-1 rounded-md text-xs font-medium transition-all border ${
                              v.id === selectedId
                                ? 'bg-foreground text-background border-foreground'
                                : 'bg-background text-foreground border-border hover:border-foreground/30'
                            } ${v.inventory <= 0 ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                            disabled={v.inventory <= 0}
                          >
                            {v.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Low stock */}
                  {selectedVariant && selectedVariant.inventory > 0 && selectedVariant.inventory <= 5 && (
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-2">
                      <Sparkles size={12} />
                      Kun {selectedVariant.inventory} tilbage
                    </div>
                  )}

                  {/* Add to cart */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!selectedVariant || selectedVariant.inventory <= 0}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      selectedVariant && selectedVariant.inventory > 0
                        ? 'bg-foreground text-background hover:bg-foreground/90'
                        : 'bg-secondary text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={15} />
                    {!selectedVariant || selectedVariant.inventory <= 0 ? 'Udsolgt' : 'Tilføj til kurv'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Continue shopping */}
      {items.length > 0 && (
        <div className="text-center mt-12">
          <Link to="/produkter" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            Fortsæt shopping
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}