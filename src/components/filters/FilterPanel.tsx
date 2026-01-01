import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Section, Category } from '@/lib/types';
import { FilterState } from '@/components/layout/Layout';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  section?: Section;
  category?: Category;
  subTypes: string[];
  onApply: (filters: FilterState) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
] as const;

export function FilterPanel({ 
  isOpen, 
  onClose, 
  subTypes,
  onApply 
}: FilterPanelProps) {
  const [selectedSubType, setSelectedSubType] = useState<string>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('newest');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleApply = () => {
    onApply({
      subType: selectedSubType,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
    });
  };

  const handleReset = () => {
    setSelectedSubType(undefined);
    setPriceRange([0, 50000]);
    setSortBy('newest');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="overlay-panel animate-fade-in" 
        onClick={onClose}
      />

      {/* Panel */}
      <div className="filter-panel animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-4 py-4 flex items-center justify-between">
          <h2 className="font-serif text-lg">Filters & Sort</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Sort */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={cn(
                    'px-4 py-2 text-sm rounded-full border transition-colors',
                    sortBy === option.value
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground/50'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Types */}
          {subTypes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Type</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubType(undefined)}
                  className={cn(
                    'px-4 py-2 text-sm rounded-full border transition-colors',
                    !selectedSubType
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:border-foreground/50'
                  )}
                >
                  All
                </button>
                {subTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSubType(type)}
                    className={cn(
                      'px-4 py-2 text-sm rounded-full border transition-colors capitalize',
                      selectedSubType === type
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border hover:border-foreground/50'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Price Range</h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="flex-1 h-10 px-3 bg-secondary rounded-lg text-sm outline-none"
                placeholder="Min"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="flex-1 h-10 px-3 bg-secondary rounded-lg text-sm outline-none"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4 flex gap-3 safe-bottom">
          <button
            onClick={handleReset}
            className="flex-1 h-12 border border-border rounded-full text-sm font-medium uppercase tracking-wider hover:bg-secondary transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 h-12 bg-foreground text-background rounded-full text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
