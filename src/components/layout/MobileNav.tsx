import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import vansheLogo from '@/assets/vanshe-logo.png';

const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'MEN', path: '/men' },
  { label: 'WOMEN', path: '/women' },
  { label: 'KIDS', path: '/kids' },
];

interface MobileNavProps {
  onSearchOpen: () => void;
}

export function MobileNav({ onSearchOpen }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 hover:bg-secondary rounded-full transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 left-0 right-0 bg-background border-b border-border shadow-xl animate-in slide-in-from-top duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link 
                to="/" 
                className="flex items-center gap-2 font-serif text-xl font-medium tracking-tight"
                onClick={() => setIsOpen(false)}
              >
                <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 object-contain" />
                VANSHÉ
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center px-6 py-4 text-sm font-medium tracking-widest uppercase transition-colors',
                    'hover:bg-secondary',
                    isActive(item.path) 
                      ? 'bg-secondary text-foreground border-l-4 border-primary' 
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
