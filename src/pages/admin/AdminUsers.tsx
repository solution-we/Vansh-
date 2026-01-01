import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const AdminUsers = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage registered customers</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-muted rounded-full mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">User Management Coming Soon</h3>
            <p className="text-muted-foreground text-center max-w-md">
              User management requires a profiles table linked to auth.users. 
              You'll be able to view customer information and manage roles here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
