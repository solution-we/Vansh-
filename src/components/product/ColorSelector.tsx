import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Color {
  value: string;
  label: string;
  hex: string;
  inStock: boolean;
}

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export function ColorSelector({ colors, selectedColor, onSelectColor }: ColorSelectorProps) {
  const selectedColorData = colors.find(c => c.value === selectedColor);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium uppercase tracking-wider">
          Color
        </h3>
        {selectedColorData && (
          <span className="text-sm text-muted-foreground">
            — {selectedColorData.label}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => color.inStock && onSelectColor(color.value)}
            disabled={!color.inStock}
            title={color.label}
            className={cn(
              "relative w-10 h-10 rounded-full transition-all duration-200",
              color.inStock 
                ? "cursor-pointer hover:scale-110"
                : "cursor-not-allowed opacity-40",
              selectedColor === color.value && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
            )}
            style={{ backgroundColor: color.hex }}
          >
            {/* Selected Checkmark */}
            {selectedColor === color.value && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Check 
                  className={cn(
                    "w-4 h-4",
                    isLightColor(color.hex) ? "text-foreground" : "text-background"
                  )} 
                  strokeWidth={3}
                />
              </span>
            )}
            
            {/* Out of Stock Indicator */}
            {!color.inStock && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-full h-0.5 bg-destructive rotate-45 absolute" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Helper function to determine if a color is light
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
