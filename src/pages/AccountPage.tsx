import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, MapPin, CreditCard, HelpCircle, LogOut, Camera, Loader2, ChevronRight, Mail, Phone, User, Calendar, Heart } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import vansheLogo from '@/assets/vanshe-logo.png';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const menuItems = [
  { icon: Package, label: 'My Orders', subtitle: 'Track, return, or buy again', path: '/account/orders' },
  { icon: Heart, label: 'Wishlist', subtitle: 'Your saved items', path: '/wishlist' },
  { icon: MapPin, label: 'Addresses', subtitle: 'Manage delivery addresses', path: '/account/addresses' },
  { icon: CreditCard, label: 'Payment Methods', subtitle: 'Saved cards & UPI', path: '/account/payments' },
  { icon: HelpCircle, label: 'Help & Support', subtitle: 'FAQs, contact us', path: '/account/help' },
];

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, updateProfile, refetch } = useUserProfile();

  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    date_of_birth: '',
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        gender: profile.gender || '',
        date_of_birth: profile.date_of_birth || '',
      });
    }
  }, [profile]);

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      await refetch();

      toast({
        title: 'Photo updated',
        description: 'Your profile photo has been updated',
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload photo',
        variant: 'destructive',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        gender: formData.gender || null,
        date_of_birth: formData.date_of_birth || null,
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved',
      });
      setEditSheetOpen(false);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 pb-bottom-nav">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <nav className="flex items-center justify-center h-14 px-4">
          <Link to="/" className="flex items-center gap-2 font-serif text-xl font-medium tracking-tight">
            <img src={vansheLogo} alt="Vanshé logo" className="w-5 h-5 object-contain" />
            VANSHÉ
          </Link>
        </nav>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Profile Card */}
        <div className="bg-background">
          {user && profile ? (
            <div className="p-6">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20 border-2 border-border">
                    <AvatarImage src={profile?.avatar_url || ''} alt="Profile" />
                    <AvatarFallback className="text-xl bg-secondary font-serif">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-md">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                    {uploadingPhoto ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Camera className="w-3.5 h-3.5" />
                    )}
                  </label>
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="font-serif text-xl font-medium truncate">
                    {profile?.full_name || 'Welcome'}
                  </h1>
                  <p className="text-sm text-muted-foreground truncate">
                    @{profile?.username}
                  </p>
                </div>

                <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="shrink-0">
                      Edit
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto max-h-[85vh] rounded-t-2xl">
                    <SheetHeader className="text-left pb-4">
                      <SheetTitle className="font-serif">Edit Profile</SheetTitle>
                    </SheetHeader>
                    
                    <div className="space-y-5 pb-8">
                      {/* Gender */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Gender</label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date of Birth</label>
                        <Input
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                          max={new Date().toISOString().split('T')[0]}
                          className="h-12"
                        />
                      </div>

                      <Button 
                        onClick={handleSaveProfile} 
                        disabled={saving}
                        className="w-full h-12"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Save Changes
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-2 mt-5">
                {profile?.gender && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-medium capitalize">
                    <User className="w-3 h-3" />
                    {profile.gender.replace(/-/g, ' ')}
                  </span>
                )}
                {profile?.date_of_birth && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-medium">
                    <Calendar className="w-3 h-3" />
                    {formatDate(profile.date_of_birth)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-border">
                <AvatarFallback className="text-2xl bg-secondary font-serif">?</AvatarFallback>
              </Avatar>
              <h1 className="font-serif text-xl font-medium mb-1">Welcome to Vanshé</h1>
              <p className="text-sm text-muted-foreground mb-5">Sign in to access your account</p>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center w-full h-12 bg-primary text-primary-foreground font-medium uppercase tracking-wider text-sm rounded-lg"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Account Details */}
        {user && profile && (
          <div className="mt-2 bg-background">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Account Details
              </h2>
            </div>
            <div className="divide-y divide-border">
              <div className="flex items-center gap-4 px-4 py-3.5">
                <Mail className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 py-3.5">
                <Phone className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">
                    {profile.phone ? `${profile.country_code || ''} ${profile.phone}` : 'Not added'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="mt-2 bg-background">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h2>
          </div>
          <div className="divide-y divide-border">
            {menuItems.map(({ icon: Icon, label, subtitle, path }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-4 px-4 py-4 active:bg-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-foreground/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        {user && (
          <div className="mt-2 bg-background">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-4 px-4 py-4 w-full text-left active:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Sign Out</p>
                <p className="text-xs text-muted-foreground">Log out of your account</p>
              </div>
            </button>
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-4 px-4 pb-6">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
