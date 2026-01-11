import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BottomNav } from '@/components/layout/BottomNav';

type AuthMode = 'signin' | 'signup' | 'verify-email' | 'forgot-password' | 'reset-sent';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in",
      });
      navigate('/');
    } catch (error: any) {
      let message = "An error occurred";
      
      if (error.message.includes("Invalid login credentials")) {
        message = "Invalid email or password";
      } else if (error.message.includes("Email not confirmed")) {
        message = "Please verify your email before signing in. Check your inbox for the verification link.";
      } else {
        message = error.message;
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Check if user needs to verify email
      if (data.user && !data.session) {
        // Email confirmation required
        setMode('verify-email');
      } else if (data.user && data.session) {
        // Auto-confirmed, user is signed in
        toast({
          title: "Account created!",
          description: "Welcome to Vanshé",
        });
        navigate('/');
      }
    } catch (error: any) {
      let message = "An error occurred";
      
      if (error.message.includes("User already registered")) {
        message = "An account with this email already exists";
      } else {
        message = error.message;
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Email sent!",
        description: "Please check your inbox for the verification link",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      setMode('reset-sent');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-center h-nav">
          <Link to="/" className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
            Vanshé
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-nav px-4 py-8 max-w-md mx-auto">
        {/* Back link */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {mode === 'reset-sent' ? (
          /* Password Reset Sent */
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Mail className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl mb-2">Check Your Email</h1>
            <p className="text-sm text-muted-foreground mb-2">
              We've sent a password reset link to
            </p>
            <p className="text-sm font-medium mb-6">{email}</p>
            <p className="text-sm text-muted-foreground mb-8">
              Click the link in the email to reset your password.
            </p>

            <button
              onClick={() => {
                setMode('signin');
                setPassword('');
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Sign In
            </button>
          </div>
        ) : mode === 'forgot-password' ? (
          /* Forgot Password */
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl mb-2">Forgot Password?</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2 text-left">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-foreground text-background font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <button
              onClick={() => {
                setMode('signin');
                setPassword('');
              }}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Sign In
            </button>
          </div>
        ) : mode === 'verify-email' ? (
          /* Email Verification Sent */
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Mail className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl mb-2">Check Your Email</h1>
            <p className="text-sm text-muted-foreground mb-2">
              We've sent a verification link to
            </p>
            <p className="text-sm font-medium mb-6">{email}</p>
            <p className="text-sm text-muted-foreground mb-8">
              Click the link in the email to verify your account and start shopping.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full h-12 border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>

              <button
                onClick={() => {
                  setMode('signin');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up */
          <>
            <div className="text-center mb-8">
              <h1 className="font-serif text-2xl md:text-3xl mb-2">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' 
                  ? 'Sign in to access your cart and orders' 
                  : 'Join us to start shopping'}
              </p>
            </div>

            <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 pr-12 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 px-4 border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-foreground text-background font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-sm font-medium underline underline-offset-4 hover:text-muted-foreground mt-1"
              >
                {mode === 'signin' ? 'Create one' : 'Sign in'}
              </button>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
