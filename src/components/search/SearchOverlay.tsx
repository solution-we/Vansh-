import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { useSearchProducts } from '@/hooks/useProducts';
import { SECTION_LABELS, CATEGORY_LABELS } from '@/lib/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const { results, loading } = useSearchProducts(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay animate-fade-in">
      <div className="container py-4">
        {/* Search Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-12 pl-12 pr-4 bg-secondary rounded-full text-base outline-none focus:ring-2 ring-foreground/20"
            />
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results */}
        <div className="space-y-2">
          {loading && (
            <div className="text-center py-8 text-muted-foreground">
              Searching...
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found for "{query}"</p>
            </div>
          )}

          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="w-full flex items-center gap-4 p-3 hover:bg-secondary rounded-lg transition-colors text-left"
            >
              <div className="w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {SECTION_LABELS[product.section]} • {CATEGORY_LABELS[product.category]}
                </p>
                <p className="text-sm font-medium mt-1">₹{product.price.toLocaleString()}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
