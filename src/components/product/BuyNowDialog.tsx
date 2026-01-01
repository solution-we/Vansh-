import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BuyNowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

export function BuyNowDialog({ open, onOpenChange, productName }: BuyNowDialogProps) {
  const handleRedirect = (platform: 'amazon' | 'flipkart') => {
    const searchQuery = encodeURIComponent(productName);
    const urls = {
      amazon: `https://www.amazon.in/s?k=${searchQuery}`,
      flipkart: `https://www.flipkart.com/search?q=${searchQuery}`,
    };
    window.open(urls[platform], '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-xl">
            Buy Now
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Choose your preferred platform to purchase
        </p>
        <div className="flex items-center justify-center gap-8">
          {/* Amazon */}
          <button
            onClick={() => handleRedirect('amazon')}
            className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:border-primary hover:bg-secondary/50 transition-all group"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-14 h-14">
                <path
                  fill="#FF9800"
                  d="M36.9 39.5c-9.1 6.7-22.3 10.3-33.7 10.3-1.6 0-3.1-.1-4.6-.3-.5-.1-.8.4-.4.7 1.1.9 2.3 1.7 3.5 2.4 10.8 6.2 24.1 6.8 35.4 1.6 1.6-.7 3.1-1.6 4.5-2.5.6-.4.1-1.1-.5-.8-1.4.4-2.8.6-4.2.6z"
                  transform="translate(0,-10) scale(1)"
                />
                <path
                  fill="#FF9800"
                  d="M39.6 36.2c-.7-.9-4.6-.4-6.3-.2-.5.1-.6-.4-.1-.7 3.1-2.2 8.2-1.6 8.8-.8.6.8-.2 6.2-3.1 8.8-.4.4-.9.2-.7-.3.7-1.7 2.1-5.9 1.4-6.8z"
                  transform="translate(0,-10) scale(1)"
                />
                <path
                  fill="#37474F"
                  d="M33.4 11.6c-3.5 0-6.1 1.3-7.8 3.5-.2.3-.1.5.2.5l3.5.4c.2 0 .4-.1.5-.3.6-1.1 1.9-1.6 3.4-1.6 1.2 0 2.5.4 3.2 1.4.8 1.1.7 2.7.7 4v.7c-2-.2-4.5-.2-6.5.3-3.3.8-5.8 3-5.8 6.8 0 4.3 2.7 6.5 6.2 6.5 2.9 0 4.5-.7 6.8-3 .8 1.1 1 1.6 2.3 2.8.3.1.6.1.9-.1 0 0 2.4-2.1 3.3-2.9.3-.2.2-.6 0-.9-1-1.3-2-2.4-2-4.9V16.4c0-2.2.2-4.2-1.4-5.7-1.3-1.2-3.5-1.1-5.1-1.1h-2.4zm1.9 10.6c.7 0 1.5.1 2.1.2v1.3c0 1.5.1 2.7-.7 4-.7 1.1-1.8 1.7-3 1.7-1.7 0-2.7-1.3-2.7-3.2 0-2.8 2-4 4.3-4z"
                  transform="translate(-8,-2) scale(1.1)"
                />
              </svg>
            </div>
            <span className="text-sm font-medium uppercase tracking-wider group-hover:text-primary transition-colors">
              Amazon
            </span>
          </button>

          {/* Flipkart */}
          <button
            onClick={() => handleRedirect('flipkart')}
            className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border hover:border-primary hover:bg-secondary/50 transition-all group"
          >
            <div className="w-16 h-16 flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-14 h-14">
                <rect width="48" height="48" rx="4" fill="#2874F0" />
                <path
                  fill="#FFFF00"
                  d="M27 8c0 1.1-.4 2-1.2 2.7-.8.7-1.8 1-3 1h-1.3v3.4h-2.3V5.3h3.6c1.2 0 2.2.3 2.9 1 .8.6 1.3 1.5 1.3 1.7z"
                  transform="translate(4,6) scale(1.2)"
                />
                <path
                  fill="#FFF"
                  d="M13 18h22v22H13z"
                  opacity="0.1"
                />
                <text
                  x="24"
                  y="34"
                  textAnchor="middle"
                  fill="#FFF"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="Arial"
                >
                  F
                </text>
              </svg>
            </div>
            <span className="text-sm font-medium uppercase tracking-wider group-hover:text-primary transition-colors">
              Flipkart
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
