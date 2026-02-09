import { Truck, Clock, MapPin, Package, CheckCircle } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="store-container py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Levering
          </h1>
          <p className="text-lg text-muted-foreground">
            Hurtig og sikker levering til hele Danmark
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium">Standard levering</h3>
                <p className="text-sm text-muted-foreground">2-4 hverdage</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-3">
              Levering til nærmeste pakkeshop eller til din adresse.
            </p>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm text-muted-foreground">Ordrer under 499 kr.</span>
              <span className="font-semibold">39 kr.</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Ordrer over 499 kr.</span>
              <span className="font-semibold text-primary">Gratis</span>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Clock className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium">Express levering</h3>
                <p className="text-sm text-muted-foreground">1-2 hverdage</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-3">
              Hurtig levering direkte til din adresse.
            </p>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm text-muted-foreground">Alle ordrer</span>
              <span className="font-semibold">69 kr.</span>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-3">
              <Package size={24} className="text-primary" />
              Ordrebehandling
            </h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>
                Alle ordrer behandles inden for 1-2 hverdage. Du modtager en 
                bekræftelsesmail, når din ordre er afsendt, med et trackingnummer, 
                så du kan følge din pakke.
              </p>
              <p>
                Ordrer afgivet inden kl. 14:00 på hverdage afsendes normalt samme dag.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-3">
              <MapPin size={24} className="text-primary" />
              Leveringsområde
            </h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>
                Vi leverer til alle adresser i Danmark, inklusive Færøerne og Grønland. 
                For leveringer til Færøerne og Grønland kan leveringstiden være længere.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-3">
              <CheckCircle size={24} className="text-primary" />
              Afhentning
            </h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>
                Din pakke afleveres i din valgte pakkeshop, hvor den ligger klar til 
                afhentning i op til 8 dage. Du modtager en SMS, når pakken er klar.
              </p>
              <p>
                Husk at medbringe legitimation ved afhentning.
              </p>
            </div>
          </section>

          {/* Delivery Table */}
          <section className="bg-secondary/30 rounded-xl p-6">
            <h3 className="font-display text-lg font-medium mb-4">Oversigt over fragtpriser</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Leveringsmetode</th>
                    <th className="text-left py-2">Leveringstid</th>
                    <th className="text-right py-2">Pris</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Standard (under 499 kr.)</td>
                    <td className="py-3">2-4 hverdage</td>
                    <td className="py-3 text-right">39 kr.</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">Standard (over 499 kr.)</td>
                    <td className="py-3">2-4 hverdage</td>
                    <td className="py-3 text-right font-medium text-primary">Gratis</td>
                  </tr>
                  <tr>
                    <td className="py-3">Express</td>
                    <td className="py-3">1-2 hverdage</td>
                    <td className="py-3 text-right">69 kr.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
