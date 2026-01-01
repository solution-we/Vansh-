import { cn } from '@/lib/utils';

interface StockBadgeProps {
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  quantity?: number;
}

export function StockBadge({ status, quantity }: StockBadgeProps) {
  const config = {
    'in-stock': {
      label: 'In Stock',
      className: 'text-green-700 bg-green-50'
    },
    'low-stock': {
      label: quantity ? `Only ${quantity} left` : 'Low Stock',
      className: 'text-amber-700 bg-amber-50'
    },
    'out-of-stock': {
      label: 'Out of Stock',
      className: 'text-destructive bg-destructive/10'
    }
  };

  const { label, className } = config[status];

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-sm",
      className
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === 'in-stock' && "bg-green-500",
        status === 'low-stock' && "bg-amber-500",
        status === 'out-of-stock' && "bg-destructive"
      )} />
      {label}
    </span>
  );
}
