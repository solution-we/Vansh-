import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Lock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import vansheLogo from '@/assets/vanshe-logo.png';

interface PlatformLinks {
  amazon_link?: string | null;
  flipkart_link?: string | null;
  meesho_link?: string | null;
  vanshe_link?: string | null;
  amazon_enabled?: boolean;
  flipkart_enabled?: boolean;
  meesho_enabled?: boolean;
  vanshe_enabled?: boolean;
}

interface BuyNowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  platformLinks?: PlatformLinks;
}

// Platform logos using official images
const PLATFORM_LOGOS = {
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  flipkart: "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png",
  meesho: "https://images.meesho.com/images/pow/meeshoLogo_b.svg",
};

interface Platform {
  id: string;
  name: string;
  logoUrl?: string;
  logoComponent?: React.ReactNode;
  bgColor: string;
  link: string | null | undefined;
  enabled: boolean;
}

export function BuyNowDialog({ open, onOpenChange, productName, platformLinks }: BuyNowDialogProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  useEffect(() => {
    const searchQuery = encodeURIComponent(productName);
    
    setPlatforms([
      {
        id: 'amazon',
        name: 'Amazon',
        logoUrl: PLATFORM_LOGOS.amazon,
        bgColor: 'bg-white',
        link: platformLinks?.amazon_link || `https://www.amazon.in/s?k=${searchQuery}`,
        enabled: platformLinks?.amazon_enabled !== false,
      },
      {
        id: 'flipkart',
        name: 'Flipkart',
        logoUrl: PLATFORM_LOGOS.flipkart,
        bgColor: 'bg-[#2874F0]',
        link: platformLinks?.flipkart_link || `https://www.flipkart.com/search?q=${searchQuery}`,
        enabled: platformLinks?.flipkart_enabled !== false,
      },
      {
        id: 'meesho',
        name: 'Meesho',
        logoUrl: PLATFORM_LOGOS.meesho,
        bgColor: 'bg-white',
        link: platformLinks?.meesho_link,
        enabled: platformLinks?.meesho_enabled !== false && !!platformLinks?.meesho_link,
      },
      {
        id: 'vanshe',
        name: 'VANSHÉ',
        logoComponent: (
          <div className="flex items-center justify-center gap-1.5">
            <img src={vansheLogo} alt="VANSHÉ" className="h-6 w-6 object-contain" />
            <span className="font-serif text-sm font-semibold tracking-wider">VANSHÉ</span>
          </div>
        ),
        bgColor: 'bg-foreground text-background',
        link: platformLinks?.vanshe_link,
        enabled: platformLinks?.vanshe_enabled !== false && !!platformLinks?.vanshe_link,
      },
    ]);
  }, [productName, platformLinks]);

  const handlePlatformClick = (platform: Platform) => {
    if (!platform.enabled || !platform.link) {
      toast.error('Not Available', {
        description: `This product is not available on ${platform.name}`,
      });
      return;
    }
    window.open(platform.link, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-border/50">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center border-b border-border/50">
            <DialogTitle className="font-serif text-xl tracking-wide">
              Choose Platform
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Select where you'd like to purchase
            </p>
          </div>

          {/* Platform Grid */}
          <div className="p-6 grid grid-cols-2 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformClick(platform)}
                disabled={!platform.enabled || !platform.link}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl
                  border border-border/50 transition-all duration-200
                  ${platform.enabled && platform.link
                    ? 'hover:border-primary hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                    : 'opacity-50 cursor-not-allowed bg-muted/30'
                  }
                `}
              >
                {/* Disabled overlay */}
                {(!platform.enabled || !platform.link) && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-[1px]">
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span className="text-[10px] font-medium uppercase tracking-wider">
                        Not Available
                      </span>
                    </div>
                  </div>
                )}

                {/* Logo */}
                <div className={`w-24 h-8 flex items-center justify-center ${platform.bgColor} rounded-lg p-1.5`}>
                  {platform.logoUrl ? (
                    <img 
                      src={platform.logoUrl} 
                      alt={platform.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : platform.logoComponent}
                </div>

                {/* Platform name */}
                <span className="text-xs font-medium text-muted-foreground">
                  {platform.name}
                </span>

                {/* External link indicator */}
                {platform.enabled && platform.link && (
                  <ExternalLink className="absolute top-2 right-2 h-3 w-3 text-muted-foreground/50" />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2">
            <p className="text-[11px] text-center text-muted-foreground">
              You will be redirected to the selected platform
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
