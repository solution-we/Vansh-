import { Link } from 'react-router-dom';
import { CATEGORIES, CATEGORY_LABELS, Section, Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryStripProps {
  section: Section;
  activeCategory?: Category;
}

export function CategoryStrip({ section, activeCategory }: CategoryStripProps) {
  const categories = CATEGORIES[section];

  return (
    <div className="sticky top-nav z-30 bg-background border-b border-border">
      <div className="container">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar touch-pan-x py-2">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/${section}/${category}`}
              className={cn(
                'category-tab rounded-full',
                activeCategory === category
                  ? 'category-tab-active'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {CATEGORY_LABELS[category]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
