import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Section, CATEGORIES, CATEGORY_LABELS, SECTION_HERO_TITLES, COLLECTION_NAMES } from '@/lib/types';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { useSiteImages } from '@/hooks/useSiteImages';
import vansheLogo from '@/assets/vanshe-logo.png';

export default function SectionPage() {
  const { section } = useParams<{ section: string }>();
  const [searchOpen, setSearchOpen] = useState(false);
  const { images } = useSiteImages(section);

  if (!section || !['men', 'women', 'kids'].includes(section)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="font-serif text-xl mb-4">Section not found</p>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          Go home
        </Link>
      </div>
    );
  }

  const validSection = section as Section;
  const categories = CATEGORIES[validSection];

  const getImageOrPlaceholder = (key: string) => {
    const url = images[key];
    return url && url.length > 0 ? url : null;
  };

  const heroModel = getImageOrPlaceholder(`${validSection}_hero_model`);
  const heroCollection = getImageOrPlaceholder(`${validSection}_hero_collection`);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-between h-nav">
          <Link to="/" className="flex items-center gap-2 font-serif text-2xl md:text-3xl font-medium tracking-tight">
            <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            VANSHÉ
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
      <main className="pt-nav space-y-6 py-8">
        {/* Hero Banner - Square left + Wide landscape right */}
        <div className="px-4">
          <div className="grid grid-cols-[1fr_1.8fr] gap-1 md:gap-2 h-[280px] md:h-[360px] lg:h-[420px]">
            {/* Model Image - Square */}
            <Link 
              to={`/new-arrivals/${validSection}`}
              className="block group h-full overflow-hidden bg-muted"
            >
              {heroModel ? (
                <img
                  src={heroModel}
                  alt={`${validSection} collection`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground text-center p-4">
                  <span className="text-xs uppercase tracking-wider">{validSection.toUpperCase()} PAGE – HERO MODEL</span>
                </div>
              )}
            </Link>

            {/* Collection Banner - Wide landscape */}
            <Link 
              to={`/new-arrivals/${validSection}`}
              className="block group h-full bg-charcoal relative overflow-hidden"
            >
              {heroCollection ? (
                <img
                  src={heroCollection}
                  alt="Featured product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground text-center p-4">
                  <span className="text-xs uppercase tracking-wider">{validSection.toUpperCase()} PAGE – COLLECTION</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <p className="font-serif text-lg md:text-2xl lg:text-3xl italic text-white">
                  {COLLECTION_NAMES[validSection]}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Section Title */}
        <div className="px-4">
          <h1 className="text-xs font-medium tracking-widest uppercase text-foreground">
            {SECTION_HERO_TITLES[validSection]}
          </h1>
        </div>

        {/* Category Grid - 4 columns with hover effects */}
        <div className="px-4 grid grid-cols-4 gap-3">
          {categories.map((category) => {
            const categoryImage = getImageOrPlaceholder(`${validSection}_${category.replace('-', '')}`);
            
            return (
              <Link
                key={category}
                to={`/${validSection}/${category}`}
                className="block group/cat transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-sm overflow-hidden"
              >
                <div className="aspect-square overflow-hidden bg-cream">
                  {categoryImage ? (
                    <img
                      src={categoryImage}
                      alt={CATEGORY_LABELS[category]}
                      className="w-full h-full object-cover group-hover/cat:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground text-center p-2">
                      <span className="text-[8px] md:text-[10px] uppercase tracking-wider">{validSection.toUpperCase()} – {CATEGORY_LABELS[category].toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <span className="inline-block px-2 py-0.5 bg-foreground text-background text-[8px] md:text-[9px] font-medium uppercase tracking-wider transition-all duration-300 group-hover/cat:bg-primary group-hover/cat:text-primary-foreground">
                    {CATEGORY_LABELS[category]}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <BottomNav />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
