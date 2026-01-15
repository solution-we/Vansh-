import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  username: string | null;
  phone: string | null;
  country_code: string;
  profile_completed: boolean;
  avatar_url: string | null;
  gender: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserConsent {
  id: string;
  user_id: string;
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  privacy_accepted: boolean;
  privacy_accepted_at: string | null;
  terms_version: string;
  privacy_version: string;
}

export function useUserProfile() {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [consent, setConsent] = useState<UserConsent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setConsent(null);
      setLoading(false);
      return;
    }

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Fetch consent
      const { data: consentData, error: consentError } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (consentError && consentError.code !== 'PGRST116') {
        console.error('Error fetching consent:', consentError);
      }

      setProfile(profileData as UserProfile | null);
      setConsent(consentData as UserConsent | null);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, fetchProfile]);

  const checkUsernameAvailable = async (username: string): Promise<boolean> => {
    if (!username || username.length < 3) return false;
    
    const { data, error } = await supabase
      .rpc('is_username_available', { 
        check_username: username,
        exclude_user_id: user?.id || null
      });
    
    if (error) {
      console.error('Error checking username:', error);
      return false;
    }
    
    return data as boolean;
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    
    setProfile(data as UserProfile);
    return data;
  };

  const acceptTerms = async () => {
    if (!user) throw new Error('Not authenticated');

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('user_consents')
      .upsert({
        user_id: user.id,
        terms_accepted: true,
        terms_accepted_at: now,
        privacy_accepted: true,
        privacy_accepted_at: now,
        updated_at: now,
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    
    setConsent(data as UserConsent);
    return data;
  };

  const isOnboardingComplete = profile?.profile_completed && consent?.terms_accepted && consent?.privacy_accepted;
  const needsProfileCompletion = isAuthenticated && !authLoading && !loading && !profile?.profile_completed;
  const needsTermsAcceptance = isAuthenticated && !authLoading && !loading && profile?.profile_completed && (!consent?.terms_accepted || !consent?.privacy_accepted);

  return {
    profile,
    consent,
    loading: loading || authLoading,
    isOnboardingComplete,
    needsProfileCompletion,
    needsTermsAcceptance,
    checkUsernameAvailable,
    updateProfile,
    acceptTerms,
    refetch: fetchProfile,
  };
}
