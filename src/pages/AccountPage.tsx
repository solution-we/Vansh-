import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import vansheLogo from '@/assets/vanshe-logo.png';

const menuItems = [
  { icon: Package, label: 'My Orders', path: '/account/orders' },
  { icon: MapPin, label: 'Addresses', path: '/account/addresses' },
  { icon: CreditCard, label: 'Payment Methods', path: '/account/payments' },
  { icon: HelpCircle, label: 'Help & Support', path: '/account/help' },
];

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-center h-nav">
          <Link to="/" className="flex items-center gap-2 font-serif text-2xl md:text-3xl font-medium tracking-tight">
            <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            VANSHÉ
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-nav px-4 py-8">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          {loading ? (
            <>
              <h1 className="font-serif text-xl mb-1">Loading...</h1>
              <p className="text-sm text-muted-foreground">Please wait</p>
            </>
          ) : user ? (
            <>
              <h1 className="font-serif text-xl mb-1">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-xl mb-1">Welcome</h1>
              <p className="text-sm text-muted-foreground">Sign in to access your account</p>
            </>
          )}
        </div>

        {/* Sign In Button - only show if not logged in */}
        {!loading && !user && (
          <Link
            to="/auth"
            className="block w-full h-12 bg-foreground text-background font-medium uppercase tracking-wider mb-8 flex items-center justify-center hover:bg-foreground/90 transition-colors"
          >
            Sign In
          </Link>
        )}

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-4 p-4 hover:bg-secondary rounded-lg transition-colors"
            >
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>

        {/* Sign Out - only show if logged in */}
        {!loading && user && (
          <div className="mt-8 pt-8 border-t border-border">
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-4 p-4 w-full hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
