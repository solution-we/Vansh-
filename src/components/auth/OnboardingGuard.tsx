import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

// Routes that don't require onboarding completion
const PUBLIC_ROUTES = [
  '/auth',
  '/complete-profile',
  '/terms-acceptance',
  '/terms',
  '/privacy',
  '/admin',
  '/admin/login',
];

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { needsProfileCompletion, needsTermsAcceptance, loading: profileLoading } = useUserProfile();

  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith('/admin')
  );

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!isAuthenticated) return;
    if (isPublicRoute) return;

    if (needsProfileCompletion) {
      navigate('/complete-profile', { replace: true });
    } else if (needsTermsAcceptance) {
      navigate('/terms-acceptance', { replace: true });
    }
  }, [authLoading, profileLoading, isAuthenticated, needsProfileCompletion, needsTermsAcceptance, isPublicRoute, navigate]);

  // Show loading state only for protected routes when checking onboarding status
  if (!isPublicRoute && isAuthenticated && (authLoading || profileLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
