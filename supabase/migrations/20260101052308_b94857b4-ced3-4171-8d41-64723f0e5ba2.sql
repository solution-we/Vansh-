-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, size)
);

-- Enable RLS on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for cart_items
CREATE POLICY "Users can view their own cart items"
ON public.cart_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
ON public.cart_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
ON public.cart_items
FOR DELETE
USING (auth.uid() = user_id);

-- Create wishlist_items table
CREATE TABLE public.wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlist_items
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for wishlist_items
CREATE POLICY "Users can view their own wishlist items"
ON public.wishlist_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items"
ON public.wishlist_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items"
ON public.wishlist_items
FOR DELETE
USING (auth.uid() = user_id);

-- Create user_addresses table
CREATE TABLE public.user_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT '+91',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_addresses
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_addresses
CREATE POLICY "Users can view their own addresses"
ON public.user_addresses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
ON public.user_addresses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
ON public.user_addresses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
ON public.user_addresses
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at on cart_items
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on user_addresses
CREATE TRIGGER update_user_addresses_updated_at
BEFORE UPDATE ON public.user_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();