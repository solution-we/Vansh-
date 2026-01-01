import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-between h-nav">
          <Link to="/account" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-serif text-lg font-medium">My Orders</span>
          <div className="w-9" />
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-nav px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-serif text-xl mb-2">No Orders Yet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            When you place orders, they will appear here
          </p>
          <Link 
            to="/"
            className="h-12 px-8 bg-foreground text-background font-medium uppercase tracking-wider flex items-center justify-center hover:bg-foreground/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
