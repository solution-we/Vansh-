import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff } from 'lucide-react';

// Only these emails are allowed to be admins
const ALLOWED_ADMIN_EMAILS = ['vansheofficial@gamil.com'];

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if email is in the allowed list
      if (!ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())) {
        toast.error('Access denied. This email is not authorized for admin access.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If user doesn't exist yet and it's a valid admin email, sign them up
        if (error.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/admin`,
            }
          });

          if (signUpError) throw signUpError;

          if (signUpData.user) {
            // Add admin role
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert([{ user_id: signUpData.user.id, role: 'admin' }]);

            if (roleError) {
              console.error('Error adding admin role:', roleError);
            }

            toast.success('Admin account created! Please check your email to confirm, then log in again.');
            setLoading(false);
            return;
          }
        }
        throw error;
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase.rpc('has_role', {
        _user_id: data.user.id,
        _role: 'admin'
      });

      if (roleError) throw roleError;

      if (!roleData) {
        // Add admin role if email is allowed but role doesn't exist
        if (ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())) {
          const { error: addRoleError } = await supabase
            .from('user_roles')
            .upsert([{ user_id: data.user.id, role: 'admin' }], { onConflict: 'user_id,role' });

          if (addRoleError) {
            console.error('Error adding admin role:', addRoleError);
            await supabase.auth.signOut();
            toast.error('Failed to assign admin role. Please contact support.');
            setLoading(false);
            return;
          }
        } else {
          await supabase.auth.signOut();
          toast.error('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }
      }

      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => navigate('/')}>
              ← Back to Store
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
