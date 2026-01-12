import { Shield, BadgeCheck, Truck } from 'lucide-react';

const trustItems = [
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout'
  },
  {
    icon: BadgeCheck,
    title: 'Authenticity',
    description: 'Guaranteed genuine'
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over ₹999'
  }
];

export function TrustSignals() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {trustItems.map((item) => (
        <div key={item.title} className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 bg-secondary rounded-full flex items-center justify-center">
            <item.icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium leading-tight">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
