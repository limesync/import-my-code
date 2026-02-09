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
      inventory: number;
    }>;
  };
}

export default function WishlistPage() {
  const { isAuthenticated, user } = useAuthContext();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

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
          id,
          title,
          slug,
          category,
          variants:product_variants(id, name, price, inventory)
        )
      `)
      .eq('user_id', user!.id);

    if (error) {
      console.error('Error fetching wishlist:', error);
    } else {
      setItems((data as unknown as WishlistItem[]) || []);
    }
    setLoading(false);
  };

  const removeFromWishlist = async (wishlistId: string) => {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('id', wishlistId);

    if (error) {
      toast.error('Kunne ikke fjerne fra ønskeliste');
    } else {
      setItems(prev => prev.filter(item => item.id !== wishlistId));
      toast.success('Fjernet fra ønskeliste');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    const variant = item.product.variants[0];
    if (variant) {
      addItem(item.product.id, variant.id, 1);
      toast.success('Tilføjet til kurv');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="store-container py-16 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <Heart className="mx-auto mb-6 text-muted-foreground" size={48} />
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
    <div className="store-container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-semibold mb-2">Din ønskeliste</h1>
        <p className="text-muted-foreground mb-8">
          {items.length} {items.length === 1 ? 'produkt' : 'produkter'} gemt
        </p>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <Heart className="mx-auto mb-4 text-muted-foreground" size={40} />
            <p className="text-muted-foreground mb-6">Din ønskeliste er tom</p>
            <Link to="/produkter">
              <Button variant="outline">Udforsk produkter</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-card rounded-xl border"
              >
                <Link
                  to={`/produkt/${item.product.slug}`}
                  className="w-20 h-20 bg-secondary rounded-lg overflow-hidden flex-shrink-0"
                >
                  <img
                    src={getProductImage(item.product.slug)}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/produkt/${item.product.slug}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  <p className="text-sm font-medium mt-1">
                    {item.product.variants[0] && formatPrice(item.product.variants[0].price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className="gap-2"
                  >
                    <ShoppingBag size={16} />
                    <span className="hidden sm:inline">Tilføj til kurv</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
