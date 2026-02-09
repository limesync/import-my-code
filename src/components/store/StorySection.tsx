import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function StorySection() {
  return (
    <section className="store-container py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left - Text */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-accent text-lg">◆</span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <span className="section-label">Vores historie</span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6 leading-relaxed">
            Skandinavisk design til dit hjem
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Thumbie er skabt af passion for bløde, delikate detaljer der gør et hjem til noget særligt.
            Vi specialiserer os i pudebetræk til pyntepuder — men vores kollektion vokser løbende med nye produktkategorier.
          </p>
          <Link
            to="/produkter"
            className="btn-primary inline-flex items-center gap-2 group"
          >
            Udforsk kollektionen
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Right - Color swatches */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-primary/20 border border-primary/15" />
            <div className="aspect-[3/4] rounded-2xl bg-accent/15 border border-accent/10" />
          </div>
          <div className="space-y-4 pt-8">
            <div className="aspect-[3/4] rounded-2xl bg-[hsl(var(--blush))]/20 border border-[hsl(var(--blush))]/15" />
            <div className="aspect-square rounded-2xl bg-secondary border border-border" />
          </div>
          <div className="space-y-4 pt-4">
            <div className="aspect-square rounded-2xl bg-primary/10 border border-primary/10" />
            <div className="aspect-[3/4] rounded-2xl bg-accent/10 border border-accent/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
