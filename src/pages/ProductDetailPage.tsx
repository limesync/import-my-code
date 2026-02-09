import { useParams, Link } from 'react-router-dom';
import { useProduct, useProducts, getProductImage, formatPrice } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useState } from 'react';
import { ChevronLeft, Minus, Plus, Check, Truck, RotateCcw, Heart, Share2, ShieldCheck } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const { data: allProducts } = useProducts('active');
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = product?.variants.find(v => v.id === (selectedVariantId || product.variants[0]?.id)) 
    || product?.variants[0];

  if (isLoading) {
    return (
      <div className="store-container py-8 md:py-14">
        <Skeleton className="h-4 w-40 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <Skeleton className="aspect-[4/5] rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="store-container py-24 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-3xl mb-4">Produkt ikke fundet</h1>
          <p className="text-muted-foreground mb-8">Det produkt du leder efter findes desværre ikke.</p>
          <Link to="/produkter" className="btn-primary">Se alle produkter</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(product.id, selectedVariant.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlist = () => {
    if (product) toggleWishlist(product.id);
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.title, text: product.description || '', url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopieret til udklipsholder');
    }
  };

  const related = (allProducts || [])
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const hasDiscount = selectedVariant?.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - selectedVariant!.price / selectedVariant!.compare_at_price!) * 100) : 0;

  return (
    <div className="store-container py-8 md:py-14">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Hjem</Link>
          <span>/</span>
          <Link to="/produkter" className="hover:text-foreground transition-colors">Produkter</Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image section */}
        <div className="relative">
          <div className="aspect-[4/5] bg-secondary rounded-2xl overflow-hidden">
            <img
              src={getProductImage(product.slug)}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          
          {hasDiscount && (
            <span className="absolute top-4 left-4 badge-sale text-sm">
              -{discountPercent}%
            </span>
          )}

          {/* Floating wishlist on image */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              isWishlisted
                ? 'bg-blush text-blush-foreground'
                : 'bg-white/90 text-blush hover:bg-blush/20'
            } ${wishlistLoading ? 'opacity-50' : ''}`}
            aria-label="Tilføj til ønskeliste"
          >
            <Heart size={22} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Details */}
        <div className="flex flex-col py-2 lg:py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">{product.category}</span>
            {hasDiscount && (
              <span className="text-xs font-semibold bg-sale/10 text-sale px-2 py-0.5 rounded-full">
                Spar {discountPercent}%
              </span>
            )}
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 leading-tight">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-2xl md:text-3xl font-medium text-foreground">
              {formatPrice(selectedVariant?.price || 0)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(selectedVariant!.compare_at_price!)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8 text-base">
            {product.description}
          </p>

          {/* Variant selection */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                Vælg størrelse
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      v.id === (selectedVariantId || product.variants[0]?.id)
                        ? 'bg-foreground text-background shadow-md'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    } ${v.inventory <= 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                    disabled={v.inventory <= 0}
                  >
                    {v.name}
                    {v.inventory <= 0 && <span className="ml-1 text-[10px]">(Udsolgt)</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
              Antal
            </label>
            <div className="inline-flex items-center border border-border rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center hover:bg-secondary rounded-l-xl transition-colors text-muted-foreground"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center hover:bg-secondary rounded-r-xl transition-colors text-muted-foreground"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.inventory <= 0}
              className={`flex-1 py-4 rounded-full text-sm font-medium transition-all duration-300 ${
                added
                  ? 'bg-success text-success-foreground'
                  : !selectedVariant || selectedVariant.inventory <= 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {added ? (
                <span className="flex items-center justify-center gap-2">
                  <Check size={16} /> Tilføjet til kurv
                </span>
              ) : !selectedVariant || selectedVariant.inventory <= 0 ? (
                'Udsolgt'
              ) : (
                'Læg i kurv'
              )}
            </button>

            <button
              onClick={handleShare}
              className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-300"
              aria-label="Del produkt"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Low stock */}
          {selectedVariant && selectedVariant.inventory > 0 && selectedVariant.inventory <= 5 && (
            <p className="text-sm text-primary font-medium mb-6">
              ⚡ Kun {selectedVariant.inventory} tilbage på lager
            </p>
          )}

          {/* Guarantees - improved design */}
          <div className="pt-6 border-t border-border space-y-3">
            {[
              { icon: Truck, title: 'Gratis fragt', desc: 'Ved køb over 500 kr' },
              { icon: RotateCcw, title: '30 dages returret', desc: 'Nem og gratis returnering' },
              { icon: ShieldCheck, title: 'Sikker betaling', desc: 'SSL-krypteret checkout' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="text-xs bg-secondary px-3 py-1.5 rounded-full text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20 md:mt-28">
          <div className="mb-10">
            <span className="section-label">Se også</span>
            <h2 className="section-title">Lignende produkter</h2>
          </div>
          <div className="product-grid">
            {related.map((p, i) => (
              <div key={p.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
