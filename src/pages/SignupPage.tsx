import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, isAuthenticated, loading } = useAuthContext();
  const navigate = useNavigate();

  // Redirect if already logged in - use useEffect instead of conditional render
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/konto');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error('Adgangskoden skal være mindst 6 tegn');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, { firstName, lastName });
      toast.success('Konto oprettet! Tjek din email for at bekræfte.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Kunne ikke oprette konto. Prøv igen.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render form if already authenticated (will redirect via useEffect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
            Opret din konto
          </h1>
          <p className="text-muted-foreground">
            Bliv en del af Thumbie familien
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                Fornavn
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Fornavn"
                  className="input-cozy pl-11"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                Efternavn
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Efternavn"
                className="input-cozy"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.dk"
                className="input-cozy pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
              Adgangskode
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mindst 6 tegn"
                className="input-cozy pl-11 pr-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Opretter konto...' : 'Opret konto'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Ved at oprette en konto accepterer du vores{' '}
          <Link to="/handelsbetingelser" className="underline">handelsbetingelser</Link>
          {' '}og{' '}
          <Link to="/privatlivspolitik" className="underline">privatlivspolitik</Link>.
        </p>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Har du allerede en konto?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log ind
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
