import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { CookieSettingsButton } from './CookieBanner';

const footerLinks = {
  shop: [
    { label: 'Alle produkter', to: '/produkter' },
    { label: 'Minimalistisk', to: '/produkter?kategori=Minimalistisk' },
    { label: 'Natur', to: '/produkter?kategori=Natur' },
    { label: 'Blomster', to: '/produkter?kategori=Blomster' },
    { label: 'Luksus', to: '/produkter?kategori=Luksus' },
  ],
  info: [
    { label: 'Om os', to: '/om-os' },
    { label: 'Kontakt', to: '/kontakt' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Levering', to: '/levering' },
    { label: 'Returret', to: '/returret' },
  ],
  account: [
    { label: 'Min konto', to: '/konto' },
    { label: 'Ordrehistorik', to: '/konto/ordrer' },
    { label: 'Ønskeliste', to: '/oenskeliste' },
  ],
};

export default function StoreFooter() {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="store-container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Thumbie
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Stilfulde pudebetræk til pyntepuder i skandinavisk design. 
              Blødt, smukt og med kærlighed til detaljen.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-foreground/5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-foreground/5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="mailto:hej@thumbie.dk"
                className="w-10 h-10 bg-foreground/5 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-display text-base font-semibold text-foreground mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h4 className="font-display text-base font-semibold text-foreground mb-4">
              Information
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.info.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h4 className="font-display text-base font-semibold text-foreground mb-4">
              Konto
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.account.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            © 2025 Thumbie. Alle rettigheder forbeholdes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
            <Link to="/privatlivspolitik" className="hover:text-foreground transition-colors">
              Privatlivspolitik
            </Link>
            <Link to="/handelsbetingelser" className="hover:text-foreground transition-colors">
              Handelsbetingelser
            </Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}