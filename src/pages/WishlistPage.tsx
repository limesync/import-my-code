import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
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
      const defaults: Record<string, string> = {};
      wishlistItems.forEach(item => {
        if (item.product.variants.length > 0) {
          defaults[item.id] = item.product.variants[0].id;
        }
      });
      setSelectedVariants(defaults);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (wishlistId: string) => {
    const { error } = await supabase.from('wishlist').delete().eq('id', wishlistId);
    if (error) {
      toast.error('Kunne ikke fjerne fra ønskeliste');
    } else {
      setItems(prev => prev.filter(item => item.id !== wishlistId));
      toast.success('Fjernet fra ønskeliste');
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
      <div className="store-container py-16 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-blush/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-blush" size={28} />
          </div>
          <h1 className="font-display text-2xl font-semibold mb-4">Din ønskeliste</h1>
          <p className="text-muted-foreground mb-6">
            Log ind for at se din ønskeliste og gemme dine favoritprodukter.
          </p>
          <Link to="/login">
            <Button>Log ind</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="store-container py-16 md:py-24">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="store-container py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blush/20 rounded-full flex items-center justify-center">
            <Heart className="text-blush" size={20} />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold">Din ønskeliste</h1>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? 'produkt' : 'produkter'} gemt
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <div className="w-16 h-16 bg-blush/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-blush/50" size={28} />
            </div>
            <p className="text-muted-foreground mb-6">Din ønskeliste er tom</p>
            <Link to="/produkter">
              <Button variant="outline">Udforsk produkter</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const selectedId = selectedVariants[item.id];
              const selectedVariant = item.product.variants.find(v => v.id === selectedId) || item.product.variants[0];
              const hasDiscount = selectedVariant?.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-5 bg-card rounded-xl border border-border hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <Link
                    to={`/produkt/${item.product.slug}`}
                    className="w-full sm:w-24 h-32 sm:h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={getProductImage(item.product.slug)}
                      alt={item.product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 w-full">
                    <Link
                      to={`/produkt/${item.product.slug}`}
                      className="font-display text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{item.product.category}</p>

                    {/* Variant selection */}
                    {item.product.variants.length > 1 && (
                      <div className="mt-3">
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Størrelse</label>
                        <div className="flex flex-wrap gap-1.5">
                          {item.product.variants.map(v => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariants(prev => ({ ...prev, [item.id]: v.id }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                v.id === selectedId
                                  ? 'bg-foreground text-background'
                                  : 'bg-secondary text-foreground hover:bg-secondary/80'
                              } ${v.inventory <= 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                              disabled={v.inventory <= 0}
                            >
                              {v.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-semibold text-foreground">
                        {selectedVariant && formatPrice(selectedVariant.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(selectedVariant!.compare_at_price!)}
                        </span>
                      )}
                      {selectedVariant && selectedVariant.inventory > 0 && selectedVariant.inventory <= 5 && (
                        <span className="text-xs text-primary font-medium">Kun {selectedVariant.inventory} tilbage</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      disabled={!selectedVariant || selectedVariant.inventory <= 0}
                      className="gap-2 flex-1 sm:flex-none"
                    >
                      <ShoppingBag size={16} />
                      <span className="sm:hidden lg:inline">Tilføj til kurv</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
