import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Ruler } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Size {
  value: string;
  label: string;
  inStock: boolean;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
  showSizeGuide?: boolean;
  category?: string;
}

export function SizeSelector({ 
  sizes, 
  selectedSize, 
  onSelectSize, 
  showSizeGuide = true,
  category 
}: SizeSelectorProps) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const availableSizes = sizes.filter(s => s.inStock);
  const hasUnavailableSizes = sizes.some(s => !s.inStock);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wider">
          Select Size
        </h3>
        {showSizeGuide && (
          <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Ruler className="w-3.5 h-3.5" />
                Size Guide
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">Size Guide</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Find your perfect fit using our size chart below.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 px-3 text-left font-medium">Size</th>
                        <th className="py-2 px-3 text-left font-medium">Chest (in)</th>
                        <th className="py-2 px-3 text-left font-medium">Waist (in)</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">XS</td>
                        <td className="py-2 px-3">32-34</td>
                        <td className="py-2 px-3">26-28</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">S</td>
                        <td className="py-2 px-3">34-36</td>
                        <td className="py-2 px-3">28-30</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">M</td>
                        <td className="py-2 px-3">38-40</td>
                        <td className="py-2 px-3">32-34</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">L</td>
                        <td className="py-2 px-3">42-44</td>
                        <td className="py-2 px-3">36-38</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">XL</td>
                        <td className="py-2 px-3">46-48</td>
                        <td className="py-2 px-3">40-42</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">XXL</td>
                        <td className="py-2 px-3">50-52</td>
                        <td className="py-2 px-3">44-46</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">
                  If you're between sizes, we recommend sizing up for a more relaxed fit.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => size.inStock && onSelectSize(size.value)}
            disabled={!size.inStock}
            className={cn(
              "min-w-[3rem] h-12 px-3 border text-sm font-medium transition-all duration-200",
              size.inStock 
                ? selectedSize === size.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground/60"
                : "border-border/50 text-muted-foreground/40 line-through cursor-not-allowed bg-muted/30"
            )}
          >
            {size.label}
          </button>
        ))}
      </div>

      {hasUnavailableSizes && (
        <p className="text-xs text-muted-foreground">
          Some sizes are currently unavailable
        </p>
      )}
    </div>
  );
}
