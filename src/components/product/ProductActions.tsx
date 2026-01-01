import { ShoppingBag, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductActionsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  onWishlistToggle: () => void;
  inWishlist: boolean;
  disabled?: boolean;
}

export function ProductActions({ 
  onAddToCart, 
  onBuyNow, 
  onWishlistToggle, 
  inWishlist,
  disabled = false 
}: ProductActionsProps) {
  return (
    <div className="space-y-3">
      {/* Buy Now - Primary Action */}
      <button 
        onClick={onBuyNow}
        disabled={disabled}
        className={cn(
          "w-full h-14 bg-primary text-primary-foreground font-medium uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2",
          disabled 
            ? "opacity-50 cursor-not-allowed" 
            : "hover:bg-primary/90 active:scale-[0.99]"
        )}
      >
        <Zap className="w-4 h-4" />
        Buy Now
      </button>

      {/* Add to Cart & Wishlist Row */}
      <div className="flex gap-3">
        <button 
          onClick={onAddToCart}
          disabled={disabled}
          className={cn(
            "flex-1 h-14 bg-foreground text-background font-medium uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2",
            disabled 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-foreground/90 active:scale-[0.99]"
          )}
        >
          <ShoppingBag className="w-5 h-5" />
          Add to Bag
        </button>
        
        <button 
          onClick={onWishlistToggle}
          className={cn(
            "h-14 w-14 border flex items-center justify-center transition-all duration-200",
            inWishlist 
              ? "bg-destructive/10 border-destructive/30 text-destructive" 
              : "border-border hover:border-foreground/60"
          )}
        >
          <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
        </button>
      </div>
    </div>
  );
}
