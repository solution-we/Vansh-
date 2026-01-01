import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Trash2 } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function WishlistPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const handleMoveToCart = async (item: typeof items[0]) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth');
      return;
    }
    const cartSuccess = await addToCart(item.product);
    if (cartSuccess) {
      await removeFromWishlist(item.product.id);
      toast.success('Moved to cart');
    } else {
      toast.error('Failed to add to cart');
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    const success = await removeFromWishlist(productId);
    if (success) {
      toast.success('Removed from wishlist');
    } else {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <nav className="container flex items-center justify-between h-nav">
            <Link to="/" className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
              Vanshé
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </nav>
        </header>
        <main className="pt-nav px-4 py-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-nav-icon" />
            </div>
            <h2 className="font-serif text-xl mb-2">Sign in to view your wishlist</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love by signing in first
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-8 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </main>
        <BottomNav />
        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-between h-nav">
          <Link to="/" className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
            Vanshé
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-nav px-4 py-8">
        <h1 className="font-serif text-2xl md:text-3xl text-center mb-8">
          Wishlist {items.length > 0 && `(${items.length})`}
        </h1>

        {items.length === 0 ? (
          /* Empty Wishlist State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-nav-icon" />
            </div>
            <h2 className="font-serif text-xl mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love by clicking the heart icon
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group border border-border rounded-sm overflow-hidden"
                >
                  {/* Product Image */}
                  <Link to={`/product/${item.product.id}`} className="block">
                    <div className="aspect-[3/4] overflow-hidden bg-cream">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="p-3">
                    <Link 
                      to={`/product/${item.product.id}`}
                      className="font-serif text-sm hover:underline line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="font-medium text-sm mt-1">
                      ₹{item.product.price.toLocaleString()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 h-9 bg-foreground text-background text-xs font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
                      >
                        Add to Bag
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.product.id)}
                        className="w-9 h-9 border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
