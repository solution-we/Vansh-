import { Link } from 'react-router-dom';
import { Section } from '@/lib/types';

interface CategoryCardProps {
  section: Section;
  category: string;
  displayName: string;
  image: string;
}

export function CategoryCard({ section, category, displayName, image }: CategoryCardProps) {
  return (
    <Link
      to={`/${section}/${category}`}
      className="block group"
    >
      <div className="aspect-square overflow-hidden bg-card">
        <img
          src={image}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="mt-2 text-center">
        <span className="inline-block px-3 py-1 bg-foreground text-background text-[10px] font-medium uppercase tracking-wider">
          {displayName}
        </span>
      </div>
    </Link>
  );
}
