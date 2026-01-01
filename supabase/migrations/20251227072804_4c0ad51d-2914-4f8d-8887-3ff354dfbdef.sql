-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT NOT NULL,
  section TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_type TEXT,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (products are publicly viewable)
CREATE POLICY "Products are publicly readable"
ON public.products FOR SELECT
USING (true);

-- Create index for common queries
CREATE INDEX idx_products_section ON public.products(section);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);