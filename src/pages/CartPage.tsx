import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { toast } from 'sonner';
import vansheLogo from '@/assets/vanshe-logo.png';

export default function CartPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [colorImages, setColorImages] = useState<Record<string, string>>({});

  // Fetch color-specific images for cart items
  useEffect(() => {
    const fetchColorImages = async () => {
      const productIds = items.map(item => item.product.id);
      if (productIds.length === 0) return;

      const { data } = await supabase
        .from('product_images')
        .select('product_id, color, image_url')
        .in('product_id', productIds);

      if (data) {
        const imageMap: Record<string, string> = {};
        data.forEach(img => {
          if (img.color) {
            imageMap[`${img.product_id}-${img.color}`] = img.image_url;
          }
        });
        setColorImages(imageMap);
      }
    };

    fetchColorImages();
  }, [items]);

  const getCartItemImage = (item: CartItem) => {
    if (item.color) {
      const colorImage = colorImages[`${item.product.id}-${item.color}`];
      if (colorImage) return colorImage;
    }
    return item.product.image;
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to checkout');
      navigate('/auth');
      return;
    }
    setCheckoutOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <nav className="container flex items-center justify-between h-nav">
            <Link to="/" className="flex items-center gap-2 font-serif text-2xl md:text-3xl font-medium tracking-tight">
              <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
              VANSHÉ
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
              <ShoppingBag className="w-10 h-10 text-nav-icon" />
            </div>
            <h2 className="font-serif text-xl mb-2">Sign in to view your cart</h2>
            <p className="text-muted-foreground mb-6">
              Add items to your cart by signing in first
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
          <Link to="/" className="flex items-center gap-2 font-serif text-2xl md:text-3xl font-medium tracking-tight">
            <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            VANSHÉ
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
          Shopping Cart {items.length > 0 && `(${items.length})`}
        </h1>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-nav-icon" />
            </div>
            <h2 className="font-serif text-xl mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Explore our collections and add items to your cart
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-border rounded-sm"
                >
                  {/* Product Image - shows color-specific image if available */}
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <img
                      src={getCartItemImage(item)}
                      alt={item.product.name}
                      className="w-24 h-32 object-cover bg-cream premium-image"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link 
                        to={`/product/${item.product.id}`}
                        className="font-serif text-lg hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      {item.size && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Color: {item.color}
                        </p>
                      )}
                      <p className="font-medium mt-1">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-border rounded-sm flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full h-14 bg-foreground text-background font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors mt-6"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Checkout Dialog */}
      <CheckoutDialog 
        open={checkoutOpen} 
        onOpenChange={setCheckoutOpen}
        totalPrice={totalPrice}
      />
    </div>
  );
}

function CheckoutDialog({ 
  open, 
  onOpenChange,
  totalPrice 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  totalPrice: number;
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    countryCode: '+91',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [pincodeChecked, setPincodeChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset pincode check when pincode changes
    if (name === 'pincode') {
      setPincodeChecked(false);
    }
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.address || 
        !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setPincodeChecked(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Shipping Address
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCheckDelivery} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <PhoneInput
              value={formData.phone}
              countryCode={formData.countryCode}
              onValueChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
              onCountryCodeChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
              placeholder="Phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, building, floor"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                setFormData(prev => ({ ...prev, pincode: numericValue }));
                setPincodeChecked(false);
              }}
              placeholder="6-digit pincode"
              maxLength={6}
              inputMode="numeric"
              required
            />
          </div>

          {/* Order Summary in Dialog */}
          <div className="border-t border-border pt-4 mt-6">
            <div className="flex justify-between font-medium">
              <span>Order Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Pincode Check Result */}
          {pincodeChecked && (
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-center">
              <p className="text-amber-800 font-medium">
                Delivery is currently unavailable for this pincode
              </p>
              <p className="text-amber-600 text-sm mt-1">
                Please try a different pincode or check back later
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 bg-foreground text-background font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
          >
            Check Delivery Availability
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
