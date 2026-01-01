import { Check } from 'lucide-react';

interface Highlight {
  text: string;
}

interface ProductHighlightsProps {
  highlights: Highlight[];
}

export function ProductHighlights({ highlights }: ProductHighlightsProps) {
  if (!highlights.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium uppercase tracking-wider">
        Highlights
      </h3>
      <ul className="space-y-2">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" strokeWidth={2} />
            <span>{highlight.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
