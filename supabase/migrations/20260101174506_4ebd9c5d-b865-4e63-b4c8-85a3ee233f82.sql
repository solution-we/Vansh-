-- Create table for site-wide images (hero banners, category images, etc.)
CREATE TABLE public.site_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_key TEXT NOT NULL UNIQUE, -- e.g., 'home_men_model', 'men_hero', 'women_category_pants'
  image_url TEXT NOT NULL,
  description TEXT, -- Human-readable description
  page TEXT NOT NULL, -- 'home', 'men', 'women', 'kids'
  image_type TEXT NOT NULL, -- 'model', 'collection', 'category', 'hero'
  section TEXT, -- 'men', 'women', 'kids' (for category images)
  category TEXT, -- 'pants', 'shirt', etc. (for category images)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Site images are publicly readable" 
ON public.site_images 
FOR SELECT 
USING (true);

-- Admin management
CREATE POLICY "Admins can manage site images" 
ON public.site_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_site_images_updated_at
BEFORE UPDATE ON public.site_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default placeholder entries for all site images
INSERT INTO public.site_images (image_key, image_url, description, page, image_type, section, category) VALUES
-- Home page - Men section
('home_men_model', '', 'Home - Men Model Image', 'home', 'model', 'men', NULL),
('home_men_collection', '', 'Home - Men Collection Banner', 'home', 'collection', 'men', NULL),
('home_men_pants', '', 'Home - Men Pants Category', 'home', 'category', 'men', 'pants'),
('home_men_shirt', '', 'Home - Men Shirts Category', 'home', 'category', 'men', 'shirt'),
('home_men_tshirt', '', 'Home - Men T-Shirts Category', 'home', 'category', 'men', 't-shirt'),
('home_men_boots', '', 'Home - Men Boots Category', 'home', 'category', 'men', 'boots'),
('home_men_accessories', '', 'Home - Men Accessories Category', 'home', 'category', 'men', 'accessories'),
('home_men_perfumes', '', 'Home - Men Perfumes Category', 'home', 'category', 'men', 'perfumes'),
-- Home page - Women section
('home_women_model', '', 'Home - Women Model Image', 'home', 'model', 'women', NULL),
('home_women_collection', '', 'Home - Women Collection Banner', 'home', 'collection', 'women', NULL),
('home_women_pants', '', 'Home - Women Pants Category', 'home', 'category', 'women', 'pants'),
('home_women_shirt', '', 'Home - Women Shirts Category', 'home', 'category', 'women', 'shirt'),
('home_women_tshirt', '', 'Home - Women T-Shirts Category', 'home', 'category', 'women', 't-shirt'),
('home_women_boots', '', 'Home - Women Boots Category', 'home', 'category', 'women', 'boots'),
('home_women_accessories', '', 'Home - Women Accessories Category', 'home', 'category', 'women', 'accessories'),
('home_women_perfumes', '', 'Home - Women Perfumes Category', 'home', 'category', 'women', 'perfumes'),
-- Home page - Kids section
('home_kids_model', '', 'Home - Kids Model Image', 'home', 'model', 'kids', NULL),
('home_kids_collection', '', 'Home - Kids Collection Banner', 'home', 'collection', 'kids', NULL),
('home_kids_pants', '', 'Home - Kids Pants Category', 'home', 'category', 'kids', 'pants'),
('home_kids_shirt', '', 'Home - Kids Shirts Category', 'home', 'category', 'kids', 'shirt'),
('home_kids_tshirt', '', 'Home - Kids T-Shirts Category', 'home', 'category', 'kids', 't-shirt'),
('home_kids_boots', '', 'Home - Kids Boots Category', 'home', 'category', 'kids', 'boots'),
('home_kids_accessories', '', 'Home - Kids Accessories Category', 'home', 'category', 'kids', 'accessories'),
('home_kids_toys', '', 'Home - Kids Toys Category', 'home', 'category', 'kids', 'toys'),
-- Section pages - Men
('men_hero_model', '', 'Men Page - Hero Model Image', 'men', 'model', 'men', NULL),
('men_hero_collection', '', 'Men Page - Hero Collection Banner', 'men', 'collection', 'men', NULL),
('men_pants', '', 'Men Page - Pants Category', 'men', 'category', 'men', 'pants'),
('men_shirt', '', 'Men Page - Shirts Category', 'men', 'category', 'men', 'shirt'),
('men_tshirt', '', 'Men Page - T-Shirts Category', 'men', 'category', 'men', 't-shirt'),
('men_boots', '', 'Men Page - Boots Category', 'men', 'category', 'men', 'boots'),
('men_accessories', '', 'Men Page - Accessories Category', 'men', 'category', 'men', 'accessories'),
('men_perfumes', '', 'Men Page - Perfumes Category', 'men', 'category', 'men', 'perfumes'),
-- Section pages - Women
('women_hero_model', '', 'Women Page - Hero Model Image', 'women', 'model', 'women', NULL),
('women_hero_collection', '', 'Women Page - Hero Collection Banner', 'women', 'collection', 'women', NULL),
('women_pants', '', 'Women Page - Pants Category', 'women', 'category', 'women', 'pants'),
('women_shirt', '', 'Women Page - Shirts Category', 'women', 'category', 'women', 'shirt'),
('women_tshirt', '', 'Women Page - T-Shirts Category', 'women', 'category', 'women', 't-shirt'),
('women_boots', '', 'Women Page - Boots Category', 'women', 'category', 'women', 'boots'),
('women_accessories', '', 'Women Page - Accessories Category', 'women', 'category', 'women', 'accessories'),
('women_perfumes', '', 'Women Page - Perfumes Category', 'women', 'category', 'women', 'perfumes'),
-- Section pages - Kids
('kids_hero_model', '', 'Kids Page - Hero Model Image', 'kids', 'model', 'kids', NULL),
('kids_hero_collection', '', 'Kids Page - Hero Collection Banner', 'kids', 'collection', 'kids', NULL),
('kids_pants', '', 'Kids Page - Pants Category', 'kids', 'category', 'kids', 'pants'),
('kids_shirt', '', 'Kids Page - Shirts Category', 'kids', 'category', 'kids', 'shirt'),
('kids_tshirt', '', 'Kids Page - T-Shirts Category', 'kids', 'category', 'kids', 't-shirt'),
('kids_boots', '', 'Kids Page - Boots Category', 'kids', 'category', 'kids', 'boots'),
('kids_accessories', '', 'Kids Page - Accessories Category', 'kids', 'category', 'kids', 'accessories'),
('kids_toys', '', 'Kids Page - Toys Category', 'kids', 'category', 'kids', 'toys');