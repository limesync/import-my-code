import { Truck, RotateCcw, Gem, ShieldCheck } from 'lucide-react';

const usps = [
  { icon: Truck, title: 'Gratis Fragt', desc: 'Ved køb over 500 kr' },
  { icon: RotateCcw, title: '30 Dages Returret', desc: 'Nem og gratis retur' },
  { icon: Gem, title: 'Delikat Kvalitet', desc: 'Bløde, udvalgte materialer' },
  { icon: ShieldCheck, title: 'Sikker Betaling', desc: 'Krypteret checkout' },
];

export default function USPBanner() {
  return (
    <section className="bg-primary/5 border-y border-primary/10">
      <div className="store-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {usps.map((usp, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 border border-primary/20 group-hover:bg-primary/15 group-hover:border-primary/30 transition-colors">
                <usp.icon size={22} className="text-primary" />
              </div>
              <h4 className="font-display text-base md:text-lg font-medium text-foreground mb-1">
                {usp.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {usp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}