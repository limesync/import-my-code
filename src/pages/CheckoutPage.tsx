import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useProducts, getProductImage, formatPrice } from '@/hooks/useProducts';
import { useCreateOrder } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { Lock, CreditCard, Truck, Check, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { isAuthenticated, profile, user } = useAuthContext();
  const { data: products } = useProducts('active');
  const createOrder = useCreateOrder();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    password: '',
  });

  // Populate form when profile/user data loads
  useEffect(() => {
    if (profile || user) {
      setFormData(prev => ({
        ...prev,
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

    // If guest, create account first
    if (!isAuthenticated) {
      if (!formData.password || formData.password.length < 6) {
        toast.error('Adgangskoden skal være mindst 6 tegn');
        return;
      }
      if (!formData.email) {
        toast.error('Email er påkrævet');
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (signUpError) {
        toast.error(signUpError.message === 'User already registered'
          ? 'Denne email er allerede registreret. Prøv at logge ind.'
          : signUpError.message);
        return;
      }

      // After signup (no session yet if email confirm required), wait briefly for profile trigger
      // Then update profile with address info
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        await supabase.from('profiles').update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          country: 'Danmark',
        }).eq('id', sessionData.session.user.id);
      }
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
      
      if (!isAuthenticated) {
        toast.success('Tak for din ordre! Tjek din email for at bekræfte din konto.');
        navigate('/');
      } else {
        toast.success('Tak for din ordre! Vi sender en bekræftelse snart.');
        navigate('/konto/ordrer');
      }
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
    <div className="store-container py-12 md:py-20">
      {/* Breadcrumb & Header */}
      <div className="mb-10 md:mb-14">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Hjem</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Kasse</span>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-accent text-lg">◆</span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <span className="section-label">Kasse</span>
          <h1 className="section-title mb-3">Gennemfør din ordre</h1>
          <p className="text-muted-foreground">{cartDetails.length} {cartDetails.length === 1 ? 'vare' : 'varer'} i kurven</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Form */}
        <div className="lg:col-span-3 space-y-8">
          {/* Contact */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h2 className="font-display text-xl font-medium text-foreground mb-1">
              Kontaktoplysninger
            </h2>
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground mb-5">
                Har du en konto?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Log ind
                </Link>
              </p>
            )}
            {isAuthenticated && <div className="mb-5" />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Fornavn" className="input-cozy" required />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Efternavn" className="input-cozy" required />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="input-cozy md:col-span-2" required disabled={isAuthenticated} />
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Telefon" className="input-cozy md:col-span-2" required />
              {!isAuthenticated && (
                <div className="md:col-span-2">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Vælg en adgangskode (min. 6 tegn)"
                      className="input-cozy w-full pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Vi opretter en konto til dig, så du kan følge din ordre.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h2 className="font-display text-xl font-medium text-foreground mb-5">
              Leveringsadresse
            </h2>
            <div className="space-y-4">
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Adresse" className="input-cozy" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="Postnummer" className="input-cozy" required />
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="By" className="input-cozy" required />
              </div>
            </div>
          </div>

          {/* Shipping method */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h2 className="font-display text-xl font-medium text-foreground mb-5">
              Leveringsmetode
            </h2>
            <div className="border-2 border-primary rounded-xl p-4 flex items-center gap-4 bg-primary/5">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">Standardlevering</p>
                <p className="text-xs text-muted-foreground">2-4 hverdage</p>
              </div>
              <div className="font-display font-semibold">
                {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
              </div>
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={14} className="text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Payment info (demo) */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h2 className="font-display text-xl font-medium text-foreground mb-5">
              Betaling
            </h2>
            <div className="border border-border rounded-xl p-8 bg-secondary/30 text-center">
              <CreditCard size={36} className="mx-auto mb-3 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                Dette er en demo-butik. Ingen betaling vil blive gennemført.
              </p>
            </div>
          </div>

          {/* Submit */}
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={createOrder.isPending}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base"
            >
              <Lock size={16} />
              {createOrder.isPending ? 'Behandler...' : `Gennemfør ordre · ${formatPrice(total)}`}
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
              <ShieldCheck size={14} />
              <span>Sikker bestilling · SSL-krypteret</span>
            </div>
          </form>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-28 bg-card border border-border rounded-3xl p-6 md:p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h2 className="font-display text-xl font-medium text-foreground mb-6">
              Ordreoversigt
            </h2>

            <div className="space-y-4 mb-6">
              {cartDetails.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <div className="w-16 h-16 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
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
                  <p className="font-display font-semibold text-sm">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fragt</span>
                <span>{shipping === 0 ? <span className="text-success font-medium">Gratis</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-3 border-t border-border">
                <span>Total</span>
                <span className="font-display text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="mt-5 p-3 bg-accent/5 border border-accent/15 rounded-xl text-center">
                <p className="text-xs text-accent font-medium">
                  Køb for {formatPrice(500 - subtotal)} mere for gratis fragt ✨
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
