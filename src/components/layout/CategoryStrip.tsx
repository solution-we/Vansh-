import { Link } from 'react-router-dom';
import { Section } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';

interface CategoryStripProps {
  section: Section;
  activeCategory?: string;
}

export function CategoryStrip({ section, activeCategory }: CategoryStripProps) {
  const { categories, loading } = useCategories(section);

  if (loading) {
    return (
      <div className="sticky top-nav z-30 bg-background border-b border-border">
        <div className="container">
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar touch-pan-x py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-20 bg-secondary animate-pulse rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-nav z-30 bg-background border-b border-border">
      <div className="container">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar touch-pan-x py-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/${section}/${category.name}`}
              className={cn(
                'category-tab rounded-full',
                activeCategory === category.name
                  ? 'category-tab-active'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {category.display_name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
