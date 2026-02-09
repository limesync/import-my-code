import { RotateCcw, CheckCircle, Package, AlertCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReturnsPage() {
  return (
    <div className="store-container py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Returret
          </h1>
          <p className="text-lg text-muted-foreground">
            30 dages fuld returret på alle køb
          </p>
        </div>

        {/* Key Points */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="text-center p-6 bg-card border rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="text-primary" size={24} />
            </div>
            <h3 className="font-display font-medium mb-2">30 dage</h3>
            <p className="text-sm text-muted-foreground">Fuld returret fra modtagelse</p>
          </div>
          <div className="text-center p-6 bg-card border rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-primary" size={24} />
            </div>
            <h3 className="font-display font-medium mb-2">Gratis retur</h3>
            <p className="text-sm text-muted-foreground">Vi dækker returfragten</p>
          </div>
          <div className="text-center p-6 bg-card border rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-primary" size={24} />
            </div>
            <h3 className="font-display font-medium mb-2">Hurtig refusion</h3>
            <p className="text-sm text-muted-foreground">Pengene tilbage inden for 14 dage</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4">
              Returret
            </h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>
                Hos FINOVIDA har du 30 dages fuld returret fra du modtager din ordre. 
                Det betyder, at du har god tid til at vurdere, om produktet lever op 
                til dine forventninger.
              </p>
              <p>
                For at returnere en vare skal den være ubrugt og i original emballage. 
                Eventuelle mærker og tags skal stadig sidde på.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-4">
              Sådan returnerer du
            </h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">1</span>
                <div>
                  <h3 className="font-medium mb-1">Kontakt os</h3>
                  <p className="text-muted-foreground">
                    Send en email til <a href="mailto:hej@finovida.dk" className="text-primary hover:underline">hej@finovida.dk</a> med 
                    dit ordrenummer og oplys, hvilke varer du ønsker at returnere.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">2</span>
                <div>
                  <h3 className="font-medium mb-1">Modtag returlabel</h3>
                  <p className="text-muted-foreground">
                    Vi sender dig en gratis returlabel pr. email inden for 24 timer.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">3</span>
                <div>
                  <h3 className="font-medium mb-1">Pak varen</h3>
                  <p className="text-muted-foreground">
                    Pak varen forsvarligt i original emballage eller tilsvarende. 
                    Sæt returlabelen udenpå pakken.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">4</span>
                <div>
                  <h3 className="font-medium mb-1">Aflever pakken</h3>
                  <p className="text-muted-foreground">
                    Aflever pakken i nærmeste pakkeshop. Gem kvitteringen som dokumentation.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">5</span>
                <div>
                  <h3 className="font-medium mb-1">Modtag refusion</h3>
                  <p className="text-muted-foreground">
                    Når vi har modtaget og godkendt din returnering, refunderer vi 
                    beløbet inden for 14 dage.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-3">
              <AlertCircle size={24} className="text-accent" />
              Reklamation
            </h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>
                Ifølge købeloven har du 2 års reklamationsret. Hvis du modtager en 
                defekt eller beskadiget vare, kontakt os hurtigst muligt med billeder 
                af skaden.
              </p>
              <p>
                Ved reklamation dækker vi alle fragtomkostninger, og du får enten 
                en ny vare eller pengene tilbage.
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-secondary/30 rounded-xl p-8 flex items-start gap-4">
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
