-- Create categories table to store dynamic categories with thumbnails
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  section text NOT NULL,
  thumbnail_url text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Publicly readable
CREATE POLICY "Categories are publicly readable"
  ON public.categories
  FOR SELECT
  USING (true);

-- Admin can manage
CREATE POLICY "Admins can manage categories"
  ON public.categories
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories with placeholder thumbnails
INSERT INTO public.categories (name, display_name, section, thumbnail_url) VALUES
  ('pants', 'Pants', 'men', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400'),
  ('shirt', 'Shirts', 'men', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400'),
  ('t-shirt', 'T-Shirts', 'men', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
  ('boots', 'Boots', 'men', 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400'),
  ('accessories', 'Accessories', 'men', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
  ('perfumes', 'Perfumes', 'men', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400'),
  ('pants', 'Pants', 'women', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'),
  ('shirt', 'Shirts', 'women', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400'),
  ('t-shirt', 'T-Shirts', 'women', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400'),
  ('boots', 'Boots', 'women', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400'),
  ('accessories', 'Accessories', 'women', 'https://images.unsplash.com/photo-1611923134239-b9be5b4d1b54?w=400'),
  ('perfumes', 'Perfumes', 'women', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'),
  ('pants', 'Pants', 'kids', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400'),
  ('shirt', 'Shirts', 'kids', 'https://images.unsplash.com/photo-1503944168849-8bf86875bbd8?w=400'),
  ('t-shirt', 'T-Shirts', 'kids', 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400'),
  ('boots', 'Boots', 'kids', 'https://images.unsplash.com/photo-1555009306-30a6f0248e39?w=400'),
  ('accessories', 'Accessories', 'kids', 'https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=400'),
  ('toys', 'Toys', 'kids', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400')
ON CONFLICT (name) DO NOTHING;