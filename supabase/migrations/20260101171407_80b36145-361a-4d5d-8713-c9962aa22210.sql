-- Add Flipkart and Amazon links to products table
ALTER TABLE public.products 
ADD COLUMN flipkart_link text,
ADD COLUMN amazon_link text;

-- Add color association and common image flag to product_images table
ALTER TABLE public.product_images 
ADD COLUMN color text,
ADD COLUMN is_common boolean DEFAULT false;