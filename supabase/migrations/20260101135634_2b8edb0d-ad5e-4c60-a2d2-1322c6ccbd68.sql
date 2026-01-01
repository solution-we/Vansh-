-- Insert sample products with proper UUIDs for Men's section
INSERT INTO public.products (id, name, price, original_price, image, section, category, sub_type, is_new) VALUES
-- Men's Shirts
('a1b2c3d4-1111-4000-8000-000000000001', 'Classic Oxford Shirt', 2999, 3999, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', 'men', 'shirt', 'formal', false),
('a1b2c3d4-1111-4000-8000-000000000002', 'Slim Fit Linen Shirt', 3499, 4499, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'men', 'shirt', 'casual', true),
('a1b2c3d4-1111-4000-8000-000000000003', 'Premium Cotton Shirt', 2799, NULL, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800', 'men', 'shirt', 'formal', false),
-- Men's Pants
('a1b2c3d4-2222-4000-8000-000000000001', 'Tailored Chinos', 3999, 4999, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800', 'men', 'pants', 'casual', false),
('a1b2c3d4-2222-4000-8000-000000000002', 'Formal Trousers', 4499, NULL, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800', 'men', 'pants', 'formal', true),
('a1b2c3d4-2222-4000-8000-000000000003', 'Relaxed Fit Jeans', 3299, 3999, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'men', 'pants', 'casual', false),
-- Men's T-shirts
('a1b2c3d4-3333-4000-8000-000000000001', 'Essential Cotton Tee', 1499, 1999, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'men', 't-shirt', NULL, false),
('a1b2c3d4-3333-4000-8000-000000000002', 'Premium V-Neck Tee', 1799, NULL, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800', 'men', 't-shirt', NULL, true),
-- Men's Boots
('a1b2c3d4-4444-4000-8000-000000000001', 'Classic Leather Boots', 7999, 9999, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800', 'men', 'boots', NULL, false),
('a1b2c3d4-4444-4000-8000-000000000002', 'Chelsea Boots', 6999, NULL, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800', 'men', 'boots', NULL, true),

-- Women's section
('b1c2d3e4-1111-4000-8000-000000000001', 'Elegant Blouse', 2999, 3999, 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800', 'women', 'shirt', 'formal', false),
('b1c2d3e4-1111-4000-8000-000000000002', 'Floral Print Top', 2499, NULL, 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800', 'women', 'shirt', 'casual', true),
('b1c2d3e4-2222-4000-8000-000000000001', 'High Waist Trousers', 3999, 4999, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', 'women', 'pants', 'formal', false),
('b1c2d3e4-2222-4000-8000-000000000002', 'Relaxed Palazzo Pants', 3499, NULL, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', 'women', 'pants', 'casual', true),
('b1c2d3e4-3333-4000-8000-000000000001', 'Cotton Basic Tee', 1299, 1699, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', 'women', 't-shirt', NULL, false),
('b1c2d3e4-4444-4000-8000-000000000001', 'Ankle Boots', 5999, 7499, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', 'women', 'boots', NULL, true),

-- Kids' section
('c1d2e3f4-1111-4000-8000-000000000001', 'Kids Polo Shirt', 1499, 1999, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800', 'kids', 'shirt', NULL, false),
('c1d2e3f4-2222-4000-8000-000000000001', 'Kids Cargo Pants', 1999, 2499, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800', 'kids', 'pants', NULL, true),
('c1d2e3f4-3333-4000-8000-000000000001', 'Fun Graphic Tee', 999, NULL, 'https://images.unsplash.com/photo-1519238263558-65edead2418e?w=800', 'kids', 't-shirt', NULL, false),
('c1d2e3f4-4444-4000-8000-000000000001', 'Kids Rain Boots', 2499, 2999, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800', 'kids', 'boots', NULL, true);