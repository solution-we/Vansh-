import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Image, 
  Images,
  Palette, 
  LogOut, 
  ChevronLeft,
  Users,
  ShoppingBag,
  FolderOpen,
  Paintbrush
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Products', href: '/admin/products', icon: Package },
  { title: 'Product Images', href: '/admin/product-images', icon: Images },
  { title: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { title: 'Common Colors', href: '/admin/colors', icon: Paintbrush },
  { title: 'Site Images', href: '/admin/images', icon: Image },
  { title: 'Variants', href: '/admin/variants', icon: Palette },
  { title: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { title: 'Users', href: '/admin/users', icon: Users },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold tracking-tight">VANSHÉ Admin</h1>
          <p className="text-xs text-muted-foreground mt-1">Management Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
