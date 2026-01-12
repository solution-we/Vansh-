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

// Platform logo SVGs
const AmazonLogo = () => (
  <svg viewBox="0 0 100 30" className="w-full h-full">
    <path
      fill="#FF9900"
      d="M58.5 23.5c-5.3 3.9-13 6-19.6 6-9.3 0-17.6-3.4-24-9.1-.5-.4-.1-1 .5-.7 6.8 4 15.3 6.4 24 6.4 5.9 0 12.3-1.2 18.3-3.7.9-.4 1.7.6.8 1.1z"
    />
    <path
      fill="#FF9900"
      d="M60.5 21.1c-.7-.9-4.4-.4-6.1-.2-.5.1-.6-.4-.1-.7 3-2.1 7.9-1.5 8.5-.8.6.7-.2 5.7-3 8.1-.4.4-.8.2-.6-.3.6-1.5 2-4.9 1.3-6.1z"
    />
    <path
      fill="currentColor"
      d="M54.5 3.5v-1.5c0-.2.2-.4.4-.4h7.1c.2 0 .4.2.4.4v1.3c0 .2-.2.5-.6.9l-3.7 5.3c1.4 0 2.8.2 4.1.9.3.2.4.4.4.6v1.6c0 .2-.3.5-.6.3-2.2-1.2-5.2-1.3-7.7.1-.3.1-.5-.1-.5-.3v-1.5c0-.3 0-.7.3-1.1l4.3-6.1h-3.7c-.2 0-.4-.2-.4-.4z"
    />
    <path
      fill="currentColor"
      d="M20.5 12.6h-2.2c-.2 0-.4-.2-.4-.4v-10c0-.2.2-.4.4-.4h2c.2 0 .4.2.4.4v1.3h.1c.5-1.3 1.6-1.9 3-1.9 1.5 0 2.4.6 3 1.9.5-1.3 1.7-1.9 3.1-1.9 1.4 0 2.9.6 2.9 2.8v7.9c0 .2-.2.4-.4.4h-2.2c-.2 0-.4-.2-.4-.4v-6.6c0-1.2-.5-2-1.5-2s-1.6.8-1.6 2v6.6c0 .2-.2.4-.4.4h-2.2c-.2 0-.4-.2-.4-.4v-6.6c0-1.2-.5-2-1.5-2s-1.6.8-1.6 2v6.6c0 .2-.2.4-.4.4z"
    />
    <path
      fill="currentColor"
      d="M44.5 1.6c3.3 0 5.1 2.8 5.1 6.4s-1.9 6.2-5.1 6.2c-3.3 0-5-2.8-5-6.3 0-3.6 1.8-6.3 5-6.3zm0 2.3c-1.7 0-1.8 2.3-1.8 3.7s-.1 4.4 1.8 4.4c1.8 0 1.9-2.4 1.9-3.9 0-.9 0-2.1-.3-3-.3-.8-.8-1.2-1.6-1.2z"
    />
    <path
      fill="currentColor"
      d="M12.5 8c0 .9.1 1.7-.4 2.5-.4.6-1.1 1-1.9 1-1.1 0-1.7-.8-1.7-2 0-2.3 2.1-2.7 4-2.7v1.2zm2.7 6.5c-.2.1-.4.2-.6.1-.8-.7-.9-1-1.4-1.6-1.3 1.3-2.2 1.7-3.9 1.7-2 0-3.5-1.2-3.5-3.7 0-1.9 1-3.2 2.5-3.9 1.3-.6 3-.7 4.4-.8v-.3c0-.6.1-1.2-.3-1.7-.3-.4-.9-.6-1.4-.6-1 0-1.9.5-2.1 1.5-.1.2-.2.5-.5.5l-2.1-.2c-.2 0-.4-.2-.4-.5.5-2.6 2.9-3.4 5.1-3.4 1.1 0 2.5.3 3.4 1.2 1.1 1 1 2.4 1 3.9v3.5c0 1.1.4 1.5.9 2.1.1.2.2.4 0 .6l-1.7 1.5z"
    />
  </svg>
);

const FlipkartLogo = () => (
  <svg viewBox="0 0 100 24" className="w-full h-full">
    <path
      fill="#2874F0"
      d="M10 0h80c5.5 0 10 4.5 10 10v4c0 5.5-4.5 10-10 10H10C4.5 24 0 19.5 0 14v-4C0 4.5 4.5 0 10 0z"
    />
    <text x="50" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">
      Flipkart
    </text>
  </svg>
);

const MeeshoLogo = () => (
  <svg viewBox="0 0 100 24" className="w-full h-full">
    <rect width="100" height="24" rx="4" fill="#F43397"/>
    <text x="50" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">
      Meesho
    </text>
  </svg>
);

interface Platform {
  id: string;
  name: string;
  logo: React.ReactNode;
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
        logo: <AmazonLogo />,
        bgColor: 'bg-white',
        link: platformLinks?.amazon_link || `https://www.amazon.in/s?k=${searchQuery}`,
        enabled: platformLinks?.amazon_enabled !== false,
      },
      {
        id: 'flipkart',
        name: 'Flipkart',
        logo: <FlipkartLogo />,
        bgColor: 'bg-white',
        link: platformLinks?.flipkart_link || `https://www.flipkart.com/search?q=${searchQuery}`,
        enabled: platformLinks?.flipkart_enabled !== false,
      },
      {
        id: 'meesho',
        name: 'Meesho',
        logo: <MeeshoLogo />,
        bgColor: 'bg-white',
        link: platformLinks?.meesho_link,
        enabled: platformLinks?.meesho_enabled !== false && !!platformLinks?.meesho_link,
      },
      {
        id: 'vanshe',
        name: 'VANSHÉ',
        logo: (
          <div className="flex items-center justify-center gap-1">
            <img src={vansheLogo} alt="VANSHÉ" className="h-5 w-5" />
            <span className="font-serif text-xs font-semibold tracking-wider">VANSHÉ</span>
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
                <div className={`w-20 h-6 flex items-center justify-center ${platform.bgColor} rounded`}>
                  {platform.logo}
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
