import { ReactNode, useState } from 'react';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { Section, Category } from '@/lib/types';

interface LayoutProps {
  children: ReactNode;
  showFilter?: boolean;
  section?: Section;
  category?: Category;
  onFilterChange?: (filters: FilterState) => void;
  subTypes?: string[];
}

export interface FilterState {
  subType?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest';
}

export function Layout({ 
  children, 
  showFilter = false, 
  section,
  category,
  onFilterChange,
  subTypes = []
}: LayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onSearchOpen={() => setSearchOpen(true)} 
        onFilterOpen={() => setFilterOpen(true)}
        showFilter={showFilter}
      />
      
      <main className="pt-nav pb-20 md:pb-0">
        {children}
      </main>
      
      <BottomNav />

      {/* Overlays */}
      <SearchOverlay 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
      
      {showFilter && (
        <FilterPanel
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          section={section}
          category={category}
          subTypes={subTypes}
          onApply={(filters) => {
            onFilterChange?.(filters);
            setFilterOpen(false);
          }}
        />
      )}
    </div>
  );
}
