import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function StorySection() {
  return (
    <section className="store-container py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-primary/30" />
          <span className="text-primary text-lg">✿</span>
          <div className="h-px w-12 bg-primary/30" />
        </div>
        <span className="section-label">Vores historie</span>
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6 leading-relaxed">
          Inspireret af eventyrets magi
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
          Thumbie er født af kærlighed til de bløde, delikate detaljer der gør et hjem til et eventyr.
          Hvert pudebetræk er nøje udvalgt for at bringe varme, komfort og en touch af magi til dit rum.
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