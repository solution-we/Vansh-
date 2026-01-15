import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Shield, ShieldCheck, Crown, Search, UserPlus, Trash2, AlertCircle, Eye, Phone, Mail, Calendar, User, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAdminAuth } from '@/hooks/useAdminAuth';

type AppRole = 'admin' | 'user' | 'owner';

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  phone: string | null;
  role: AppRole | null;
  role_id: string | null;
  user_metadata: {
    full_name?: string;
    name?: string;
    [key: string]: any;
  } | null;
  profile: {
    full_name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    phone?: string | null;
    country_code?: string | null;
    gender?: string | null;
    date_of_birth?: string | null;
    profile_completed?: boolean;
    profile_created_at?: string | null;
    profile_updated_at?: string | null;
  } | null;
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [detailsUser, setDetailsUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<AppRole>('user');
  const [updating, setUpdating] = useState(false);
  const { user: currentUser, isAdmin } = useAdminAuth();

  // Get current user's role
  const [currentUserRole, setCurrentUserRole] = useState<AppRole | null>(null);

  useEffect(() => {
    const fetchCurrentUserRole = async () => {
      if (!currentUser) return;
      
      // Fetch all roles for the user (they may have multiple)
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id);
      
      if (data && data.length > 0) {
        // Prioritize owner role if user has multiple roles
        const hasOwner = data.some(r => r.role === 'owner');
        const hasAdmin = data.some(r => r.role === 'admin');
        
        if (hasOwner) {
          setCurrentUserRole('owner');
        } else if (hasAdmin) {
          setCurrentUserRole('admin');
        } else {
          setCurrentUserRole(data[0].role as AppRole);
        }
      }
    };
    
    fetchCurrentUserRole();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      // Call edge function to get all users
      const response = await supabase.functions.invoke('get-all-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      if (response.data?.users) {
        setUsers(response.data.users);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const ownerCount = users.filter(u => u.role === 'owner').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user' || !u.role).length;

  // Check if current user can modify roles
  const canModifyRoles = currentUserRole === 'owner';

  const handleOpenRoleDialog = (user: UserWithRole) => {
    if (!canModifyRoles) {
      toast.error('Only owners can modify user roles');
      return;
    }
    setSelectedUser(user);
    setNewRole(user.role || 'user');
    setShowRoleDialog(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !canModifyRoles) return;

    // Prevent creating more than 2 owners
    if (newRole === 'owner' && ownerCount >= 2 && selectedUser.role !== 'owner') {
      toast.error('Maximum of 2 owners allowed');
      return;
    }

    setUpdating(true);
    try {
      if (selectedUser.role_id) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('id', selectedUser.role_id);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: selectedUser.id, role: newRole });

        if (error) throw error;
      }

      toast.success(`Role updated to ${newRole}`);
      setShowRoleDialog(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveRole = async (user: UserWithRole) => {
    if (!user.role_id || !canModifyRoles) {
      toast.error('Only owners can remove roles');
      return;
    }

    // Prevent removing the last owner
    if (user.role === 'owner' && ownerCount <= 1) {
      toast.error('Cannot remove the last owner');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', user.role_id);

      if (error) throw error;

      toast.success('Role removed');
      fetchUsers();
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
    }
  };

  const getUserDisplayName = (user: UserWithRole) => {
    // Prioritize profile data, then fall back to user_metadata
    return user.profile?.full_name || user.profile?.username || user.user_metadata?.full_name || user.user_metadata?.name || null;
  };

  const handleViewDetails = (user: UserWithRole) => {
    setDetailsUser(user);
    setShowDetailsDialog(true);
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const name = getUserDisplayName(user)?.toLowerCase() || '';
    return (
      user.id.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      name.includes(query)
    );
  });

  const getRoleBadge = (role: AppRole | null) => {
    switch (role) {
      case 'owner':
        return (
          <Badge variant="default" className="bg-gold text-foreground">
            <Crown className="h-3 w-3 mr-1" />
            Owner
          </Badge>
        );
      case 'admin':
        return (
          <Badge variant="default" className="bg-primary">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'user':
        return (
          <Badge variant="secondary">
            <Shield className="h-3 w-3 mr-1" />
            User
          </Badge>
        );
      default:
        return <Badge variant="outline">No Role</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>

        {/* Permission Notice */}
        {!canModifyRoles && (
          <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800">
              Only owners can modify user roles. You have read-only access.
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Owners</CardTitle>
              <Crown className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ownerCount}/2</div>
              <p className="text-xs text-muted-foreground">Max 2 allowed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Role Permissions Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-gold/10 rounded-lg border border-gold/20">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-gold" />
                  <span className="font-semibold">Owner</span>
                </div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Full system access</li>
                  <li>• Can assign/remove roles</li>
                  <li>• Maximum 2 owners</li>
                </ul>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-semibold">Admin</span>
                </div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Manage products & orders</li>
                  <li>• Manage categories & content</li>
                  <li>• Cannot modify roles</li>
                </ul>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-semibold">User</span>
                </div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Standard customer access</li>
                  <li>• Can shop & manage orders</li>
                  <li>• No admin access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchQuery ? 'Try a different search term' : 'Users will appear here once they interact with your store'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.profile?.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {getInitials(getUserDisplayName(user))}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleViewDetails(user)}
                              className="font-medium text-left hover:text-primary hover:underline transition-colors"
                            >
                              {getUserDisplayName(user) || 'No name'}
                            </button>
                            <span className="text-xs text-muted-foreground">
                              @{user.profile?.username || 'no-username'}
                            </span>
                          </div>
                          {user.id === currentUser?.id && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.email}</span>
                        {user.email_confirmed_at && (
                          <Badge variant="secondary" className="ml-2 text-xs">Verified</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.last_sign_in_at 
                          ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy h:mm a')
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRoleDialog(user)}
                            disabled={!canModifyRoles || user.id === currentUser?.id}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            {user.role ? 'Change Role' : 'Assign Role'}
                          </Button>
                          {user.role && user.id !== currentUser?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveRole(user)}
                              disabled={!canModifyRoles}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Complete profile information for this user
              </DialogDescription>
            </DialogHeader>
            {detailsUser && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={detailsUser.profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-xl">
                      {getInitials(getUserDisplayName(detailsUser))}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {getUserDisplayName(detailsUser) || 'No name'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      @{detailsUser.profile?.username || 'no-username'}
                    </p>
                    <div className="mt-1">{getRoleBadge(detailsUser.role)}</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{detailsUser.email}</p>
                    </div>
                    {detailsUser.email_confirmed_at && (
                      <Badge variant="secondary" className="ml-auto text-xs">Verified</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">
                        {detailsUser.profile?.phone 
                          ? `${detailsUser.profile.country_code || ''} ${detailsUser.profile.phone}`
                          : 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="text-sm font-medium capitalize">
                        {detailsUser.profile?.gender || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="text-sm font-medium">
                        {detailsUser.profile?.date_of_birth 
                          ? format(new Date(detailsUser.profile.date_of_birth), 'MMMM d, yyyy')
                          : 'Not provided'}
                      </p>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-semibold mb-3">Account Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Account Created</p>
                        <p className="font-medium">
                          {detailsUser.created_at 
                            ? format(new Date(detailsUser.created_at), 'MMM d, yyyy')
                            : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Sign In</p>
                        <p className="font-medium">
                          {detailsUser.last_sign_in_at 
                            ? format(new Date(detailsUser.last_sign_in_at), 'MMM d, yyyy')
                            : 'Never'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Profile Status</p>
                        <Badge variant={detailsUser.profile?.profile_completed ? 'default' : 'secondary'}>
                          {detailsUser.profile?.profile_completed ? 'Complete' : 'Incomplete'}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">User ID</p>
                        <p className="font-mono text-xs truncate" title={detailsUser.id}>
                          {detailsUser.id.substring(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Role Dialog */}
        <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser?.role ? 'Change User Role' : 'Assign User Role'}
              </DialogTitle>
              <DialogDescription>
                Select a role for this user. Only owners can modify roles.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      User - Standard customer access
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Admin - Full dashboard access (no role changes)
                    </div>
                  </SelectItem>
                  <SelectItem 
                    value="owner" 
                    disabled={ownerCount >= 2 && selectedUser?.role !== 'owner'}
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Owner - Full system access ({ownerCount}/2)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {newRole === 'owner' && ownerCount >= 2 && selectedUser?.role !== 'owner' && (
                <p className="text-sm text-destructive mt-2">
                  Maximum of 2 owners already reached
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateRole} 
                disabled={updating || (newRole === 'owner' && ownerCount >= 2 && selectedUser?.role !== 'owner')}
              >
                {updating ? 'Updating...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};
