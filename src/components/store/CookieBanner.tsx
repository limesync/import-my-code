import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CookieConsent = {
  necessary: boolean;
  statistics: boolean;
  marketing: boolean;
  timestamp: string;
};

const COOKIE_CONSENT_KEY = 'cookie_consent';

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        setConsent(JSON.parse(stored));
      } catch {
        setConsent(null);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveConsent = (newConsent: Omit<CookieConsent, 'timestamp'>) => {
    const fullConsent: CookieConsent = {
      ...newConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(fullConsent));
    setConsent(fullConsent);
  };

  const clearConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setConsent(null);
  };

  return {
    consent,
    isLoaded,
    hasConsented: consent !== null,
    saveConsent,
    clearConsent,
    acceptAll: () => saveConsent({ necessary: true, statistics: true, marketing: true }),
    acceptNecessary: () => saveConsent({ necessary: true, statistics: false, marketing: false }),
  };
}

export default function CookieBanner() {
  const { consent, isLoaded, hasConsented, acceptAll, acceptNecessary } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    necessary: true,
    statistics: false,
    marketing: false,
  });

  // Don't show if already consented or not loaded yet
  if (!isLoaded || hasConsented) {
    return null;
  }

  const handleSaveSettings = () => {
    const { saveConsent } = useCookieConsent();
    // We need to get saveConsent from the hook, but since this component already has it,
    // we'll just call it directly
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      ...settings,
      timestamp: new Date().toISOString(),
    }));
    window.location.reload(); // Refresh to apply settings
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="max-w-lg w-full bg-card border rounded-2xl shadow-elevated overflow-hidden animate-scale-in">
        {!showSettings ? (
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold mb-2">
                  Vi bruger cookies 🍪
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vi bruger cookies for at forbedre din oplevelse på vores hjemmeside. 
                  Nogle cookies er nødvendige for at siden fungerer, mens andre hjælper 
                  os med at forstå, hvordan du bruger den.{' '}
                  <Link to="/cookies" className="text-primary hover:underline">
                    Læs mere om vores cookies
                  </Link>
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={acceptAll} size="sm">
                    Accepter alle
                  </Button>
                  <Button onClick={acceptNecessary} variant="outline" size="sm">
                    Kun nødvendige
                  </Button>
                  <Button 
                    onClick={() => setShowSettings(true)} 
                    variant="ghost" 
                    size="sm"
                  >
                    Indstillinger
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">
                Cookieindstillinger
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Nødvendige cookies</p>
                  <p className="text-xs text-muted-foreground">
                    Disse er nødvendige for at siden fungerer
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.necessary} 
                  disabled 
                  className="w-5 h-5 accent-primary"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Statistikcookies</p>
                  <p className="text-xs text-muted-foreground">
                    Hjælper os med at forbedre siden
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.statistics}
                  onChange={(e) => setSettings(s => ({ ...s, statistics: e.target.checked }))}
                  className="w-5 h-5 accent-primary"
                />
              </label>
              
              <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Marketingcookies</p>
                  <p className="text-xs text-muted-foreground">
                    Bruges til at vise relevante annoncer
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.marketing}
                  onChange={(e) => setSettings(s => ({ ...s, marketing: e.target.checked }))}
                  className="w-5 h-5 accent-primary"
                />
              </label>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleSaveSettings} size="sm">
                Gem indstillinger
              </Button>
              <Button onClick={acceptAll} variant="outline" size="sm">
                Accepter alle
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Button to open cookie settings (for footer)
export function CookieSettingsButton() {
  const { clearConsent } = useCookieConsent();

  return (
    <button 
      onClick={clearConsent}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      Cookieindstillinger
    </button>
  );
}
