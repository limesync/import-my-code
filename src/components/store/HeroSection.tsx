import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import heroImg from '@/assets/hero-pillow.jpg';

// Map local asset paths to imported images
const localImages: Record<string, string> = {
  '/assets/hero-pillow.jpg': heroImg,
};

function getImageUrl(url: string | null): string {
  if (!url) return heroImg;
  return localImages[url] || url;
}

export default function HeroSection() {
  const { data: slides, isLoading } = useHeroSlides(true);
  
  // Use first visible slide or fallback to default
  const slide = slides?.[0];

  if (isLoading) {
    return (
      <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-muted animate-pulse" />
    );
  }

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(slide?.image_url || null)}
          alt="Smukke pudebetræk i naturlige farver"
          className="w-full h-full object-cover object-center"
        />
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, hsla(0, 0%, 10%, 0) 0%, hsla(0, 0%, 10%, 0.2) 50%, hsla(0, 0%, 10%, 0.65) 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full store-container flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-xl animate-slide-up">
          <span className="inline-block text-white text-xs font-medium uppercase tracking-[0.25em] mb-4 bg-accent/80 backdrop-blur-sm px-4 py-2 rounded-full">
            {slide?.title || 'Ny kollektion 2025'}
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-medium leading-tight mb-5">
            Skab varme og
            <span className="italic"> stil</span> i dit hjem
          </h1>
          <p className="text-white/85 text-base md:text-lg mb-8 leading-relaxed max-w-md">
            {slide?.subtitle || 'Udvalgte pudebetræk i naturlige materialer og tidløse designs. Skandinavisk kvalitet til dit hjem.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={slide?.button_link || '/produkter'}
              className="btn-primary inline-flex items-center justify-center gap-2 group"
            >
              {slide?.button_text || 'Se kollektion'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/produkter?kategori=Natur"
              className="btn-outline border-white/50 text-white hover:bg-white hover:text-foreground inline-flex items-center justify-center"
            >
              Udforsk natur
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-subtle hidden md:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}
