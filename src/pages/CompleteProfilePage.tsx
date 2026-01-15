import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Check, X, Loader2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/ui/phone-input';
import vansheLogo from '@/assets/vanshe-logo.png';
import { z } from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name is too long'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username is too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  phone: z.string().min(6, 'Phone number is too short').max(15, 'Phone number is too long')
    .regex(/^[0-9]+$/, 'Phone number can only contain digits'),
});

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();
  const { profile, consent, loading: profileLoading, checkUsernameAvailable, updateProfile } = useUserProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    countryCode: '+91',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  // Redirect if profile already completed  
  useEffect(() => {
    if (!profileLoading && profile?.profile_completed) {
      // Profile is already done, check terms
      if (consent?.terms_accepted && consent?.privacy_accepted) {
        navigate('/', { replace: true });
      } else {
        navigate('/terms-acceptance', { replace: true });
      }
    }
  }, [profileLoading, profile?.profile_completed, consent?.terms_accepted, consent?.privacy_accepted, navigate]);

  // Pre-fill from existing profile or user metadata
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile.full_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        countryCode: profile.country_code || '+91',
      }));
    } else if (user?.user_metadata) {
      const metadata = user.user_metadata;
      setFormData(prev => ({
        ...prev,
        fullName: metadata.full_name || metadata.name || '',
      }));
    }
  }, [profile, user]);

  // Check username availability with debounce
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      // Skip if username hasn't changed from profile
      if (profile?.username?.toLowerCase() === formData.username.toLowerCase()) {
        setUsernameAvailable(true);
        return;
      }

      setCheckingUsername(true);
      try {
        const available = await checkUsernameAvailable(formData.username);
        setUsernameAvailable(available);
      } catch {
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [formData.username, profile?.username, checkUsernameAvailable]);

  const validateField = (field: string, value: string) => {
    try {
      const fieldSchema = profileSchema.shape[field as keyof typeof profileSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: err.errors[0].message }));
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const isFormValid = () => {
    try {
      profileSchema.parse(formData);
      return usernameAvailable === true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix all errors before submitting',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await updateProfile({
        full_name: formData.fullName,
        username: formData.username,
        phone: formData.phone,
        country_code: formData.countryCode,
        profile_completed: true,
      });

      toast({
        title: 'Profile Complete',
        description: 'Your profile has been saved successfully',
      });

      // Redirect to terms acceptance
      navigate('/terms-acceptance');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save profile',
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
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl mb-2">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground">
            Please provide the following information to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (locked) */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Email
            </label>
            <Input
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={errors.fullName ? 'border-destructive' : ''}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Username <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="Choose a unique username"
                className={errors.username || usernameAvailable === false ? 'border-destructive pr-10' : 'pr-10'}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingUsername && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {!checkingUsername && usernameAvailable === true && formData.username.length >= 3 && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
                {!checkingUsername && usernameAvailable === false && (
                  <X className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>
            {errors.username && (
              <p className="text-xs text-destructive mt-1">{errors.username}</p>
            )}
            {!errors.username && usernameAvailable === false && (
              <p className="text-xs text-destructive mt-1">This username is already taken</p>
            )}
            {!errors.username && usernameAvailable === true && formData.username.length >= 3 && (
              <p className="text-xs text-green-600 mt-1">Username is available</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Phone Number <span className="text-destructive">*</span>
            </label>
          <PhoneInput
              value={formData.phone}
              countryCode={formData.countryCode}
              onValueChange={(phone) => handleInputChange('phone', phone)}
              onCountryCodeChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
              placeholder="Enter phone number"
              required
            />
            {errors.phone && (
              <p className="text-xs text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 uppercase tracking-wider"
            disabled={submitting || !isFormValid()}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            All fields marked with <span className="text-destructive">*</span> are required
          </p>
        </form>
      </main>
    </div>
  );
}
