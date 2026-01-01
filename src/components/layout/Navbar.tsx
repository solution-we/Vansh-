import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { SECTIONS, SECTION_LABELS, Section } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onSearchOpen: () => void;
  onFilterOpen: () => void;
  showFilter?: boolean;
}

export function Navbar({ onSearchOpen, onFilterOpen, showFilter = false }: NavbarProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getCurrentSection = (): Section | null => {
    const path = location.pathname;
    if (path.startsWith('/men')) return 'men';
    if (path.startsWith('/women')) return 'women';
    if (path.startsWith('/kids')) return 'kids';
    return null;
  };

  const currentSection = getCurrentSection();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container flex items-center justify-between h-nav">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
          Vanshé
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden md:flex items-center gap-8">
          {SECTIONS.map((section) => (
            <Link
              key={section}
              to={`/${section}`}
              className={cn(
                'nav-link hover:text-foreground/70',
                currentSection === section && 'border-b-2 border-foreground pb-1'
              )}
            >
              {SECTION_LABELS[section]}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSearchOpen}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {showFilter && (
            <button
              onClick={onFilterOpen}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>
      </nav>

    </header>
  );
}
