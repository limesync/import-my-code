import { useParams, Link } from 'react-router-dom';
import { useProduct, useProducts, getProductImage, formatPrice } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuthContext } from '@/contexts/AuthContext';
import { useProductReviews, useUserReviewForProduct, useUserOrdersForProduct, getAverageRating } from '@/hooks/useReviews';
import { useState } from 'react';
import { ChevronRight, Minus, Plus, Check, Truck, RotateCcw, Heart, Share2, ShieldCheck, Ruler, Droplets, Sparkles } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import StarRating from '@/components/store/StarRating';
import ReviewForm from '@/components/store/ReviewForm';
import ReviewList from '@/components/store/ReviewList';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || '');
  const { data: allProducts } = useProducts('active');
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { user } = useAuthContext();
  const { data: reviews = [] } = useProductReviews(product?.id || '');
  const { data: existingReview } = useUserReviewForProduct(product?.id || '', user?.id);
  const { data: userOrders = [] } = useUserOrdersForProduct(product?.id || '', user?.id);

  const avgRating = getAverageRating(reviews);
  const canReview = !!user && userOrders.length > 0 && !existingReview;
  const firstOrderId = userOrders[0]?.order_id;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  const selectedVariant = product?.variants.find(v => v.id === (selectedVariantId || product.variants[0]?.id)) 
    || product?.variants[0];

  if (isLoading) {
    return (
      <div className="store-container py-8 md:py-14">
        <Skeleton className="h-4 w-40 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <Skeleton className="aspect-[4/5] rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-14 w-full" />
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

  const tabContent = {
    details: (
      <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>{product.description}</p>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-3">
            <Ruler size={18} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Størrelse</p>
              <p>{product.variants.map(v => v.name).join(', ')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Droplets size={18} className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Materiale</p>
              <p>100% premium bomuld</p>
            </div>
          </div>
        </div>
      </div>
    ),
    care: (
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <div className="flex items-start gap-3">
          <Droplets size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <p>Maskinvask ved 40°C med lignende farver</p>
        </div>
        <div className="flex items-start gap-3">
          <Sparkles size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <p>Tørretumbles ved lav temperatur</p>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <p>Stryges ved medium varme for bedste resultat</p>
        </div>
      </div>
    ),
    shipping: (
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <div className="flex items-start gap-3">
          <Truck size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">Standard levering: 2-4 hverdage</p>
            <p>Gratis ved køb over 500 kr. Ellers 49 kr.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground">30 dages returret</p>
            <p>Gratis returnering — vi betaler fragten</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="store-container py-8 md:py-14">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Hjem</Link>
          <ChevronRight size={14} />
          <Link to="/produkter" className="hover:text-foreground transition-colors">Produkter</Link>
          {product.category && (
            <>
              <ChevronRight size={14} />
              <Link to={`/produkter?kategori=${product.category}`} className="hover:text-foreground transition-colors">{product.category}</Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">{product.title}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image section */}
        <div className="relative group">
          <div className="aspect-[4/5] bg-secondary rounded-2xl overflow-hidden">
            <img
              src={getProductImage(product.slug)}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          
          {hasDiscount && (
            <span className="absolute top-4 left-4 badge-sale text-sm">
              -{discountPercent}%
            </span>
          )}

          {/* Floating wishlist */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isWishlisted
                ? 'bg-blush text-blush-foreground scale-110'
                : 'bg-white/90 text-blush hover:bg-blush/20 hover:scale-105'
            } ${wishlistLoading ? 'opacity-50' : ''}`}
            aria-label="Tilføj til ønskeliste"
          >
            <Heart size={22} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Decorative accent corner */}
          <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-blush/10 rounded-full -z-10 hidden lg:block" />
          <div className="absolute -top-3 -left-3 w-16 h-16 bg-accent/10 rounded-full -z-10 hidden lg:block" />
        </div>

        {/* Details */}
        <div className="flex flex-col py-2 lg:py-4">
          {/* Category & discount */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{product.category}</span>
            {hasDiscount && (
              <span className="text-xs font-bold bg-blush/20 text-blush-foreground px-2.5 py-1 rounded-full">
                Spar {discountPercent}%
              </span>
            )}
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-foreground mb-4 leading-tight">
            {product.title}
          </h1>

          {/* Star rating */}
          <div className="flex items-center gap-2 mb-5">
            <StarRating rating={avgRating} size={16} />
            <span className="text-xs text-muted-foreground">
              ({reviews.length} {reviews.length === 1 ? 'anmeldelse' : 'anmeldelser'})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-semibold text-foreground">
              {formatPrice(selectedVariant?.price || 0)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(selectedVariant!.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-muted-foreground leading-relaxed mb-8 text-[15px]">
            {product.description}
          </p>

          {/* Variant selection */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Vælg størrelse
                </label>
                <span className="text-xs text-accent font-medium">Størrelsesguide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => {
                  const isSelected = v.id === (selectedVariantId || product.variants[0]?.id);
                  const isOutOfStock = v.inventory <= 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                        isSelected
                          ? 'bg-foreground text-background border-foreground shadow-md'
                          : isOutOfStock
                          ? 'bg-muted text-muted-foreground border-border opacity-40 cursor-not-allowed line-through'
                          : 'bg-background text-foreground border-border hover:border-foreground/40'
                      }`}
                      disabled={isOutOfStock}
                    >
                      {v.name}
                      {isOutOfStock && <span className="ml-1 text-[10px]">(Udsolgt)</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart row */}
          <div className="flex gap-3 mb-4">
            <div className="inline-flex items-center border-2 border-border rounded-xl flex-shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-14 flex items-center justify-center hover:bg-secondary rounded-l-xl transition-colors text-muted-foreground"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-semibold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-14 flex items-center justify-center hover:bg-secondary rounded-r-xl transition-colors text-muted-foreground"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.inventory <= 0}
              className={`flex-1 h-14 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                added
                  ? 'bg-success text-success-foreground'
                  : !selectedVariant || selectedVariant.inventory <= 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {added ? (
                <span className="flex items-center justify-center gap-2">
                  <Check size={18} /> Tilføjet!
                </span>
              ) : !selectedVariant || selectedVariant.inventory <= 0 ? (
                'Udsolgt'
              ) : (
                `Læg i kurv · ${formatPrice(selectedVariant.price * quantity)}`
              )}
            </button>
          </div>

          {/* Wishlist + Share row */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`flex-1 h-12 rounded-full text-sm font-medium border-2 flex items-center justify-center gap-2 transition-all duration-300 ${
                isWishlisted
                  ? 'bg-blush/10 border-blush text-blush-foreground'
                  : 'border-border text-muted-foreground hover:border-blush hover:text-blush'
              }`}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} className="text-blush" />
              {isWishlisted ? 'Gemt i ønskeliste' : 'Gem til ønskeliste'}
            </button>
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-300 flex-shrink-0"
              aria-label="Del produkt"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Low stock */}
          {selectedVariant && selectedVariant.inventory > 0 && selectedVariant.inventory <= 5 && (
            <div className="flex items-center gap-2 mb-6 bg-primary/5 text-primary px-4 py-2.5 rounded-xl">
              <Sparkles size={16} />
              <p className="text-sm font-medium">
                Populær! Kun {selectedVariant.inventory} tilbage på lager
              </p>
            </div>
          )}

          {/* Guarantees strip */}
          <div className="flex flex-wrap gap-4 py-5 border-y border-border mb-6">
            {[
              { icon: Truck, text: 'Gratis fragt over 500 kr' },
              { icon: RotateCcw, text: '30 dages returret' },
              { icon: ShieldCheck, text: 'Sikker betaling' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon size={15} className="text-accent" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Tabs: Details / Care / Shipping */}
          <div className="mb-6">
            <div className="flex gap-1 border-b border-border mb-5">
              {[
                { key: 'details' as const, label: 'Detaljer' },
                { key: 'care' as const, label: 'Pleje' },
                { key: 'shipping' as const, label: 'Levering' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.key
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>
            {tabContent[activeTab]}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              {product.tags.map(tag => (
                <span key={tag} className="text-xs bg-secondary px-3 py-1.5 rounded-full text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews section */}
      <section className="mt-20 md:mt-28">
        <div className="mb-10">
          <span className="section-label">Kundernes mening</span>
          <h2 className="section-title">Anmeldelser ({reviews.length})</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={avgRating} size={20} />
              <span className="text-muted-foreground text-sm">{avgRating.toFixed(1)} ud af 5</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ReviewList reviews={reviews} />
          <div>
            {canReview && firstOrderId && (
              <ReviewForm productId={product.id} userId={user!.id} orderId={firstOrderId} />
            )}
            {existingReview && (
              <div className="bg-secondary/30 rounded-2xl p-6">
                <p className="text-sm text-muted-foreground">
                  {existingReview.status === 'pending' 
                    ? 'Din anmeldelse afventer godkendelse.'
                    : existingReview.status === 'approved'
                    ? 'Tak for din anmeldelse!'
                    : 'Din anmeldelse blev ikke godkendt.'}
                </p>
              </div>
            )}
            {!user && (
              <div className="bg-secondary/30 rounded-2xl p-6">
                <p className="text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline">Log ind</Link> for at skrive en anmeldelse.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20 md:mt-28">
          <div className="mb-10">
            <span className="section-label">Måske du også kan lide</span>
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
