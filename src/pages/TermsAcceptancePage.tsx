import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Shield, Loader2, Check } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import vansheLogo from '@/assets/vanshe-logo.png';

export default function TermsAcceptancePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();
  const { profile, consent, loading: profileLoading, acceptTerms } = useUserProfile();
  const { toast } = useToast();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  // Redirect if needs profile completion first
  useEffect(() => {
    if (!profileLoading && !profile?.profile_completed) {
      navigate('/complete-profile', { replace: true });
    }
  }, [profileLoading, profile?.profile_completed, navigate]);

  // Redirect if terms already accepted
  useEffect(() => {
    if (!profileLoading && profile?.profile_completed && consent?.terms_accepted && consent?.privacy_accepted) {
      navigate('/', { replace: true });
    }
  }, [profileLoading, profile?.profile_completed, consent?.terms_accepted, consent?.privacy_accepted, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted || !privacyAccepted) {
      toast({
        title: 'Required',
        description: 'You must accept both Terms and Privacy Policy to continue',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await acceptTerms();

      toast({
        title: 'Welcome to VANSHÉ!',
        description: 'Your account is ready. Happy shopping!',
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error accepting terms:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save your preferences',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-center h-nav">
          <div className="flex items-center gap-2 font-serif text-2xl md:text-3xl font-medium tracking-tight">
            <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            VANSHÉ
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-nav px-4 py-8 max-w-lg mx-auto w-full flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl mb-2">Almost There!</h1>
          <p className="text-sm text-muted-foreground">
            Please review and accept our Terms & Privacy Policy
          </p>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4 mb-8">
          <div className="p-4 border border-border rounded-lg bg-card">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Terms of Service</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  By using VANSHÉ, you agree to use our services responsibly, respect our intellectual property, 
                  and acknowledge that purchases are subject to our return and refund policies.
                </p>
                <Link to="/terms" target="_blank" className="text-sm text-primary underline underline-offset-4">
                  Read full Terms of Service →
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg bg-card">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Privacy Policy</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  We collect only essential data (email, name, phone) to process your orders and provide customer support. 
                  We do not sell your data or use tracking cookies for advertising.
                </p>
                <Link to="/privacy" target="_blank" className="text-sm text-primary underline underline-offset-4">
                  Read full Privacy Policy →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="terms" className="text-sm cursor-pointer">
                I have read and agree to the{' '}
                <Link to="/terms" target="_blank" className="text-primary underline underline-offset-4">
                  Terms of Service
                </Link>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="privacy"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="privacy" className="text-sm cursor-pointer">
                I have read and agree to the{' '}
                <Link to="/privacy" target="_blank" className="text-primary underline underline-offset-4">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 uppercase tracking-wider"
            disabled={submitting || !termsAccepted || !privacyAccepted}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Accept & Continue
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You must accept both to access VANSHÉ
          </p>
        </form>
      </main>
    </div>
  );
}
