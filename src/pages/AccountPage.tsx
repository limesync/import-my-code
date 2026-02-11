import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { User, Mail, MapPin, Phone, Package, Heart, LogOut, ChevronRight, Settings, Shield, Pencil, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountPage() {
  const { user, profile, isAuthenticated, isAdmin, loading, signOut, updateProfile } = useAuthContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '', address: '', city: '', zip: '', country: 'Danmark',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '', last_name: profile.last_name || '',
        phone: profile.phone || '', address: profile.address || '',
        city: profile.city || '', zip: profile.zip || '', country: profile.country || 'Danmark',
      });
    }
  }, [profile]);

  const handleSignOut = async () => {
    try { await signOut(); toast.success('Du er nu logget ud'); navigate('/'); }
    catch { toast.error('Kunne ikke logge ud'); }
  };

  const handleSave = async () => {
    setSaving(true);
    try { await updateProfile(formData); setIsEditing(false); toast.success('Dine oplysninger er opdateret'); }
    catch (error: any) { toast.error(error.message || 'Kunne ikke gemme ændringer'); }
    finally { setSaving(false); }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '', last_name: profile.last_name || '',
        phone: profile.phone || '', address: profile.address || '',
        city: profile.city || '', zip: profile.zip || '', country: profile.country || 'Danmark',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="store-container py-20 md:py-32">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const displayName = formData.first_name 
    ? `${formData.first_name} ${formData.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'Bruger';

  return (
    <div className="store-container py-12 md:py-20">
      {/* Breadcrumb */}
      <div className="mb-10 md:mb-14">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Hjem</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Min konto</span>
        </div>

        {/* Header with diamond divider */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-accent text-lg">◆</span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <span className="section-label">Din profil</span>
          <h1 className="section-title mb-3">Hej, {displayName}!</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          {isAdmin && (
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium rounded-full">
              <Shield size={14} />
              Administrator
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <Link
          to="/konto/ordrer"
          className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Package size={22} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">Mine ordrer</h3>
            <p className="text-sm text-muted-foreground">Se dine tidligere køb</p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>

        <Link
          to="/oenskeliste"
          className="flex items-center gap-4 p-6 bg-card border border-border rounded-2xl hover:border-blush/40 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-blush/15 rounded-xl flex items-center justify-center group-hover:bg-blush/25 transition-colors">
            <Heart size={22} className="text-blush" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">Ønskeliste</h3>
            <p className="text-sm text-muted-foreground">Dine gemte produkter</p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center gap-4 p-6 bg-card border border-accent/20 rounded-2xl hover:border-accent/40 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Settings size={22} className="text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Administration</h3>
              <p className="text-sm text-muted-foreground">Administrer produkter, ordrer og indstillinger</p>
            </div>
            <ChevronRight size={20} className="text-accent" />
          </Link>
        )}
      </div>

      {/* Account details */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-8" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-medium text-foreground">Kontooplysninger</h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm text-primary hover:underline">
              <Pencil size={14} /> Rediger
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={handleCancel} className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} /> Annuller
              </button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                <Check size={14} /> {saving ? 'Gemmer...' : 'Gem'}
              </button>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 py-3 border-b border-border">
            <Mail size={18} className="text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
              <p className="text-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 py-3 border-b border-border">
            <User size={18} className="text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Navn</p>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={formData.first_name} onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))} placeholder="Fornavn" className="input-cozy text-sm" />
                  <input type="text" value={formData.last_name} onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))} placeholder="Efternavn" className="input-cozy text-sm" />
                </div>
              ) : (
                <p className="text-foreground">{formData.first_name && formData.last_name ? `${formData.first_name} ${formData.last_name}` : 'Ikke angivet'}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4 py-3 border-b border-border">
            <Phone size={18} className="text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Telefon</p>
              {isEditing ? (
                <input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} placeholder="+45 12 34 56 78" className="input-cozy text-sm w-full" />
              ) : (
                <p className="text-foreground">{formData.phone || 'Ikke angivet'}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4 py-3">
            <MapPin size={18} className="text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Adresse</p>
              {isEditing ? (
                <div className="space-y-3">
                  <input type="text" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} placeholder="Vejnavn og husnummer" className="input-cozy text-sm w-full" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={formData.zip} onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))} placeholder="Postnummer" className="input-cozy text-sm" />
                    <input type="text" value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} placeholder="By" className="input-cozy text-sm" />
                  </div>
                  <input type="text" value={formData.country} onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))} placeholder="Land" className="input-cozy text-sm w-full" />
                </div>
              ) : (
                <p className="text-foreground">
                  {formData.address ? `${formData.address}, ${formData.zip} ${formData.city}${formData.country ? `, ${formData.country}` : ''}` : 'Ikke angivet'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-4 text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
      >
        <LogOut size={18} /> Log ud
      </button>
    </div>
  );
}
