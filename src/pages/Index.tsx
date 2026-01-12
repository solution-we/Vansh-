import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { Section, CATEGORIES, CATEGORY_LABELS, COLLECTION_NAMES } from '@/lib/types';
import { useSiteImages } from '@/hooks/useSiteImages';
import vansheLogo from '@/assets/vanshe-logo.png';
const SECTION_TITLES: Record<Section, string> = {
  men: 'For Men',
  women: 'For Women',
  kids: 'For Kids',
};

const ATELIER_TITLES: Record<Section, string> = {
  men: "MEN'S ATELIER",
  women: "WOMEN'S ATELIER",
  kids: "CHILDREN'S COUTURE",
};

function SectionBlock({ section, images }: { section: Section; images: Record<string, string> }) {
  const categories = CATEGORIES[section];

  const getImageOrPlaceholder = (key: string, placeholderText: string) => {
    const url = images[key];
    return url && url.length > 0 ? url : null;
  };

  const modelImage = getImageOrPlaceholder(`home_${section}_model`, `HOME – ${section.toUpperCase()} MODEL`);
  const collectionImage = getImageOrPlaceholder(`home_${section}_collection`, `HOME – ${section.toUpperCase()} COLLECTION`);

  return (
    <div className="block space-y-6">
      {/* Section Title */}
      <h2 className="font-serif text-2xl md:text-3xl text-center font-semibold">
        {SECTION_TITLES[section]}
      </h2>

      {/* Hero Banner - Square left + Wide landscape right */}
      <div className="px-4">
        <div className="grid grid-cols-[1fr_1.8fr] gap-1 md:gap-2 h-[280px] md:h-[360px] lg:h-[420px]">
          {/* Model Image - Square */}
          <Link 
            to={`/${section}`}
            className="block group h-full overflow-hidden bg-muted rounded-xl border border-foreground/10"
          >
            {modelImage ? (
              <img
                src={modelImage}
                alt={`${section} collection`}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground text-center p-4">
                <span className="text-xs uppercase tracking-wider">HOME – {section.toUpperCase()} MODEL</span>
              </div>
            )}
          </Link>

          {/* Collection Banner - Wide landscape */}
          <Link 
            to={`/new-arrivals/${section}`}
            className="block group h-full bg-charcoal relative overflow-hidden rounded-xl border border-foreground/10"
          >
            {collectionImage ? (
              <img
                src={collectionImage}
                alt="Featured product"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground text-center p-4">
                <span className="text-xs uppercase tracking-wider">HOME – {section.toUpperCase()} COLLECTION</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <p className="font-serif text-lg md:text-2xl lg:text-3xl italic text-white">
                {COLLECTION_NAMES[section]}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Atelier Title */}
      <div className="px-4">
        <h3 className="text-xs font-medium tracking-widest uppercase text-foreground">
          {ATELIER_TITLES[section]}
        </h3>
      </div>

      {/* Category Grid - 4 columns with hover effects */}
      <div className="px-4 grid grid-cols-4 gap-3">
        {categories.map((category) => {
          const categoryImage = getImageOrPlaceholder(`home_${section}_${category.replace('-', '')}`, `${section.toUpperCase()} – ${CATEGORY_LABELS[category].toUpperCase()}`);
          
          return (
            <Link
              key={category}
              to={`/${section}/${category}`}
            className="block group/cat transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl overflow-hidden"
          >
            <div className="aspect-square overflow-hidden bg-cream rounded-xl border border-foreground/10">
                {categoryImage ? (
                  <img
                    src={categoryImage}
                    alt={CATEGORY_LABELS[category]}
                    className="w-full h-full object-cover group-hover/cat:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground text-center p-2">
                    <span className="text-[8px] md:text-[10px] uppercase tracking-wider">{section.toUpperCase()} – {CATEGORY_LABELS[category].toUpperCase()}</span>
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
    </div>
  );
}

export default function Index() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { images, loading } = useSiteImages('home');

  const sections: Section[] = ['men', 'women', 'kids'];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-between h-nav">
          <Link to="/" className="flex items-center gap-2 font-serif text-2xl md:text-3xl font-medium tracking-tight">
            <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            VANSHÉ
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-10">
            <Link
              to="/"
              className="text-sm font-medium tracking-widest uppercase transition-colors duration-200 hover:text-foreground/70"
            >
              HOME
            </Link>
            <Link
              to="/men"
              className="text-sm font-medium tracking-widest uppercase transition-colors duration-200 hover:text-foreground/70"
            >
              MEN
            </Link>
            <Link
              to="/women"
              className="text-sm font-medium tracking-widest uppercase transition-colors duration-200 hover:text-foreground/70"
            >
              WOMEN
            </Link>
            <Link
              to="/kids"
              className="text-sm font-medium tracking-widest uppercase transition-colors duration-200 hover:text-foreground/70"
            >
              KIDS
            </Link>
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </nav>
      </header>

      {/* Main Content - All sections on one page */}
      <main className="pt-nav space-y-12 py-8">
        {/* Men Section */}
        <SectionBlock section="men" images={images} />
        
        {/* Men's New Arrivals */}
        <NewArrivalsSection section="men" />
        
        {/* Women Section */}
        <SectionBlock section="women" images={images} />
        
        {/* Women's New Arrivals */}
        <NewArrivalsSection section="women" />
        
        {/* Kids Section */}
        <SectionBlock section="kids" images={images} />
        
        {/* Kids New Arrivals */}
        <NewArrivalsSection section="kids" />
      </main>

      <BottomNav />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
