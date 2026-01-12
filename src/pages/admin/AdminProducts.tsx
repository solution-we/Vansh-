import { useEffect, useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Pencil, Trash2, Search, Upload, Link, Image, Store } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/useCategories';
import { Separator } from '@/components/ui/separator';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  category: string;
  section: string;
  sub_type: string | null;
  image: string;
  is_new: boolean;
  created_at: string;
  flipkart_link: string | null;
  amazon_link: string | null;
  meesho_link: string | null;
  vanshe_link: string | null;
  amazon_enabled: boolean;
  flipkart_enabled: boolean;
  meesho_enabled: boolean;
  vanshe_enabled: boolean;
}

const initialFormState = {
  name: '',
  price: '',
  original_price: '',
  category: '',
  section: '',
  sub_type: '',
  image: '',
  is_new: false,
  flipkart_link: '',
  amazon_link: '',
  meesho_link: '',
  vanshe_link: '',
  amazon_enabled: true,
  flipkart_enabled: true,
  meesho_enabled: true,
  vanshe_enabled: true,
};

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const { categories, refetch: refetchCategories } = useCategories(formData.section || undefined);
  
  // Image upload states
  const [imageTab, setImageTab] = useState<string>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchExistingImages();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data || []).map(p => ({
        ...p,
        amazon_enabled: p.amazon_enabled ?? true,
        flipkart_enabled: p.flipkart_enabled ?? true,
        meesho_enabled: p.meesho_enabled ?? true,
        vanshe_enabled: p.vanshe_enabled ?? true,
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingImages = async () => {
    try {
      const { data: productData } = await supabase
        .from('products')
        .select('image')
        .not('image', 'is', null);
      
      const { data: galleryData } = await supabase
        .from('product_images')
        .select('image_url');
      
      const productImages = (productData || []).map(p => p.image).filter(Boolean);
      const galleryImages = (galleryData || []).map(p => p.image_url).filter(Boolean);
      
      const allImages = [...new Set([...productImages, ...galleryImages])];
      setExistingImages(allImages);
    } catch (error) {
      console.error('Error fetching existing images:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${filePath}`;
    
    return publicUrl;
  };

  const selectExistingImage = (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl });
    setPreviewUrl(imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.image;
      
      if (selectedFile && imageTab === 'upload') {
        imageUrl = await uploadFile(selectedFile);
      }
      
      if (!imageUrl) {
        toast.error('Please provide an image');
        setUploading(false);
        return;
      }
      
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        category: formData.category,
        section: formData.section,
        sub_type: formData.sub_type || null,
        image: imageUrl,
        is_new: formData.is_new,
        flipkart_link: formData.flipkart_link || null,
        amazon_link: formData.amazon_link || null,
        meesho_link: formData.meesho_link || null,
        vanshe_link: formData.vanshe_link || null,
        amazon_enabled: formData.amazon_enabled,
        flipkart_enabled: formData.flipkart_enabled,
        meesho_enabled: formData.meesho_enabled,
        vanshe_enabled: formData.vanshe_enabled,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast.success('Product created successfully');
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData(initialFormState);
      setSelectedFile(null);
      setPreviewUrl('');
      setImageTab('url');
      fetchProducts();
      fetchExistingImages();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      category: product.category,
      section: product.section,
      sub_type: product.sub_type || '',
      image: product.image,
      is_new: product.is_new || false,
      flipkart_link: product.flipkart_link || '',
      amazon_link: product.amazon_link || '',
      meesho_link: product.meesho_link || '',
      vanshe_link: product.vanshe_link || '',
      amazon_enabled: product.amazon_enabled,
      flipkart_enabled: product.flipkart_enabled,
      meesho_enabled: product.meesho_enabled,
      vanshe_enabled: product.vanshe_enabled,
    });
    setPreviewUrl(product.image);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingProduct(null);
              setFormData(initialFormState);
              setPreviewUrl('');
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Basic Info</h3>
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="original_price">Original Price (₹)</Label>
                      <Input
                        id="original_price"
                        type="number"
                        value={formData.original_price}
                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Select
                        value={formData.section}
                        onValueChange={(value) => {
                          setFormData({ ...formData, section: value, category: '' });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                          <SelectItem value="kids">Kids</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        disabled={!formData.section}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={formData.section ? "Select category" : "Select section first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.display_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sub_type">Sub Type (optional)</Label>
                    <Input
                      id="sub_type"
                      value={formData.sub_type}
                      onChange={(e) => setFormData({ ...formData, sub_type: e.target.value })}
                      placeholder="e.g., casual, formal"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_new"
                      checked={formData.is_new}
                      onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="is_new">Mark as New Arrival</Label>
                  </div>
                </div>

                <Separator />

                {/* Image Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Product Image</h3>
                  <Tabs value={imageTab} onValueChange={setImageTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="url" className="flex items-center gap-1">
                        <Link className="h-3 w-3" />
                        URL
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="flex items-center gap-1">
                        <Upload className="h-3 w-3" />
                        Upload
                      </TabsTrigger>
                      <TabsTrigger value="gallery" className="flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        Gallery
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="url" className="space-y-2">
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value });
                          setPreviewUrl(e.target.value);
                        }}
                        placeholder="https://..."
                      />
                    </TabsContent>
                    
                    <TabsContent value="upload" className="space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedFile ? selectedFile.name : 'Choose Image'}
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="gallery" className="space-y-2">
                      <ScrollArea className="h-32 border rounded-md p-2">
                        <div className="grid grid-cols-4 gap-2">
                          {existingImages.map((img, idx) => (
                            <div
                              key={idx}
                              className={`cursor-pointer border-2 rounded overflow-hidden ${
                                formData.image === img ? 'border-primary' : 'border-transparent'
                              }`}
                              onClick={() => selectExistingImage(img)}
                            >
                              <img
                                src={img}
                                alt={`Gallery ${idx}`}
                                className="w-full h-12 object-cover"
                              />
                            </div>
                          ))}
                          {existingImages.length === 0 && (
                            <p className="col-span-4 text-sm text-muted-foreground text-center py-4">
                              No images available
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                  
                  {(previewUrl || formData.image) && (
                    <div className="mt-2">
                      <img
                        src={previewUrl || formData.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Platform Links Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Buying Platforms</h3>
                  </div>
                  
                  {/* Amazon */}
                  <div className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Amazon</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Enabled</span>
                        <Switch
                          checked={formData.amazon_enabled}
                          onCheckedChange={(checked) => setFormData({ ...formData, amazon_enabled: checked })}
                        />
                      </div>
                    </div>
                    <Input
                      value={formData.amazon_link}
                      onChange={(e) => setFormData({ ...formData, amazon_link: e.target.value })}
                      placeholder="https://amazon.in/dp/..."
                      disabled={!formData.amazon_enabled}
                    />
                  </div>

                  {/* Flipkart */}
                  <div className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Flipkart</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Enabled</span>
                        <Switch
                          checked={formData.flipkart_enabled}
                          onCheckedChange={(checked) => setFormData({ ...formData, flipkart_enabled: checked })}
                        />
                      </div>
                    </div>
                    <Input
                      value={formData.flipkart_link}
                      onChange={(e) => setFormData({ ...formData, flipkart_link: e.target.value })}
                      placeholder="https://flipkart.com/..."
                      disabled={!formData.flipkart_enabled}
                    />
                  </div>

                  {/* Meesho */}
                  <div className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Meesho</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Enabled</span>
                        <Switch
                          checked={formData.meesho_enabled}
                          onCheckedChange={(checked) => setFormData({ ...formData, meesho_enabled: checked })}
                        />
                      </div>
                    </div>
                    <Input
                      value={formData.meesho_link}
                      onChange={(e) => setFormData({ ...formData, meesho_link: e.target.value })}
                      placeholder="https://meesho.com/..."
                      disabled={!formData.meesho_enabled}
                    />
                  </div>

                  {/* Vanshé */}
                  <div className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">VANSHÉ Store</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Enabled</span>
                        <Switch
                          checked={formData.vanshe_enabled}
                          onCheckedChange={(checked) => setFormData({ ...formData, vanshe_enabled: checked })}
                        />
                      </div>
                    </div>
                    <Input
                      value={formData.vanshe_link}
                      onChange={(e) => setFormData({ ...formData, vanshe_link: e.target.value })}
                      placeholder="https://vanshe.com/product/..."
                      disabled={!formData.vanshe_enabled}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Products Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      ₹{product.price}
                      {product.original_price && (
                        <span className="text-muted-foreground line-through ml-2 text-sm">
                          ₹{product.original_price}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{product.section}</TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.amazon_enabled && <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">A</span>}
                        {product.flipkart_enabled && <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">F</span>}
                        {product.meesho_enabled && <span className="text-xs px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded">M</span>}
                        {product.vanshe_enabled && <span className="text-xs px-1.5 py-0.5 bg-foreground/10 text-foreground rounded">V</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.is_new && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          New
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
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
