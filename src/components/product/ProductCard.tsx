import { Link } from 'react-router-dom';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card block group"
    >
      <div className="aspect-[3/4] overflow-hidden bg-card">
        <img
          src={product.image}
          alt={product.name}
          className="product-image group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-3 space-y-1">
        <h3 className="product-name line-clamp-2">{product.name}</h3>
        <p className="product-price">₹{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
