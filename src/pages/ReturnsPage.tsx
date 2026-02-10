import { RotateCcw, CheckCircle, Package, AlertCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReturnsPage() {
  return (
    <div className="store-container py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-accent text-lg">◆</span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <span className="section-label">Retur & Reklamation</span>
          <h1 className="section-title mb-6">
            Returret
          </h1>
          <p className="text-lg text-muted-foreground">
            30 dages fuld returret på alle køb
          </p>
        </div>

        {/* Key Points */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            { icon: RotateCcw, title: '30 dage', desc: 'Fuld returret fra modtagelse', bg: 'bg-primary/10', color: 'text-primary' },
            { icon: Package, title: 'Gratis retur', desc: 'Vi dækker returfragten', bg: 'bg-accent/10', color: 'text-accent' },
            { icon: CheckCircle, title: 'Hurtig refusion', desc: 'Pengene tilbage inden for 14 dage', bg: 'bg-blush/20', color: 'text-blush-foreground' },
          ].map(({ icon: Icon, title, desc, bg, color }, i) => (
            <div key={i} className="text-center p-6 bg-card border rounded-2xl transition-all duration-300 hover:shadow-md" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className={color} size={24} />
              </div>
              <h3 className="font-display font-medium mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4">Returret</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>Hos Thumbie har du 30 dages fuld returret fra du modtager din ordre. Det betyder, at du har god tid til at vurdere, om produktet lever op til dine forventninger.</p>
              <p>For at returnere en vare skal den være ubrugt og i original emballage. Eventuelle mærker og tags skal stadig sidde på.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-4">Sådan returnerer du</h2>
            <ol className="space-y-4">
              {[
                { title: 'Kontakt os', desc: <>Send en email til <a href="mailto:hej@thumbie.dk" className="text-primary hover:underline">hej@thumbie.dk</a> med dit ordrenummer og oplys, hvilke varer du ønsker at returnere.</> },
                { title: 'Modtag returlabel', desc: 'Vi sender dig en gratis returlabel pr. email inden for 24 timer.' },
                { title: 'Pak varen', desc: 'Pak varen forsvarligt i original emballage eller tilsvarende. Sæt returlabelen udenpå pakken.' },
                { title: 'Aflever pakken', desc: 'Aflever pakken i nærmeste pakkeshop. Gem kvitteringen som dokumentation.' },
                { title: 'Modtag refusion', desc: 'Når vi har modtaget og godkendt din returnering, refunderer vi beløbet inden for 14 dage.' },
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">{i + 1}</span>
                  <div>
                    <h3 className="font-medium mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-3">
              <AlertCircle size={24} className="text-accent" />
              Reklamation
            </h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>Ifølge købeloven har du 2 års reklamationsret. Hvis du modtager en defekt eller beskadiget vare, kontakt os hurtigst muligt med billeder af skaden.</p>
              <p>Ved reklamation dækker vi alle fragtomkostninger, og du får enten en ny vare eller pengene tilbage.</p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-secondary/30 rounded-2xl p-8 flex items-start gap-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="font-display text-lg font-medium mb-2">
                Har du spørgsmål om returneringer?
              </h3>
              <p className="text-muted-foreground mb-4">
                Vi er her for at hjælpe. Kontakt os, og vi finder en løsning.
              </p>
              <Link to="/kontakt" className="text-primary font-medium hover:underline">
                Kontakt kundeservice →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
