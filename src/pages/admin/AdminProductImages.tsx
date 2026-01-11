import { useEffect, useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Plus, Pencil, Trash2, Search, Upload, Link, Image, Images } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  color: string | null;
  is_primary: boolean;
  is_common: boolean;
  display_order: number;
  alt_text: string | null;
  products?: { name: string };
}

interface ProductVariant {
  color: string;
  color_hex: string | null;
}

const initialFormState = {
  product_id: '',
  image_url: '',
  color: '',
  is_primary: false,
  is_common: false,
  display_order: 0,
  alt_text: '',
};

export const AdminProductImages = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [productColors, setProductColors] = useState<ProductVariant[]>([]);
  
  // Image upload states
  const [imageTab, setImageTab] = useState<string>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  
  // Bulk upload states
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [bulkProductId, setBulkProductId] = useState('');
  const [bulkColor, setBulkColor] = useState('');
  const [bulkIsCommon, setBulkIsCommon] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchImages();
    fetchProducts();
    fetchExistingImages();
  }, []);

  useEffect(() => {
    if (formData.product_id) {
      fetchProductColors(formData.product_id);
    } else {
      setProductColors([]);
    }
  }, [formData.product_id]);

  useEffect(() => {
    if (bulkProductId) {
      fetchProductColors(bulkProductId);
    }
  }, [bulkProductId]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*, products(name)')
        .order('product_id')
        .order('display_order');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
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

  const fetchProductColors = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('color, color_hex')
        .eq('product_id', productId);

      if (error) throw error;
      
      // Get unique colors
      const uniqueColors = Array.from(
        new Map((data || []).map(item => [item.color, item])).values()
      );
      setProductColors(uniqueColors);
    } catch (error) {
      console.error('Error fetching product colors:', error);
    }
  };

  const fetchExistingImages = async () => {
    try {
      const { data } = await supabase
        .from('product_images')
        .select('image_url');
      
      const urls = (data || []).map(p => p.image_url).filter(Boolean);
      setExistingImages([...new Set(urls)]);
    } catch (error) {
      console.error('Error fetching existing images:', error);
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
    return `${supabaseUrl}/storage/v1/object/public/product-images/${filePath}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles([files[0]]);
    }
  };

  const handleBulkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setBulkFiles(Array.from(files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.image_url;
      
      if (selectedFiles.length > 0 && imageTab === 'upload') {
        imageUrl = await uploadFile(selectedFiles[0]);
      }
      
      if (!imageUrl) {
        toast.error('Please provide an image');
        setUploading(false);
        return;
      }
      
      const imageData = {
        product_id: formData.product_id,
        image_url: imageUrl,
        color: formData.color || null,
        is_primary: formData.is_primary,
        is_common: formData.is_common,
        display_order: formData.display_order,
        alt_text: formData.alt_text || null,
      };

      if (editingImage) {
        const { error } = await supabase
          .from('product_images')
          .update(imageData)
          .eq('id', editingImage.id);

        if (error) throw error;
        toast.success('Image updated successfully');
      } else {
        const { error } = await supabase
          .from('product_images')
          .insert([imageData]);

        if (error) throw error;
        toast.success('Image added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchImages();
      fetchExistingImages();
    } catch (error: any) {
      console.error('Error saving image:', error);
      toast.error(error.message || 'Failed to save image');
    } finally {
      setUploading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkProductId || bulkFiles.length === 0) {
      toast.error('Please select a product and at least one image');
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = bulkFiles.map(async (file, index) => {
        const imageUrl = await uploadFile(file);
        return {
          product_id: bulkProductId,
          image_url: imageUrl,
          color: bulkIsCommon ? null : (bulkColor || null),
          is_primary: index === 0 && !bulkIsCommon,
          is_common: bulkIsCommon,
          display_order: index,
          alt_text: null,
        };
      });

      const imageDataArray = await Promise.all(uploadPromises);
      
      const { error } = await supabase
        .from('product_images')
        .insert(imageDataArray);

      if (error) throw error;
      
      toast.success(`${bulkFiles.length} images uploaded successfully`);
      setIsBulkDialogOpen(false);
      setBulkProductId('');
      setBulkColor('');
      setBulkIsCommon(false);
      setBulkFiles([]);
      fetchImages();
      fetchExistingImages();
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingImage(null);
    setFormData(initialFormState);
    setSelectedFiles([]);
    setImageTab('upload');
    setProductColors([]);
  };

  const handleEdit = (image: ProductImage) => {
    setEditingImage(image);
    setFormData({
      product_id: image.product_id,
      image_url: image.image_url,
      color: image.color || '',
      is_primary: image.is_primary || false,
      is_common: image.is_common || false,
      display_order: image.display_order || 0,
      alt_text: image.alt_text || '',
    });
    setImageTab('url');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(error.message || 'Failed to delete image');
    }
  };

  const filteredImages = images.filter(image =>
    image.products?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.color?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group images by product
  const groupedImages = filteredImages.reduce((acc, image) => {
    const productName = image.products?.name || 'Unknown Product';
    if (!acc[productName]) {
      acc[productName] = [];
    }
    acc[productName].push(image);
    return acc;
  }, {} as Record<string, ProductImage[]>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Images</h1>
            <p className="text-muted-foreground">Manage multiple images per product with color associations</p>
          </div>
          <div className="flex gap-2">
            {/* Bulk Upload Dialog */}
            <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Images className="h-4 w-4 mr-2" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Bulk Upload Images</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={bulkProductId} onValueChange={setBulkProductId}>
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

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="bulk_is_common"
                      checked={bulkIsCommon}
                      onCheckedChange={(checked) => setBulkIsCommon(checked as boolean)}
                    />
                    <Label htmlFor="bulk_is_common">Mark all as common images (for all colors)</Label>
                  </div>

                  {!bulkIsCommon && productColors.length > 0 && (
                    <div className="space-y-2">
                      <Label>Color (for variant-specific images)</Label>
                      <Select value={bulkColor} onValueChange={setBulkColor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {productColors.map((variant) => (
                            <SelectItem key={variant.color} value={variant.color}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: variant.color_hex || '#ccc' }}
                                />
                                {variant.color}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Select Images</Label>
                    <input
                      type="file"
                      ref={multiFileInputRef}
                      onChange={handleBulkFileSelect}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => multiFileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {bulkFiles.length > 0 ? `${bulkFiles.length} files selected` : 'Choose Images'}
                    </Button>
                    {bulkFiles.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {bulkFiles.map(f => f.name).join(', ')}
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleBulkUpload} 
                    disabled={uploading || !bulkProductId || bulkFiles.length === 0}
                    className="w-full"
                  >
                    {uploading ? 'Uploading...' : `Upload ${bulkFiles.length} Images`}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Single Image Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingImage ? 'Edit Image' : 'Add New Image'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select 
                      value={formData.product_id} 
                      onValueChange={(value) => setFormData({ ...formData, product_id: value, color: '' })}
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

                  <div className="space-y-2">
                    <Label>Image</Label>
                    <Tabs value={imageTab} onValueChange={setImageTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upload">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </TabsTrigger>
                        <TabsTrigger value="url">
                          <Link className="h-3 w-3 mr-1" />
                          URL
                        </TabsTrigger>
                        <TabsTrigger value="gallery">
                          <Image className="h-3 w-3 mr-1" />
                          Gallery
                        </TabsTrigger>
                      </TabsList>
                      
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
                          {selectedFiles.length > 0 ? selectedFiles[0].name : 'Choose Image'}
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="url" className="space-y-2">
                        <Input
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="https://..."
                        />
                      </TabsContent>
                      
                      <TabsContent value="gallery" className="space-y-2">
                        <ScrollArea className="h-32 border rounded-md p-2">
                          <div className="grid grid-cols-4 gap-2">
                            {existingImages.map((img, idx) => (
                              <div
                                key={idx}
                                className={`cursor-pointer border-2 rounded overflow-hidden ${
                                  formData.image_url === img ? 'border-primary' : 'border-transparent'
                                }`}
                                onClick={() => setFormData({ ...formData, image_url: img })}
                              >
                                <img src={img} alt="" className="w-full h-12 object-cover" />
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="is_common"
                        checked={formData.is_common}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_common: checked as boolean, color: '' })}
                      />
                      <Label htmlFor="is_common">Common image (all colors)</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="is_primary"
                        checked={formData.is_primary}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_primary: checked as boolean })}
                      />
                      <Label htmlFor="is_primary">Primary image</Label>
                    </div>
                  </div>

                  {!formData.is_common && productColors.length > 0 && (
                    <div className="space-y-2">
                      <Label>Color (for variant-specific image)</Label>
                      <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {productColors.map((variant) => (
                            <SelectItem key={variant.color} value={variant.color}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: variant.color_hex || '#ccc' }}
                                />
                                {variant.color}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Display Order</Label>
                      <Input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alt Text</Label>
                      <Input
                        value={formData.alt_text}
                        onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                        placeholder="Image description"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={uploading} className="w-full">
                    {uploading ? 'Uploading...' : (editingImage ? 'Update Image' : 'Add Image')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product or color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Images Table - Grouped by Product */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Order</TableHead>
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
              ) : Object.keys(groupedImages).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No images found
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(groupedImages).map(([productName, productImages]) => (
                  productImages.map((image, idx) => (
                    <TableRow key={image.id} className={idx === 0 ? 'border-t-2' : ''}>
                      <TableCell>
                        <img
                          src={image.image_url}
                          alt={image.alt_text || 'Product image'}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {idx === 0 ? productName : ''}
                      </TableCell>
                      <TableCell>
                        {image.color ? (
                          <div className="flex items-center gap-2">
                            <span>{image.color}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {image.is_primary && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Primary</span>
                          )}
                          {image.is_common && (
                            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">Common</span>
                          )}
                          {!image.is_primary && !image.is_common && (
                            <span className="text-xs text-muted-foreground">Regular</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{image.display_order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(image)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};
