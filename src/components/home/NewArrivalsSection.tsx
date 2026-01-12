import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Section, Product, SECTION_LABELS } from '@/lib/types';

interface NewArrivalsSectionProps {
  section: Section;
}

export function NewArrivalsSection({ section }: NewArrivalsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('section', section)
        .order('created_at', { ascending: false })
        .limit(8);

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchNewArrivals();
  }, [section]);

  if (loading || products.length === 0) return null;

  return (
    <div className="px-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg md:text-xl">
          {SECTION_LABELS[section]}'s New Arrivals
        </h3>
        <Link 
          to={`/new-arrivals/${section}`}
          className="text-xs font-medium tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.slice(0, 4).map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group block"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-xl border border-foreground/10 bg-cream mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <p className="text-sm font-medium truncate">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              ₹{product.price.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
