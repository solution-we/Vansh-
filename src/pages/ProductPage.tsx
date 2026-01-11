import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useProductVariants, useProductImages } from '@/hooks/useProductVariants';
import { SECTION_LABELS, CATEGORY_LABELS } from '@/lib/types';
import { BottomNav } from '@/components/layout/BottomNav';
import { BuyNowDialog } from '@/components/product/BuyNowDialog';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { SizeSelector } from '@/components/product/SizeSelector';
import { ColorSelector } from '@/components/product/ColorSelector';
import { ProductHighlights } from '@/components/product/ProductHighlights';
import { TrustSignals } from '@/components/product/TrustSignals';
import { ProductActions } from '@/components/product/ProductActions';
import { StockBadge } from '@/components/product/StockBadge';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

// Product highlights based on category
const getProductHighlights = (category: string) => {
  const baseHighlights = [
    { text: 'Premium quality fabric with superior finish' },
    { text: 'Designed for all-day comfort and style' },
    { text: 'Easy care - machine washable' },
  ];

  if (category === 'boots') {
    return [
      { text: 'Genuine leather upper with premium finish' },
      { text: 'Cushioned insole for all-day comfort' },
      { text: 'Durable rubber sole with excellent grip' },
      { text: 'Handcrafted with attention to detail' },
    ];
  }

  return baseHighlights;
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id || '');
  const { sizes, colors, stockStatus, hasVariants, loading: variantsLoading } = useProductVariants(id || '');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuthContext();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [buyNowOpen, setBuyNowOpen] = useState(false);

  // Fetch product images based on selected color
  const { imageUrls, hasImages, loading: imagesLoading } = useProductImages(id || '', selectedColor);

  // Set default color when colors are loaded
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      const inStockColor = colors.find(c => c.inStock);
      setSelectedColor(inStockColor?.value || colors[0].value);
    }
  }, [colors, selectedColor]);

  const isLoading = loading || variantsLoading || imagesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
        <p className="font-serif text-xl mb-4">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  const isFootwear = product.category === 'boots';
  const isClothing = ['pants', 'shirt', 't-shirt'].includes(product.category);
  
  // Show size/color selectors only if we have variants
  const showSizes = hasVariants && sizes.length > 0;
  const showColors = hasVariants && colors.length > 0;
  
  const inWishlist = isInWishlist(product.id);
  const highlights = getProductHighlights(product.category);

  // Use product images from database, fallback to main product image
  const productImages = hasImages && imageUrls.length > 0 
    ? imageUrls 
    : [product.image];

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth');
      return;
    }
    if (showSizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    const success = await addToCart(product, selectedSize || undefined);
    if (success) {
      toast.success('Added to cart');
    } else {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    if (showSizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    setBuyNowOpen(true);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to manage wishlist');
      navigate('/auth');
      return;
    }
    if (inWishlist) {
      const success = await removeFromWishlist(product.id);
      if (success) {
        toast.success('Removed from wishlist');
      } else {
        toast.error('Failed to remove from wishlist');
      }
    } else {
      const success = await addToWishlist(product);
      if (success) {
        toast.success('Added to wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-8">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-between h-nav">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <Link to="/" className="font-serif text-2xl font-medium tracking-tight">
            Vanshé
          </Link>

          <div className="w-9" />
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-nav">
        <div className="md:container md:py-8">
          <div className="md:grid md:grid-cols-2 md:gap-12 lg:gap-16">
            {/* Left Column - Product Images */}
            <div className="md:sticky md:top-nav md:self-start">
              <ProductImageGallery 
                images={productImages} 
                productName={product.name} 
              />
            </div>

            {/* Right Column - Product Details */}
            <div className="p-5 md:p-0 space-y-6">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
                <Link to={`/${product.section}`} className="hover:text-foreground transition-colors">
                  {SECTION_LABELS[product.section]}
                </Link>
                <span>/</span>
                <Link 
                  to={`/${product.section}/${product.category}`} 
                  className="hover:text-foreground transition-colors"
                >
                  {CATEGORY_LABELS[product.category]}
                </Link>
                {product.sub_type && (
                  <>
                    <span>/</span>
                    <span className="capitalize">{product.sub_type}</span>
                  </>
                )}
              </nav>

              {/* Product Identity */}
              <div className="space-y-3">
                {/* Brand & Category */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Vanshé
                  </span>
                  <span className="text-muted-foreground/40">|</span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {SECTION_LABELS[product.section]}'s {CATEGORY_LABELS[product.category]}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-tight">
                  {product.name}
                </h1>

                {/* Price & Stock */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-medium">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-base text-muted-foreground line-through">
                          ₹{product.original_price!.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium text-green-700">
                          {discountPercent}% off
                        </span>
                      </>
                    )}
                  </div>
                  <StockBadge status={stockStatus} />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Color Selection */}
              {showColors && (
                <ColorSelector
                  colors={colors}
                  selectedColor={selectedColor}
                  onSelectColor={setSelectedColor}
                />
              )}

              {/* Size Selection */}
              {showSizes && (
                <SizeSelector
                  sizes={sizes}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                  showSizeGuide={true}
                  category={product.category}
                />
              )}

              {/* Actions */}
              <div className="pt-2">
                <ProductActions
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onWishlistToggle={handleWishlistToggle}
                  inWishlist={inWishlist}
                  disabled={stockStatus === 'out-of-stock'}
                />
              </div>

              <Separator className="my-6" />

              {/* Product Highlights */}
              <ProductHighlights highlights={highlights} />

              <Separator className="my-6" />

              {/* Trust Signals */}
              <TrustSignals />

              <Separator className="my-6" />

              {/* Product Details Accordion */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider">
                  Product Details
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="leading-relaxed">
                    Exquisitely crafted with attention to every detail. This piece from our 
                    {' '}{SECTION_LABELS[product.section].toLowerCase()}'s collection embodies the essence of 
                    modern luxury fashion. Made with premium materials for lasting quality and comfort.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-foreground font-medium">Category</span>
                      <p className="capitalize mt-0.5">{CATEGORY_LABELS[product.category]}</p>
                    </div>
                    {product.sub_type && (
                      <div>
                        <span className="text-foreground font-medium">Type</span>
                        <p className="capitalize mt-0.5">{product.sub_type}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-foreground font-medium">Collection</span>
                      <p className="mt-0.5">{SECTION_LABELS[product.section]}</p>
                    </div>
                    <div>
                      <span className="text-foreground font-medium">SKU</span>
                      <p className="uppercase mt-0.5">{product.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
      
      {/* Buy Now Dialog */}
      <BuyNowDialog 
        open={buyNowOpen} 
        onOpenChange={setBuyNowOpen} 
        productName={product.name}
      />
    </div>
  );
}
