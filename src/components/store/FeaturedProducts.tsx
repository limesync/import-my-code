import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedProducts() {
  const { data: products, isLoading } = useProducts('active');

  // Show first 4 products as featured
  const featured = products?.slice(0, 4) || [];

  return (
    <section className="store-container py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div>
          <span className="section-label">Populære produkter</span>
          <h2 className="section-title">
            Favoritter fra kollektionen
          </h2>
        </div>
        <Link
          to="/produkter"
          className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          Se alle produkter
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {isLoading ? (
        <div className="product-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square rounded-2xl" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : featured.length > 0 ? (
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>Ingen produkter fundet</p>
        </div>
      )}
    </section>
  );
}