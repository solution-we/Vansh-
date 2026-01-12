import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Section, Category, CATEGORIES, CATEGORY_LABELS, SECTION_LABELS } from '@/lib/types';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategoryStrip } from '@/components/layout/CategoryStrip';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { FilterState } from '@/components/layout/Layout';
import vansheLogo from '@/assets/vanshe-logo.png';

export default function CategoryPage() {
  const { section, category } = useParams<{ section: string; category: string }>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});

  const validSection = section as Section;
  const validCategory = category as Category;

  const { products, loading, error, subTypes } = useProducts({
    section: validSection,
    category: validCategory,
    subType: filters.subType,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy,
  });

  // Validation
  const validSections = ['men', 'women', 'kids'];
  if (!validSections.includes(validSection)) {
    return <div className="p-8 text-center">Invalid section</div>;
  }

  const validCategories = CATEGORIES[validSection];
  if (!validCategories.includes(validCategory)) {
    return <div className="p-8 text-center">Invalid category</div>;
  }
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-between h-nav">
          <Link to="/" className="flex items-center gap-2 font-serif text-2xl md:text-3xl font-medium tracking-tight">
            <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            VANSHÉ
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setFilterOpen(true)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Category Strip */}
      <div className="fixed top-nav left-0 right-0 z-30">
        <CategoryStrip section={validSection} activeCategory={validCategory} />
      </div>

      {/* Main Content */}
      <main className="pt-[calc(var(--nav-height)+var(--category-strip-height))] px-4">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="font-serif text-xl md:text-2xl">
            {SECTION_LABELS[validSection]}'s {CATEGORY_LABELS[validCategory]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </main>

      <BottomNav />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        section={validSection}
        category={validCategory}
        subTypes={subTypes}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setFilterOpen(false);
        }}
      />
    </div>
  );
}
