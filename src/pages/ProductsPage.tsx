import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/store/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const allCategories = ['Minimalistisk', 'Natur', 'Blomster', 'Luksus', 'Botanisk'];

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts('active');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const category = searchParams.get('kategori');

  // Filter by category and search
  const filtered = (products || []).filter(p => {
    const matchesCategory = !category || p.category === category;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const setCategory = (cat: string | null) => {
    if (cat) {
      setSearchParams({ kategori: cat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="store-container py-8 md:py-16">
      {/* Header */}
      <div className="mb-10 md:mb-14">
        <span className="section-label">
          {category ? 'Kategori' : 'Kollektion'}
        </span>
        <h1 className="section-title mb-2">
          {category || 'Alle Produkter'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'produkt' : 'produkter'}
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              !category
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
            }`}
          >
            Alle
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                category === cat
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Søg produkter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 pl-11 pr-4 py-2.5 bg-secondary/50 border border-border rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Products grid */}
      {isLoading ? (
        <div className="product-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square rounded-2xl" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-medium text-foreground mb-2">
            Ingen produkter fundet
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Prøv at justere dine filtre eller søgeord
          </p>
          <button
            onClick={() => {
              setCategory(null);
              setSearchQuery('');
            }}
            className="btn-secondary"
          >
            Ryd filtre
          </button>
        </div>
      )}
    </div>
  );
}