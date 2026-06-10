-- ==============================================
-- Coach Chaima — Database Schema for Supabase
-- ==============================================
-- Run this in Supabase > SQL Editor

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT DEFAULT '',
  features TEXT[] DEFAULT '{}',
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC NOT NULL DEFAULT 0,
  image_urls TEXT[] DEFAULT '{}',
  file_url TEXT DEFAULT '',
  features TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  product_title TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  payment_mode TEXT DEFAULT 'CIB',
  status TEXT DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================
-- Row Level Security (RLS)
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read active products, only authenticated users can write
CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Programs: anyone can read active programs, only authenticated users can write
CREATE POLICY "Public can read active programs" ON programs
  FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can manage programs" ON programs
  FOR ALL USING (auth.role() = 'authenticated');

-- Orders: only authenticated users can read/write
CREATE POLICY "Authenticated users can manage orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- ==============================================
-- Storage Buckets (run separately in SQL or create via Supabase Dashboard)
-- ==============================================
-- Go to Supabase Dashboard > Storage > Create bucket:
--   1. Bucket name: "product-images" (Public)
--   2. Bucket name: "program-images" (Public)
--   3. Bucket name: "program-files"  (Public)
--
-- Then add a public access policy for each bucket:
--   - Go to Policies for each bucket
--   - Add policy: "Allow public read" for SELECT
--   - Add policy: "Allow authenticated upload" for INSERT (auth.role() = 'authenticated')
