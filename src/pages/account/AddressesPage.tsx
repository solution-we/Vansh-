import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus, Loader2 } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country_code: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Fetch addresses from database
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAddresses = async () => {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load addresses');
      } else {
        setAddresses(data || []);
      }
      setLoading(false);
    };

    fetchAddresses();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save addresses');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all fields');
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: user.id,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        country_code: '+91',
        is_default: addresses.length === 0,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
      return;
    }

    setAddresses(prev => [data, ...prev]);
    setDialogOpen(false);
    setFormData({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
    toast.success('Address added');
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to remove address');
      return;
    }

    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success('Address removed');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-bottom-nav">
        <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <nav className="container flex items-center justify-between h-nav">
            <Link to="/account" className="p-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-serif text-lg font-medium">My Addresses</span>
            <div className="w-9" />
          </nav>
        </header>
        <main className="pt-nav px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-muted-foreground">Please sign in to manage addresses</p>
            <Link to="/auth" className="mt-4 text-primary underline">Sign In</Link>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-between h-nav">
          <Link to="/account" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-serif text-lg font-medium">My Addresses</span>
          <button 
            onClick={() => setDialogOpen(true)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-nav px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-serif text-xl mb-2">No Addresses Saved</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Add an address to make checkout faster
            </p>
            <button 
              onClick={() => setDialogOpen(true)}
              className="h-12 px-8 bg-foreground text-background font-medium uppercase tracking-wider flex items-center justify-center hover:bg-foreground/90 transition-colors"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-4 border border-border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{addr.name}</h3>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{addr.phone}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            ))}
            <button 
              onClick={() => setDialogOpen(true)}
              className="w-full h-12 border border-dashed border-border text-muted-foreground font-medium uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          </div>
        )}
      </main>

      {/* Add Address Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                maxLength={15}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={formData.address}
                onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                maxLength={255}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  value={formData.city}
                  onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  value={formData.state}
                  onChange={(e) => setFormData(p => ({ ...p, state: e.target.value }))}
                  maxLength={100}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input 
                id="pincode" 
                value={formData.pincode}
                onChange={(e) => setFormData(p => ({ ...p, pincode: e.target.value }))}
                maxLength={10}
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Address
          </Button>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
