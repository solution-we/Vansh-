import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CommonColor {
  id: string;
  name: string;
  hex_code: string;
  created_at: string;
}

export const AdminColors = () => {
  const [colors, setColors] = useState<CommonColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<CommonColor | null>(null);
  const [formData, setFormData] = useState({ name: '', hex_code: '#000000' });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const { data, error } = await supabase
        .from('common_colors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setColors(data || []);
    } catch (error) {
      console.error('Error fetching colors:', error);
      toast.error('Failed to load colors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate name
    const duplicate = colors.find(
      c => c.name.toLowerCase() === formData.name.toLowerCase() && c.id !== editingColor?.id
    );
    if (duplicate) {
      toast.error('A color with this name already exists');
      return;
    }

    try {
      if (editingColor) {
        const { error } = await supabase
          .from('common_colors')
          .update({ name: formData.name, hex_code: formData.hex_code })
          .eq('id', editingColor.id);

        if (error) throw error;
        toast.success('Color updated successfully');
      } else {
        const { error } = await supabase
          .from('common_colors')
          .insert([{ name: formData.name, hex_code: formData.hex_code }]);

        if (error) throw error;
        toast.success('Color created successfully');
      }

      setIsDialogOpen(false);
      setEditingColor(null);
      setFormData({ name: '', hex_code: '#000000' });
      fetchColors();
    } catch (error: any) {
      console.error('Error saving color:', error);
      toast.error(error.message || 'Failed to save color');
    }
  };

  const handleEdit = (color: CommonColor) => {
    setEditingColor(color);
    setFormData({ name: color.name, hex_code: color.hex_code });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this color?')) return;

    try {
      const { error } = await supabase
        .from('common_colors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Color deleted successfully');
      fetchColors();
    } catch (error: any) {
      console.error('Error deleting color:', error);
      toast.error(error.message || 'Failed to delete color');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Common Colors</h1>
            <p className="text-muted-foreground">
              Manage frequently used colors for product variants
            </p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingColor(null);
                setFormData({ name: '', hex_code: '#000000' });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Color
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingColor ? 'Edit Color' : 'Add New Color'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Color Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Navy Blue"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hex_code">Color</Label>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl border-2 border-border shadow-sm"
                      style={{ backgroundColor: formData.hex_code }}
                    />
                    <div className="flex-1 space-y-2">
                      <Input
                        id="hex_code"
                        type="color"
                        value={formData.hex_code}
                        onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                        className="w-full h-12 cursor-pointer"
                      />
                      <Input
                        value={formData.hex_code}
                        onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                        placeholder="#000000"
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingColor ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Color</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Hex Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : colors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No colors found. Add your first color!
                  </TableCell>
                </TableRow>
              ) : (
                colors.map((color) => (
                  <TableRow key={color.id}>
                    <TableCell>
                      <div
                        className="w-10 h-10 rounded-lg border border-border shadow-sm"
                        style={{ backgroundColor: color.hex_code }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{color.name}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {color.hex_code}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(color)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(color.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};
