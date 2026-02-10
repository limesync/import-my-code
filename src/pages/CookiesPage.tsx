import { Link } from 'react-router-dom';

export default function CookiesPage() {
  return (
    <div className="store-container py-16 md:py-24">
      <div>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-accent text-lg">◆</span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <span className="section-label">Information</span>
          <h1 className="section-title mb-6">
            Cookiepolitik
          </h1>
          <p className="text-muted-foreground">
            Sidst opdateret: Februar 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Hvad er cookies?</h2>
            <p>Cookies er små tekstfiler, som gemmes på din computer, tablet eller telefon, når du besøger vores hjemmeside. Cookies hjælper os med at genkende dig og huske dine præferencer.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Hvordan bruger vi cookies?</h2>
            <p>Vi bruger cookies til følgende formål:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Nødvendige cookies:</strong> Får hjemmesiden til at fungere korrekt (login, kurv, checkout)</li>
              <li><strong>Præferencecookies:</strong> Husker dine valg og indstillinger</li>
              <li><strong>Statistikcookies:</strong> Hjælper os med at forstå, hvordan besøgende bruger siden</li>
              <li><strong>Marketingcookies:</strong> Bruges til at vise relevante annoncer (kun med dit samtykke)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Cookieoversigt</h2>
            <div className="overflow-x-auto bg-card border rounded-2xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 pr-4">Cookie</th>
                    <th className="text-left py-3 pr-4">Type</th>
                    <th className="text-left py-3 pr-4">Formål</th>
                    <th className="text-left py-3">Varighed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="py-3 pr-4">cookie_consent</td><td className="py-3 pr-4">Nødvendig</td><td className="py-3 pr-4">Gemmer dit cookiesamtykke</td><td className="py-3">1 år</td></tr>
                  <tr className="border-b"><td className="py-3 pr-4">session</td><td className="py-3 pr-4">Nødvendig</td><td className="py-3 pr-4">Holder dig logget ind</td><td className="py-3">Session</td></tr>
                  <tr className="border-b"><td className="py-3 pr-4">cart</td><td className="py-3 pr-4">Nødvendig</td><td className="py-3 pr-4">Husker din indkøbskurv</td><td className="py-3">30 dage</td></tr>
                  <tr className="border-b"><td className="py-3 pr-4">_ga</td><td className="py-3 pr-4">Statistik</td><td className="py-3 pr-4">Google Analytics - besøgsstatistik</td><td className="py-3">2 år</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Administrer dine cookieindstillinger</h2>
            <p>Du kan til enhver tid ændre dine cookieindstillinger ved at klikke på "Cookieindstillinger" i bunden af siden. Du kan også slette cookies i din browser.</p>
            <p>Bemærk, at hvis du deaktiverer nødvendige cookies, kan dele af hjemmesiden ikke fungere korrekt.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Sådan sletter du cookies</h2>
            <p>Du kan slette cookies via din browsers indstillinger. Processen varierer afhængigt af browser:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chrome:</strong> Indstillinger → Privatliv og sikkerhed → Ryd browserdata</li>
              <li><strong>Firefox:</strong> Indstillinger → Privatliv og sikkerhed → Cookies og webstedsdata</li>
              <li><strong>Safari:</strong> Indstillinger → Privatliv → Administrer webstedsdata</li>
              <li><strong>Edge:</strong> Indstillinger → Privatliv → Vælg, hvad der skal ryddes</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Tredjepartscookies</h2>
            <p>Vi bruger cookies fra betroede tredjeparter som Google Analytics til at analysere trafik på siden. Disse tredjeparter kan placere deres egne cookies. Se deres respektive privatlivspolitikker for mere information.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Kontakt</h2>
            <p>Har du spørgsmål til vores brug af cookies, er du velkommen til at kontakte os på <a href="mailto:hej@thumbie.dk" className="text-primary hover:underline">hej@thumbie.dk</a>.</p>
            <p>Se også vores <Link to="/privatlivspolitik" className="text-primary hover:underline">privatlivspolitik</Link> for mere information om, hvordan vi behandler dine personoplysninger.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
