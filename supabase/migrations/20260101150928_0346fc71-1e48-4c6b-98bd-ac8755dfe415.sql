-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create product_variants table for sizes/colors/stock
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    color_hex TEXT DEFAULT '#000000',
    stock INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (product_id, size, color)
);

-- Enable RLS on product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Product variants are publicly readable
CREATE POLICY "Product variants are publicly readable"
ON public.product_variants
FOR SELECT
USING (true);

-- Only admins can manage product variants
CREATE POLICY "Admins can manage product variants"
ON public.product_variants
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create product_images table for multiple images per product
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on product_images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Product images are publicly readable
CREATE POLICY "Product images are publicly readable"
ON public.product_images
FOR SELECT
USING (true);

-- Only admins can manage product images
CREATE POLICY "Admins can manage product images"
ON public.product_images
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies to products table for full CRUD
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updating updated_at on product_variants
CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();