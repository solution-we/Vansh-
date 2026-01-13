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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Search, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCommonColors } from '@/hooks/useCommonColors';

interface Product {
  id: string;
  name: string;
}

interface Variant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  color_hex: string;
  stock: number;
  is_available: boolean;
  products?: { name: string };
}

const initialFormState = {
  product_id: '',
  size: '',
  color: '',
  color_hex: '#000000',
  stock: '0',
  is_available: true,
};

export const AdminVariants = () => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [colorMode, setColorMode] = useState<'common' | 'custom'>('common');
  const { colors: commonColors, loading: colorsLoading } = useCommonColors();

  useEffect(() => {
    fetchVariants();
    fetchProducts();
  }, []);

  const fetchVariants = async () => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*, products(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
      toast.error('Failed to load variants');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const variantData = {
      product_id: formData.product_id,
      size: formData.size,
      color: formData.color,
      color_hex: formData.color_hex,
      stock: parseInt(formData.stock),
      is_available: formData.is_available,
    };

    try {
      if (editingVariant) {
        const { error } = await supabase
          .from('product_variants')
          .update(variantData)
          .eq('id', editingVariant.id);

        if (error) throw error;
        toast.success('Variant updated successfully');
      } else {
        const { error } = await supabase
          .from('product_variants')
          .insert([variantData]);

        if (error) throw error;
        toast.success('Variant created successfully');
      }

      setIsDialogOpen(false);
      setEditingVariant(null);
      setFormData(initialFormState);
      fetchVariants();
    } catch (error: any) {
      console.error('Error saving variant:', error);
      toast.error(error.message || 'Failed to save variant');
    }
  };

  const handleEdit = (variant: Variant) => {
    setEditingVariant(variant);
    setFormData({
      product_id: variant.product_id,
      size: variant.size,
      color: variant.color,
      color_hex: variant.color_hex || '#000000',
      stock: variant.stock.toString(),
      is_available: variant.is_available,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;

    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Variant deleted successfully');
      fetchVariants();
    } catch (error: any) {
      console.error('Error deleting variant:', error);
      toast.error(error.message || 'Failed to delete variant');
    }
  };

  const filteredVariants = variants.filter(variant =>
    variant.products?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    variant.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
    variant.size.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Variants</h1>
            <p className="text-muted-foreground">Manage sizes, colors and stock</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingVariant(null);
              setFormData(initialFormState);
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingVariant ? 'Edit Variant' : 'Add New Variant'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="e.g., S, M, L, XL"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>
                {/* Color Selection */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <Label className="font-medium">Color</Label>
                  </div>
                  
                  <Tabs value={colorMode} onValueChange={(v) => setColorMode(v as 'common' | 'custom')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="common">Common Colors</TabsTrigger>
                      <TabsTrigger value="custom">Custom Color</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="common" className="space-y-3 mt-3">
                      {colorsLoading ? (
                        <p className="text-sm text-muted-foreground">Loading colors...</p>
                      ) : commonColors.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No common colors defined. Add them in Admin → Colors.</p>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {commonColors.map((cc) => (
                            <button
                              key={cc.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, color: cc.name, color_hex: cc.hex_code })}
                              className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                                formData.color === cc.name && formData.color_hex === cc.hex_code
                                  ? 'border-primary bg-primary/5'
                                  : 'border-transparent hover:border-muted-foreground/30'
                              }`}
                            >
                              <div
                                className="w-8 h-8 rounded-full border shadow-sm"
                                style={{ backgroundColor: cc.hex_code }}
                              />
                              <span className="text-xs text-center truncate w-full">{cc.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="custom" className="space-y-3 mt-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="color">Color Name</Label>
                          <Input
                            id="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            placeholder="e.g., Black, White"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="color_hex">Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="color_hex"
                              type="color"
                              value={formData.color_hex}
                              onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={formData.color_hex}
                              onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })}
                              placeholder="#000000"
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  {/* Selected Color Preview */}
                  {formData.color && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: formData.color_hex }}
                      />
                      <span className="text-sm font-medium">{formData.color}</span>
                      <span className="text-xs text-muted-foreground">{formData.color_hex}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_available">Available for purchase</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingVariant ? 'Update Variant' : 'Create Variant'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search variants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Variants Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredVariants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No variants found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVariants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">
                      {variant.products?.name || 'Unknown Product'}
                    </TableCell>
                    <TableCell>{variant.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: variant.color_hex }}
                        />
                        {variant.color}
                      </div>
                    </TableCell>
                    <TableCell>{variant.stock}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        variant.is_available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {variant.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(variant)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(variant.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
