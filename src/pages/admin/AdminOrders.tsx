import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export const AdminOrders = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-muted rounded-full mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Orders Coming Soon</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Order management will be available once checkout is implemented. 
              You'll be able to view, process, and track all customer orders here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
