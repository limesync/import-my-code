import { Truck, RotateCcw, Gem, ShieldCheck } from 'lucide-react';

const usps = [
  { icon: Truck, title: 'Gratis Fragt', desc: 'Ved køb over 500 kr', bgClass: 'bg-accent/10', iconClass: 'text-accent' },
  { icon: RotateCcw, title: '30 Dages Returret', desc: 'Nem og gratis retur', bgClass: 'bg-primary/10', iconClass: 'text-primary' },
  { icon: Gem, title: 'Delikat Kvalitet', desc: 'Bløde, udvalgte materialer', bgClass: 'bg-blush/20', iconClass: 'text-blush-foreground' },
  { icon: ShieldCheck, title: 'Sikker Betaling', desc: 'Krypteret checkout', bgClass: 'bg-accent/10', iconClass: 'text-accent' },
];

export default function USPBanner() {
  return (
    <section className="border-y border-border/50">
      <div className="store-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {usps.map((usp, i) => (
            <div key={i} className="text-center group">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 transition-transform group-hover:scale-110 ${usp.bgClass}`}>
                <usp.icon size={22} className={usp.iconClass} />
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
