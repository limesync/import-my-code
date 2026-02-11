import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Heart } from 'lucide-react';
import storyImage from '@/assets/story-lifestyle.jpg';

const highlights = [
  { icon: Star, label: 'Håndudvalgt kvalitet' },
  { icon: Truck, label: 'Gratis fragt over 499 kr' },
  { icon: Heart, label: 'Designet med kærlighed' },
];

export default function StorySection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle background accent */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--background)) 50%, hsl(var(--muted)) 100%)',
        }}
      />

      <div className="store-container py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left – Image with layered depth */}
          <div className="relative group order-2 md:order-1">
            {/* Background decorative card */}
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl -rotate-2 transition-transform duration-700 group-hover:rotate-0" />

            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-elevated)' }}>
              <img
                src={storyImage}
                alt="Skandinavisk interiør med Thumbie pudebetræk"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Warm gradient overlay at bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, transparent 60%, hsl(var(--foreground) / 0.15) 100%)',
                }}
              />
            </div>

            {/* Floating accent badge */}
            <div className="absolute -bottom-4 -right-2 md:-right-6 bg-card border border-border rounded-2xl px-5 py-4 animate-float" style={{ boxShadow: 'var(--shadow-card)' }}>
              <p className="text-xs text-muted-foreground mb-0.5">Kundernes favorit</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-primary text-primary" />
                ))}
                <span className="text-sm font-medium text-foreground ml-1">4.9</span>
              </div>
            </div>

            {/* Top-left decorative diamond */}
            <div className="absolute -top-3 -left-3 w-8 h-8 border-2 border-accent/20 rotate-45 rounded-sm" />
          </div>

          {/* Right – Text content */}
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-accent/40" />
              <span className="text-accent text-lg">◆</span>
              <div className="h-px w-12 bg-accent/40" />
            </div>

            <span className="section-label">Vores historie</span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              Skandinavisk design
              <span className="italic block text-primary"> til dit hjem</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
              Thumbie er skabt af passion for bløde, delikate detaljer der gør et hjem til noget særligt.
              Vi specialiserer os i pudebetræk til pyntepuder — men vores kollektion vokser løbende med nye produktkategorier.
            </p>

            {/* Highlights */}
            <div className="flex flex-col gap-3 mb-10">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>

            <Link
              to="/produkter"
              className="btn-primary inline-flex items-center gap-2 group"
            >
              Udforsk kollektionen
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
