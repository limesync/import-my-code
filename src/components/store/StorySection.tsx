import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import storyImage from '@/assets/story-lifestyle.jpg';

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

        {/* Right - Image with decorative accent elements */}
        <div className="relative">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={storyImage}
              alt="Skandinavisk interiør med Thumbie pudebetræk"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative accent corners */}
          <div className="absolute -top-3 -right-3 w-20 h-20 border-t-2 border-r-2 border-accent/30 rounded-tr-2xl" />
          <div className="absolute -bottom-3 -left-3 w-20 h-20 border-b-2 border-l-2 border-blush/40 rounded-bl-2xl" />
        </div>
      </div>
    </section>
  );
}
