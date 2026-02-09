import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useProducts, getProductImage, formatPrice } from '@/hooks/useProducts';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, clearCart } = useCart();
  const { data: products } = useProducts('active');

  // Calculate cart totals
  const cartDetails = items.map((item) => {
    const product = products?.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    return {
      ...item,
      product,
      variant,
      subtotal: variant ? variant.price * item.quantity : 0,
    };
  }).filter((item) => item.product && item.variant);

  const subtotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0);
  const freeShippingThreshold = 500;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shipping = subtotal >= freeShippingThreshold ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl">
              Indkøbskurv ({items.length})
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-secondary/30 border-b border-border">
            {amountToFreeShipping > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  Køb for <span className="font-semibold text-foreground">{formatPrice(amountToFreeShipping)}</span> mere for gratis fragt
                </p>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-success font-medium flex items-center gap-2">
                🎉 Du har gratis fragt!
              </p>
            )}
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg font-medium text-foreground mb-2">
                Din kurv er tom
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Udforsk vores kollektion og find dine nye favoritter
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary"
              >
                Fortsæt shopping
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cartDetails.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-4 bg-secondary/20 rounded-xl"
                >
                  <Link
                    to={`/produkt/${item.product!.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary"
                  >
                    <img
                      src={getProductImage(item.product!.slug)}
                      alt={item.product!.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/produkt/${item.product!.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="font-display text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product!.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.variant!.name}
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-2">
                      {formatPrice(item.variant!.price)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-full">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Fjern én"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Tilføj én"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Fjern produkt"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fragt</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-border">
                <span className="font-medium">Total</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full flex items-center justify-center gap-2 group"
            >
              Gå til kassen
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              eller fortsæt shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}