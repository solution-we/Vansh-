import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Section, SECTION_LABELS } from '@/lib/types';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { useSiteImages } from '@/hooks/useSiteImages';


};

export default function CategoriesPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { images, loading } = useSiteImages('categories');

  const sections: Section[] = ['men', 'women', 'kids'];

  const getSectionImage = (section: Section): string => {
    const key = `section_${section}`;
    return images[key] || DEFAULT_SECTION_IMAGES[section];
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
      <main className="pt-nav px-4 py-8">
        <h1 className="font-serif text-2xl md:text-3xl text-center mb-8">
          Categories
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {sections.map((section) => (
            <Link
              key={section}
              to={`/${section}`}
              className="block group"
            >
              <div className="aspect-[3/4] overflow-hidden bg-cream rounded-lg">
                <img
                  src={getSectionImage(section)}
                  alt={SECTION_LABELS[section]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="font-serif text-lg md:text-xl font-medium">
                  {SECTION_LABELS[section]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BottomNav />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
