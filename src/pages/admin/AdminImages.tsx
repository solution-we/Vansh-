import { useEffect, useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Plus, Trash2, Star, Search, Upload, Link, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAllSiteImages } from '@/hooks/useSiteImages';
import { useAllCategories, CategoryData } from '@/hooks/useCategories';

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  color_hex: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  color: string | null;
  is_common: boolean;
  products?: { name: string };
}

const initialFormState = {
  product_id: '',
  image_url: '',
  alt_text: '',
  display_order: '0',
  is_primary: false,
  color: '',
  is_common: false,
};

export const AdminImages = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [uploadType, setUploadType] = useState<'url' | 'file'>('file');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Thumbnail editing
  const [thumbnailDialogOpen, setThumbnailDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailUploadType, setThumbnailUploadType] = useState<'url' | 'file'>('file');
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Site images
  const { images: siteImages, loading: siteImagesLoading, refetch: refetchSiteImages, updateImage: updateSiteImage } = useAllSiteImages();
  const [siteImageDialogOpen, setSiteImageDialogOpen] = useState(false);
  const [selectedSiteImage, setSelectedSiteImage] = useState<any>(null);
  const [siteImageFile, setSiteImageFile] = useState<File | null>(null);
  const [siteImagePreview, setSiteImagePreview] = useState<string | null>(null);
  const [siteImageUrl, setSiteImageUrl] = useState('');
  const [siteImageUploadType, setSiteImageUploadType] = useState<'url' | 'file'>('file');
  const siteImageInputRef = useRef<HTMLInputElement>(null);
  const [siteImageFilter, setSiteImageFilter] = useState<string>('all');

  // Category thumbnails
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useAllCategories();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState('');
  const [categoryUploadType, setCategoryUploadType] = useState<'url' | 'file'>('file');
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchImages();
    fetchProducts();
    fetchVariants();
  }, []);

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
        .select('id, name, image')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchVariants = async () => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('id, product_id, color, color_hex')
        .order('color');

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  // Get unique colors for selected product
  const getColorsForProduct = (productId: string) => {
    const productVariants = variants.filter(v => v.product_id === productId);
    const uniqueColors = new Map<string, string>();
    productVariants.forEach(v => {
      if (!uniqueColors.has(v.color)) {
        uniqueColors.set(v.color, v.color_hex);
      }
    });
    return Array.from(uniqueColors.entries()).map(([color, hex]) => ({ color, hex }));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Generate the public URL using the correct Supabase URL format
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${filePath}`;
    
    console.log('Uploaded file, public URL:', publicUrl);
    return publicUrl;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleThumbnailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleSiteImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSiteImageFile(file);
      const url = URL.createObjectURL(file);
      setSiteImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      if (uploadType === 'file' && selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }

      if (!imageUrl) {
        toast.error('Please provide an image');
        setUploading(false);
        return;
      }

      const imageData = {
        product_id: formData.product_id,
        image_url: imageUrl,
        alt_text: formData.alt_text || null,
        display_order: parseInt(formData.display_order),
        is_primary: formData.is_primary,
        color: formData.is_common ? null : (formData.color || null),
        is_common: formData.is_common,
      };

      const { error } = await supabase
        .from('product_images')
        .insert([imageData]);

      if (error) throw error;
      toast.success('Image added successfully');

      setIsDialogOpen(false);
      resetForm();
      fetchImages();
    } catch (error: any) {
      console.error('Error saving image:', error);
      toast.error(error.message || 'Failed to save image');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadType('file');
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

  const handleSetPrimary = async (id: string, productId: string) => {
    try {
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      const { error } = await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', id);

      if (error) throw error;
      toast.success('Primary image updated');
      fetchImages();
    } catch (error: any) {
      console.error('Error setting primary image:', error);
      toast.error(error.message || 'Failed to update primary image');
    }
  };

  const openThumbnailDialog = (product: Product) => {
    setSelectedProduct(product);
    setThumbnailUrl(product.image);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setThumbnailUploadType('file');
    setThumbnailDialogOpen(true);
  };

  const handleUpdateThumbnail = async () => {
    if (!selectedProduct) return;
    setUploading(true);

    try {
      let newImageUrl = thumbnailUrl;

      if (thumbnailUploadType === 'file' && thumbnailFile) {
        newImageUrl = await uploadFile(thumbnailFile);
      }

      if (!newImageUrl) {
        toast.error('Please provide an image');
        setUploading(false);
        return;
      }

      const { error } = await supabase
        .from('products')
        .update({ image: newImageUrl })
        .eq('id', selectedProduct.id);

      if (error) throw error;
      toast.success('Product thumbnail updated');
      setThumbnailDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      console.error('Error updating thumbnail:', error);
      toast.error(error.message || 'Failed to update thumbnail');
    } finally {
      setUploading(false);
    }
  };

  // Site image handlers
  const openSiteImageDialog = (siteImage: any) => {
    setSelectedSiteImage(siteImage);
    setSiteImageUrl(siteImage.image_url || '');
    setSiteImageFile(null);
    setSiteImagePreview(null);
    setSiteImageUploadType('file');
    setSiteImageDialogOpen(true);
  };

  const handleUpdateSiteImage = async () => {
    if (!selectedSiteImage) return;
    setUploading(true);

    try {
      let newImageUrl = siteImageUrl;

      if (siteImageUploadType === 'file' && siteImageFile) {
        newImageUrl = await uploadFile(siteImageFile);
      }

      if (!newImageUrl) {
        toast.error('Please provide an image');
        setUploading(false);
        return;
      }

      await updateSiteImage(selectedSiteImage.id, newImageUrl);
      toast.success('Site image updated');
      setSiteImageDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating site image:', error);
      toast.error(error.message || 'Failed to update site image');
    } finally {
      setUploading(false);
    }
  };

  // Category thumbnail handlers
  const handleCategoryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImageFile(file);
      const url = URL.createObjectURL(file);
      setCategoryImagePreview(url);
    }
  };

  const openCategoryDialog = (category: CategoryData) => {
    setSelectedCategory(category);
    setCategoryImageUrl(category.thumbnail_url || '');
    setCategoryImageFile(null);
    setCategoryImagePreview(null);
    setCategoryUploadType('file');
    setCategoryDialogOpen(true);
  };

  const handleUpdateCategoryThumbnail = async () => {
    if (!selectedCategory) return;
    setUploading(true);

    try {
      let newImageUrl = categoryImageUrl;

      if (categoryUploadType === 'file' && categoryImageFile) {
        newImageUrl = await uploadFile(categoryImageFile);
      }

      if (!newImageUrl) {
        toast.error('Please provide an image');
        setUploading(false);
        return;
      }

      // Update the category thumbnail
      const { error } = await supabase
        .from('categories')
        .update({ thumbnail_url: newImageUrl })
        .eq('id', selectedCategory.id);

      if (error) throw error;

      // Also update site_images if exists
      const imageKey = `category_${selectedCategory.section}_${selectedCategory.name}`;
      await supabase
        .from('site_images')
        .update({ image_url: newImageUrl })
        .eq('image_key', imageKey);

      toast.success('Category thumbnail updated');
      setCategoryDialogOpen(false);
      refetchCategories();
    } catch (error: any) {
      console.error('Error updating category thumbnail:', error);
      toast.error(error.message || 'Failed to update thumbnail');
    } finally {
      setUploading(false);
    }
  };

  // Sync categories to site_images
  const syncCategoriesToSiteImages = async () => {
    setSyncing(true);
    try {
      for (const category of categories) {
        const imageKey = `category_${category.section}_${category.name}`;
        
        // Check if already exists
        const { data: existing } = await supabase
          .from('site_images')
          .select('id')
          .eq('image_key', imageKey)
          .maybeSingle();

        if (!existing) {
          await supabase
            .from('site_images')
            .insert([{
              image_key: imageKey,
              image_url: category.thumbnail_url,
              description: `${category.display_name} category thumbnail for ${category.section}`,
              page: category.section,
              image_type: 'category_thumbnail',
              section: category.section,
              category: category.name,
            }]);
        }
      }
      toast.success('Categories synced to site images');
      refetchSiteImages();
    } catch (error: any) {
      console.error('Error syncing categories:', error);
      toast.error('Failed to sync categories');
    } finally {
      setSyncing(false);
    }
  };

  // Group categories by section
  const categoriesBySection = categories.reduce((acc, cat) => {
    if (!acc[cat.section]) {
      acc[cat.section] = [];
    }
    acc[cat.section].push(cat);
    return acc;
  }, {} as Record<string, CategoryData[]>);

  const SECTION_ORDER = ['men', 'women', 'kids'];
  const SECTION_LABELS_MAP: Record<string, string> = {
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
  };

  const filteredImages = images.filter(image =>
    image.products?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedImages = filteredImages.reduce((acc, image) => {
    const productName = image.products?.name || 'Unknown Product';
    if (!acc[productName]) {
      acc[productName] = [];
    }
    acc[productName].push(image);
    return acc;
  }, {} as Record<string, ProductImage[]>);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group site images by page
  const groupedSiteImages = siteImages.reduce((acc, img) => {
    const page = img.page;
    if (!acc[page]) {
      acc[page] = [];
    }
    acc[page].push(img);
    return acc;
  }, {} as Record<string, typeof siteImages>);

  const filteredSiteImages = siteImageFilter === 'all' 
    ? groupedSiteImages 
    : { [siteImageFilter]: groupedSiteImages[siteImageFilter] || [] };

  const PAGE_LABELS: Record<string, string> = {
    home: 'Home Page',
    men: 'Men Page',
    women: 'Women Page',
    kids: 'Kids Page',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Image Management</h1>
            <p className="text-muted-foreground">Manage site images, product thumbnails, and gallery images</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Gallery Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Product Image</DialogTitle>
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

                {/* Upload Type Toggle */}
                <div className="space-y-2">
                  <Label>Image Source</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={uploadType === 'file' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadType('file')}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    <Button
                      type="button"
                      variant={uploadType === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadType('url')}
                      className="flex-1"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      URL
                    </Button>
                  </div>
                </div>

                {uploadType === 'file' ? (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded" />
                      ) : (
                        <div className="text-muted-foreground">
                          <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Click to select image from gallery</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="alt_text">Alt Text (optional)</Label>
                  <Input
                    id="alt_text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                    placeholder="Image description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_common"
                    checked={formData.is_common}
                    onChange={(e) => setFormData({ ...formData, is_common: e.target.checked, color: '' })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_common">Common image (applies to all colors)</Label>
                </div>
                {!formData.is_common && formData.product_id && (
                  <div className="space-y-2">
                    <Label htmlFor="color">Assign to Color (optional)</Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) => setFormData({ ...formData, color: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {getColorsForProduct(formData.product_id).map((colorItem) => (
                          <SelectItem key={colorItem.color} value={colorItem.color}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: colorItem.hex }}
                              />
                              {colorItem.color}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getColorsForProduct(formData.product_id).length === 0 && (
                      <p className="text-xs text-muted-foreground">No color variants found. Add variants first.</p>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_primary"
                    checked={formData.is_primary}
                    onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_primary">Set as primary image</Label>
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Add Image'}
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

        {/* Tabs for Site Images, Categories, Thumbnails, and Gallery */}
        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Category Thumbnails</TabsTrigger>
            <TabsTrigger value="site">Site Images</TabsTrigger>
            <TabsTrigger value="thumbnails">Product Thumbnails</TabsTrigger>
            <TabsTrigger value="gallery">Gallery Images</TabsTrigger>
          </TabsList>

          {/* Category Thumbnails Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Manage category thumbnails for Men, Women, and Kids sections
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={syncCategoriesToSiteImages}
                disabled={syncing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                Sync to Site Images
              </Button>
            </div>

            {categoriesLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : categories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  No categories found. Add categories in the Categories page first.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {SECTION_ORDER.map((section) => {
                  const sectionCategories = categoriesBySection[section] || [];
                  if (sectionCategories.length === 0) return null;
                  
                  return (
                    <Card key={section}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{SECTION_LABELS_MAP[section]}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {sectionCategories.length} categories • Click to change thumbnail
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                          {sectionCategories.map((category) => (
                            <div
                              key={category.id}
                              className="group relative border rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                              onClick={() => openCategoryDialog(category)}
                            >
                              <div className="aspect-square">
                                {category.thumbnail_url ? (
                                  <img
                                    src={category.thumbnail_url}
                                    alt={category.display_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                                    <ImageIcon className="h-8 w-8 opacity-50" />
                                  </div>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-sm font-medium">Change</span>
                              </div>
                              <div className="p-2">
                                <p className="text-sm font-medium truncate">{category.display_name}</p>
                                <p className="text-[10px] text-muted-foreground capitalize">{category.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Site Images Tab */}
          <TabsContent value="site" className="space-y-4">
            <div className="flex items-center gap-4">
              <Label>Filter by Page:</Label>
              <Select value={siteImageFilter} onValueChange={setSiteImageFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="home">Home Page</SelectItem>
                  <SelectItem value="men">Men Page</SelectItem>
                  <SelectItem value="women">Women Page</SelectItem>
                  <SelectItem value="kids">Kids Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {siteImagesLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-6">
                {Object.entries(filteredSiteImages).map(([page, pageImages]) => (
                  <Card key={page}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{PAGE_LABELS[page] || page}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {pageImages.length} images • Click to change
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        {pageImages.map((siteImg) => (
                          <div
                            key={siteImg.id}
                            className="group relative border rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                            onClick={() => openSiteImageDialog(siteImg)}
                          >
                            <div className="aspect-square">
                              {siteImg.image_url ? (
                                <img
                                  src={siteImg.image_url}
                                  alt={siteImg.description || ''}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground text-center p-2">
                                  <span className="text-[10px] uppercase tracking-wider">
                                    {siteImg.description || siteImg.image_key}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Change</span>
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-medium truncate">{siteImg.description}</p>
                              <p className="text-[10px] text-muted-foreground capitalize">{siteImg.image_type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Thumbnails Tab */}
          <TabsContent value="thumbnails" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Thumbnails</CardTitle>
                <p className="text-sm text-muted-foreground">Main image shown in product listings</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No products found</div>
                ) : (
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="group relative border rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => openThumbnailDialog(product)}
                      >
                        <div className="aspect-square">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Change</span>
                        </div>
                        <div className="p-2">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : Object.keys(groupedImages).length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  No gallery images found. Click "Add Gallery Image" to add images.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedImages).map(([productName, productImages]) => (
                  <Card key={productName}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{productName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{productImages.length} images</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                        {productImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square rounded overflow-hidden border">
                              <img
                                src={image.image_url}
                                alt={image.alt_text || productName}
                                className="w-full h-full object-cover"
                              />
                              {image.is_primary && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-medium">
                                  Primary
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {!image.is_primary && (
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                    onClick={() => handleSetPrimary(image.id, image.product_id)}
                                  >
                                    <Star className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => handleDelete(image.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 space-y-0.5">
                              <p className="text-xs text-muted-foreground">Order: {image.display_order}</p>
                              {image.is_common ? (
                                <span className="inline-block text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                  All Colors
                                </span>
                              ) : image.color ? (
                                <span className="inline-block text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                                  {image.color}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Thumbnail Edit Dialog */}
        <Dialog open={thumbnailDialogOpen} onOpenChange={setThumbnailDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Change Thumbnail: {selectedProduct?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Current thumbnail */}
              <div className="space-y-2">
                <Label>Current Thumbnail</Label>
                <img
                  src={selectedProduct?.image}
                  alt={selectedProduct?.name}
                  className="w-full max-h-40 object-contain rounded border"
                />
              </div>

              {/* Upload Type Toggle */}
              <div className="space-y-2">
                <Label>New Image Source</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={thumbnailUploadType === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setThumbnailUploadType('file')}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={thumbnailUploadType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setThumbnailUploadType('url')}
                    className="flex-1"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    URL
                  </Button>
                </div>
              </div>

              {thumbnailUploadType === 'file' ? (
                <div className="space-y-2">
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailFileSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Preview" className="max-h-40 mx-auto rounded" />
                    ) : (
                      <div className="text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Click to select image from gallery</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">Image URL</Label>
                  <Input
                    id="thumbnail_url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}

              <Button onClick={handleUpdateThumbnail} className="w-full" disabled={uploading}>
                {uploading ? 'Updating...' : 'Update Thumbnail'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Site Image Edit Dialog */}
        <Dialog open={siteImageDialogOpen} onOpenChange={setSiteImageDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Change Site Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{selectedSiteImage?.description}</p>
                <p className="text-xs text-muted-foreground">Page: {PAGE_LABELS[selectedSiteImage?.page] || selectedSiteImage?.page}</p>
              </div>

              {/* Current image */}
              <div className="space-y-2">
                <Label>Current Image</Label>
                {selectedSiteImage?.image_url ? (
                  <img
                    src={selectedSiteImage.image_url}
                    alt={selectedSiteImage.description}
                    className="w-full max-h-40 object-contain rounded border"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-secondary rounded border">
                    <span className="text-xs text-muted-foreground uppercase">No image set</span>
                  </div>
                )}
              </div>

              {/* Upload Type Toggle */}
              <div className="space-y-2">
                <Label>New Image Source</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={siteImageUploadType === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSiteImageUploadType('file')}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={siteImageUploadType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSiteImageUploadType('url')}
                    className="flex-1"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    URL
                  </Button>
                </div>
              </div>

              {siteImageUploadType === 'file' ? (
                <div className="space-y-2">
                  <input
                    ref={siteImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSiteImageFileSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => siteImageInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {siteImagePreview ? (
                      <img src={siteImagePreview} alt="Preview" className="max-h-40 mx-auto rounded" />
                    ) : (
                      <div className="text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Click to select image from gallery</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="site_image_url">Image URL</Label>
                  <Input
                    id="site_image_url"
                    value={siteImageUrl}
                    onChange={(e) => setSiteImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}

              <Button onClick={handleUpdateSiteImage} className="w-full" disabled={uploading}>
                {uploading ? 'Updating...' : 'Update Image'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Category Thumbnail Edit Dialog */}
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Change Thumbnail: {selectedCategory?.display_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground capitalize">Section: {selectedCategory?.section}</p>
              </div>

              {/* Current thumbnail */}
              <div className="space-y-2">
                <Label>Current Thumbnail</Label>
                {selectedCategory?.thumbnail_url ? (
                  <img
                    src={selectedCategory.thumbnail_url}
                    alt={selectedCategory.display_name}
                    className="w-full max-h-40 object-contain rounded border"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-secondary rounded border">
                    <span className="text-xs text-muted-foreground uppercase">No image set</span>
                  </div>
                )}
              </div>

              {/* Upload Type Toggle */}
              <div className="space-y-2">
                <Label>New Image Source</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={categoryUploadType === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryUploadType('file')}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={categoryUploadType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryUploadType('url')}
                    className="flex-1"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    URL
                  </Button>
                </div>
              </div>

              {categoryUploadType === 'file' ? (
                <div className="space-y-2">
                  <input
                    ref={categoryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryFileSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => categoryInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {categoryImagePreview ? (
                      <img src={categoryImagePreview} alt="Preview" className="max-h-40 mx-auto rounded" />
                    ) : (
                      <div className="text-muted-foreground">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Click to select image from gallery</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="category_image_url">Image URL</Label>
                  <Input
                    id="category_image_url"
                    value={categoryImageUrl}
                    onChange={(e) => setCategoryImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}

              <Button onClick={handleUpdateCategoryThumbnail} className="w-full" disabled={uploading}>
                {uploading ? 'Updating...' : 'Update Thumbnail'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};
