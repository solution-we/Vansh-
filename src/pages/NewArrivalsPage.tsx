import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { Section, SECTION_LABELS, COLLECTION_NAMES } from '@/lib/types';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { useProducts } from '@/hooks/useProducts';

export default function NewArrivalsPage() {
  const { section } = useParams<{ section?: string }>();
  const [searchOpen, setSearchOpen] = useState(false);

  // Validate section if provided
  const validSection = section && ['men', 'women', 'kids'].includes(section) 
    ? section as Section 
    : undefined;

  // Fetch products - filter by section if provided
  const { products, loading } = useProducts({
    section: validSection,
    sortBy: 'newest',
  });

  const getTitle = () => {
    if (validSection) {
      return `${SECTION_LABELS[validSection]}'s New Arrivals`;
    }
    return 'New Arrivals';
  };

  const getSubtitle = () => {
    if (validSection) {
      return COLLECTION_NAMES[validSection];
    }
    return 'All Collections';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-between h-nav">
          <Link to="/" className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
            Vanshé
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-nav px-4 py-6">
        {/* Back link */}
        <Link 
          to={validSection ? `/${validSection}` : '/'}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {getSubtitle()}
          </p>
          <h1 className="font-serif text-2xl md:text-3xl">{getTitle()}</h1>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-muted animate-pulse rounded-sm" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-muted rounded-sm mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground">₹{product.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
