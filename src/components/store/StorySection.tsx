import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function StorySection() {
  return (
    <section className="store-container py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-primary/30" />
          <span className="text-primary text-lg">◆</span>
          <div className="h-px w-12 bg-primary/30" />
        </div>
        <span className="section-label">Vores historie</span>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6 leading-relaxed">
          Skandinavisk design til dit hjem
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
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
    </section>
  );
}