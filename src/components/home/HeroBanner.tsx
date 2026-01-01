import { Link } from 'react-router-dom';
import { Section, COLLECTION_NAMES } from '@/lib/types';

interface HeroBannerProps {
  section: Section;
  modelImage: string;
  productImage: string;
}

export function HeroBanner({ section, modelImage, productImage }: HeroBannerProps) {
  return (
    <div className="grid grid-cols-[1fr_1.6fr] gap-1 md:gap-2">
      {/* Model Image - Square, links to section page */}
      <Link 
        to={`/${section}`}
        className="block group overflow-hidden bg-muted aspect-square"
      >
        <img
          src={modelImage}
          alt={`${section} collection`}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
      </Link>

      {/* Collection Banner - Landscape rectangle matching square height */}
      <Link 
        to={`/new-arrivals/${section}`}
        className="block group bg-charcoal relative overflow-hidden aspect-square"
      >
        <img
          src={productImage}
          alt="Featured product"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-4 md:p-6">
          <p className="font-serif text-lg md:text-2xl lg:text-3xl italic text-primary-foreground">
            {COLLECTION_NAMES[section]}
          </p>
        </div>
      </Link>
    </div>
  );
}
