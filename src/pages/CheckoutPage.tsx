import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useProducts, getProductImage, formatPrice } from '@/hooks/useProducts';
import { useCreateOrder } from '@/hooks/useOrders';
import { ChevronLeft, Lock, CreditCard, Truck, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { isAuthenticated, profile, user } = useAuthContext();
  const { data: products } = useProducts('active');
  const createOrder = useCreateOrder();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  // Populate form when profile/user data loads
  useEffect(() => {
    if (profile || user) {
      setFormData(prev => ({
        firstName: profile?.first_name || prev.firstName,
        lastName: profile?.last_name || prev.lastName,
        email: user?.email || prev.email,
        phone: profile?.phone || prev.phone,
        address: profile?.address || prev.address,
        city: profile?.city || prev.city,
        zip: profile?.zip || prev.zip,
      }));
    }
  }, [profile, user]);

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
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0 || !products) {
      toast.error('Din kurv er tom');
      return;
    }

    try {
      await createOrder.mutateAsync({
        items,
        products,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          country: 'Danmark',
        },
        subtotal,
        shipping,
        total,
      });

      clearCart();
      toast.success('Tak for din ordre! Vi sender en bekræftelse snart.');
      navigate('/ordrer');
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error(error.message || 'Kunne ikke oprette ordre. Prøv igen.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="store-container py-20 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-3xl mb-4">Din kurv er tom</h1>
          <p className="text-muted-foreground mb-8">
            Tilføj nogle produkter til din kurv for at fortsætte.
          </p>
          <Link to="/produkter" className="btn-primary">
            Se produkter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="store-container py-8 md:py-14">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/produkter" 
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Fortsæt shopping
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-foreground">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact */}
            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                Kontaktoplysninger
              </h2>
              {!isAuthenticated && (
                <p className="text-sm text-muted-foreground mb-4">
                  Har du en konto?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Log ind
                  </Link>
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Fornavn"
                  className="input-cozy"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Efternavn"
                  className="input-cozy"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="input-cozy md:col-span-2"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Telefon"
                  className="input-cozy md:col-span-2"
                  required
                />
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                Leveringsadresse
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Adresse"
                  className="input-cozy"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="Postnummer"
                    className="input-cozy"
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="By"
                    className="input-cozy"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Shipping method */}
            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                Leveringsmetode
              </h2>
              <div className="border border-primary rounded-xl p-4 flex items-center gap-4 bg-primary/5">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Standardlevering</p>
                  <p className="text-sm text-muted-foreground">2-4 hverdage</p>
                </div>
                <div className="font-medium">
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                </div>
                <Check size={18} className="text-primary" />
              </div>
            </section>

            {/* Payment info (demo) */}
            <section>
              <h2 className="font-display text-xl font-medium text-foreground mb-4">
                Betaling
              </h2>
              <div className="border border-border rounded-xl p-6 bg-secondary/20 text-center">
                <CreditCard size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Dette er en demo-butik. Ingen betaling vil blive gennemført.
                </p>
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              {createOrder.isPending ? 'Behandler...' : `Gennemfør ordre · ${formatPrice(total)}`}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-28 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-display text-xl font-medium text-foreground mb-6">
              Ordreoversigt
            </h2>

            <div className="space-y-4 mb-6">
              {cartDetails.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getProductImage(item.product!.slug)}
                      alt={item.product!.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm line-clamp-1">
                      {item.product!.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.variant!.name} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-sm">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fragt</span>
                <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-muted-foreground mt-4">
                Køb for {formatPrice(500 - subtotal)} mere for gratis fragt
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}