import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/hooks/useProducts';
import { getProductImage, getLowestPrice, getCompareAtPrice, formatPrice } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();

  const isWishlisted = isInWishlist(product.id);
  const price = getLowestPrice(product.variants);
  const compareAt = getCompareAtPrice(product.variants);
  const hasDiscount = compareAt && compareAt > price;
  const discountPercent = hasDiscount ? Math.round((1 - price / compareAt) * 100) : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants.length > 0) {
      addItem(product.id, product.variants[0].id);
      toast.success(`${product.title} tilføjet til kurv`);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link
      to={`/produkt/${product.slug}`}
      className="product-card group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/30 rounded-t-2xl">
        <img
          src={getProductImage(product.slug)}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {hasDiscount && (
          <span className="absolute top-3 left-3 badge-sale">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist button - pink/blush */}
        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-blush text-blush-foreground'
              : 'bg-white/90 text-blush hover:bg-blush/20'
          } ${wishlistLoading ? 'opacity-50' : ''}`}
          aria-label="Tilføj til ønskeliste"
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        <div
          className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <button
            onClick={handleQuickAdd}
            className="w-full bg-foreground text-background py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
          >
            <ShoppingBag size={16} />
            Tilføj til kurv
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-foreground">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
