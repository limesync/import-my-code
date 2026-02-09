import { Truck, RotateCcw, Gem, ShieldCheck } from 'lucide-react';

const usps = [
  { icon: Truck, title: 'Gratis Fragt', desc: 'Ved køb over 500 kr', color: 'bg-accent/10 border-accent/20 group-hover:bg-accent/15 group-hover:border-accent/30', iconColor: 'text-accent' },
  { icon: RotateCcw, title: '30 Dages Returret', desc: 'Nem og gratis retur', color: 'bg-primary/10 border-primary/20 group-hover:bg-primary/15 group-hover:border-primary/30', iconColor: 'text-primary' },
  { icon: Gem, title: 'Delikat Kvalitet', desc: 'Bløde, udvalgte materialer', color: 'bg-[hsl(var(--blush))]/15 border-[hsl(var(--blush))]/25 group-hover:bg-[hsl(var(--blush))]/20 group-hover:border-[hsl(var(--blush))]/35', iconColor: 'text-[hsl(var(--blush-foreground))]' },
  { icon: ShieldCheck, title: 'Sikker Betaling', desc: 'Krypteret checkout', color: 'bg-accent/10 border-accent/20 group-hover:bg-accent/15 group-hover:border-accent/30', iconColor: 'text-accent' },
];

export default function USPBanner() {
  return (
    <section className="border-y border-border/50">
      <div className="store-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {usps.map((usp, i) => (
            <div key={i} className="text-center group">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 border transition-colors ${usp.color}`}>
                <usp.icon size={22} className={usp.iconColor} />
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
