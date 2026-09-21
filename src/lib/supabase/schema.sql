-- =========================================================
-- NEWERA SHOP — SUPABASE POSTGRESQL DATABASE SCHEMA (STAGE 1)
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Layers',
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PRODUCTS (Designed for high scale - 1,000s+ of products)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  previous_price NUMERIC(12, 2) CHECK (previous_price >= price),
  discount_percentage INT GENERATED ALWAYS AS (
    CASE 
      WHEN previous_price IS NOT NULL AND previous_price > price 
      THEN ROUND(((previous_price - price) / previous_price) * 100)
      ELSE 0
    END
  ) STORED,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  brand TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
  review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  specifications JSONB DEFAULT '{}'::jsonb,
  warranty TEXT DEFAULT '1 Year Official Warranty',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning fast searching and filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);

-- 4. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- 5. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  county TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  street_address TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. CART ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- 7. WISHLISTS
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- 8. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL,
  shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card', 'cash_on_delivery', 'bank_transfer')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  mpesa_receipt_number TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_transaction_id TEXT,
  mpesa_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. CUSTOMER INQUIRIES (Support)
CREATE TABLE IF NOT EXISTS public.customer_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('order', 'delivery', 'payment', 'return', 'product', 'general')),
  order_number TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. PROMOTIONS & BANNERS
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL DEFAULT 'Shop Now',
  button_link TEXT NOT NULL DEFAULT '/shop',
  image_url TEXT NOT NULL,
  badge TEXT,
  bg_color TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert inquiries" ON public.customer_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read inquiries" ON public.customer_inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('admin', 'staff'))
);

-- USERS RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.users FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- WISHLISTS RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- ADDRESSES RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- ORDERS RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "Public/Users create orders" ON public.orders FOR INSERT WITH CHECK (
  (user_id IS NULL AND auth.uid() IS NULL) OR (auth.uid() = user_id)
);
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- ORDER ITEMS RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')))
);
CREATE POLICY "Allow insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- REVIEWS RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

