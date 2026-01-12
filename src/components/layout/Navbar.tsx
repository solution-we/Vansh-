import { Link, useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import vansheLogo from '@/assets/vanshe-logo.png';

interface NavbarProps {
  onSearchOpen: () => void;
  onFilterOpen: () => void;
  showFilter?: boolean;
}

const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'MEN', path: '/men' },
  { label: 'WOMEN', path: '/women' },
  { label: 'KIDS', path: '/kids' },
];

export function Navbar({ onSearchOpen, onFilterOpen, showFilter = false }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container flex items-center justify-between h-nav">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-serif text-2xl md:text-3xl font-medium tracking-tight">
          <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
          VANSHÉ
        </Link>

        {/* Desktop Navigation - Center */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'text-sm font-medium tracking-widest uppercase transition-colors duration-200 hover:text-foreground/70',
                isActive(item.path) && 'border-b-2 border-foreground pb-1'
              )}
            >
              {item.label}
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
