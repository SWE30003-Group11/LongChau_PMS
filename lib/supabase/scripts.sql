-- Complete setup script with existence checks

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user roles enum only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('customer', 'pharmacist', 'staff', 'admin');
    END IF;
END$$;

-- Create profiles table only if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  date_of_birth DATE,
  address TEXT,
  id_number TEXT,
  medical_conditions TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create prescriptions table only if it doesn't exist
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create orders table only if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'ready', 'delivered', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
  fulfillment_method TEXT CHECK (fulfillment_method IN ('pickup', 'delivery')) NOT NULL,
  branch_id INTEGER,
  delivery_address TEXT,
  notes TEXT,
  prescription_id UUID REFERENCES prescriptions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create order_items table only if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  prescription_required BOOLEAN DEFAULT FALSE
);

-- Create saved_addresses table only if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  address TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create favorite_products table only if it doesn't exist
CREATE TABLE IF NOT EXISTS favorite_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_products ENABLE ROW LEVEL SECURITY;

-- Drop and recreate all policies to ensure they're correct
-- Profiles policies
DROP POLICY IF EXISTS "Enable insert for authentication users only" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;

CREATE POLICY "Enable insert for authentication users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin', 'pharmacist')
    )
  );

-- Prescriptions policies
DROP POLICY IF EXISTS "Users can view own prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Users can create own prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Pharmacists can view all prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Pharmacists can update prescriptions" ON prescriptions;

CREATE POLICY "Users can view own prescriptions" ON prescriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own prescriptions" ON prescriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pharmacists can view all prescriptions" ON prescriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('pharmacist', 'admin')
    )
  );

CREATE POLICY "Pharmacists can update prescriptions" ON prescriptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('pharmacist', 'admin')
    )
  );

-- Orders policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Staff can view all orders" ON orders;
DROP POLICY IF EXISTS "Staff can update orders" ON orders;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin', 'pharmacist')
    )
  );

CREATE POLICY "Staff can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Order items policies
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items for own orders" ON order_items;

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Saved addresses policies
DROP POLICY IF EXISTS "Users can manage own addresses" ON saved_addresses;

CREATE POLICY "Users can manage own addresses" ON saved_addresses
  FOR ALL USING (auth.uid() = user_id);

-- Favorite products policies
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorite_products;

CREATE POLICY "Users can manage own favorites" ON favorite_products
  FOR ALL USING (auth.uid() = user_id);

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'phone',
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create or replace update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_user_id ON prescriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Create prescriptions storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
SELECT 'prescriptions', 'prescriptions', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'prescriptions');

-- Create product-images storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
SELECT 'product-images', 'product-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'product-images');

-- Storage policies for prescriptions bucket
DROP POLICY IF EXISTS "Users can upload own prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Pharmacists can view all prescriptions" ON storage.objects;

CREATE POLICY "Users can upload own prescriptions" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'prescriptions' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own prescriptions" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'prescriptions' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Pharmacists can view all prescriptions" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'prescriptions' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('pharmacist', 'admin')
    )
  );

-- Storage policies for product-images bucket (public read, admin/staff/pharmacist upload)
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product images" ON storage.objects;

CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin, staff can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admin, staff can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admin, staff can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

-- Fix RLS policies for profiles table to remove infinite recursion

-- First, drop all existing policies on profiles table
DROP POLICY IF EXISTS "Enable insert for authentication users only" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;

-- Recreate policies without circular references

-- 1. Allow users to insert their own profile
CREATE POLICY "Enable insert for authentication users only" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 3. Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Allow staff to view all profiles (fixed to avoid recursion)
-- This policy was causing the issue because it was checking the profiles table within itself
CREATE POLICY "Staff can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('staff', 'admin', 'pharmacist')
    )
  );

-- Alternative approach for staff policy that avoids recursion
-- Drop the problematic policy first
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;

-- Create a function to check if user is staff
CREATE OR REPLACE FUNCTION is_staff_member(user_id uuid)
RETURNS boolean AS $$
DECLARE
  user_role user_role;
BEGIN
  -- Get the role directly without using SELECT on profiles
  SELECT role INTO user_role 
  FROM profiles 
  WHERE id = user_id;
  
  RETURN user_role IN ('staff', 'admin', 'pharmacist');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create the staff policy using the function
CREATE POLICY "Staff can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR is_staff_member(auth.uid())
  );

-- Fix prescriptions table policies as well
DROP POLICY IF EXISTS "Pharmacists can view all prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Pharmacists can update prescriptions" ON prescriptions;

-- Recreate without recursion
CREATE POLICY "Pharmacists can view all prescriptions" ON prescriptions
  FOR SELECT USING (
    auth.uid() = user_id OR is_staff_member(auth.uid())
  );

CREATE POLICY "Pharmacists can update prescriptions" ON prescriptions
  FOR UPDATE USING (
    is_staff_member(auth.uid())
  );

-- Fix orders table policies
DROP POLICY IF EXISTS "Staff can view all orders" ON orders;
DROP POLICY IF EXISTS "Staff can update orders" ON orders;

CREATE POLICY "Staff can view all orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR is_staff_member(auth.uid())
  );

CREATE POLICY "Staff can update orders" ON orders
  FOR UPDATE USING (
    is_staff_member(auth.uid())
  );

-- 1. Branches Table
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  manager_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Products Table (UPDATED - removed image and images columns)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT,
  prescription_required BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  manufacturer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  branch_id INTEGER REFERENCES branches(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(branch_id, product_id)
);

-- 4. Update order_items to reference products (if not already)
-- (If your order_items.product_id is not a foreign key, add this)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_order_items_product'
      AND table_name = 'order_items'
  ) THEN
    ALTER TABLE order_items
      ADD CONSTRAINT fk_order_items_product
      FOREIGN KEY (product_id) REFERENCES products(id);
  END IF;
END$$;

-- Enable RLS and allow public read for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read to all" ON products;
CREATE POLICY "Allow read to all" ON products FOR SELECT USING (true);

-- Enable RLS and allow public read for inventory
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read to all" ON inventory;
CREATE POLICY "Allow read to all" ON inventory FOR SELECT USING (true);

-- Enable RLS and allow public read for branches
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read to all" ON branches;
CREATE POLICY "Allow read to all" ON branches FOR SELECT USING (true);

-- Add additional product columns
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS pack_size TEXT,
  ADD COLUMN IF NOT EXISTS strength TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS key_features JSONB,
  ADD COLUMN IF NOT EXISTS active_ingredient TEXT,
  ADD COLUMN IF NOT EXISTS mechanism_of_action TEXT,
  ADD COLUMN IF NOT EXISTS indications TEXT,
  ADD COLUMN IF NOT EXISTS warranty TEXT,
  ADD COLUMN IF NOT EXISTS storage TEXT,
  ADD COLUMN IF NOT EXISTS pregnancy_category TEXT,
  ADD COLUMN IF NOT EXISTS lactation TEXT,
  ADD COLUMN IF NOT EXISTS bundle_products JSONB,
  ADD COLUMN IF NOT EXISTS related_products JSONB;

-- Add foreign key constraint for favorite_products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_favorite_products_product'
      AND table_name = 'favorite_products'
  ) THEN
    ALTER TABLE favorite_products
      ADD CONSTRAINT fk_favorite_products_product
      FOREIGN KEY (product_id) REFERENCES products(id);
  END IF;
END$$;

-- 5. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Add supplier_id to products and set up foreign key
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS supplier_id INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_products_supplier'
      AND table_name = 'products'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT fk_products_supplier
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id);
  END IF;
END$$;

-- Enable RLS and allow public read for suppliers
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read to all" ON suppliers;
CREATE POLICY "Allow read to all" ON suppliers FOR SELECT USING (true);

-- Allow staff to manage products
DROP POLICY IF EXISTS "Staff can manage products" ON products;
CREATE POLICY "Staff can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin', 'pharmacist')
    )
  );

-- Allow staff to manage inventory
DROP POLICY IF EXISTS "Staff can manage inventory" ON inventory;
CREATE POLICY "Staff can manage inventory" ON inventory
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'admin', 'pharmacist')
    )
  );

-- Update products with supplier relationships
UPDATE products
SET supplier_id = suppliers.id
FROM suppliers
WHERE products.manufacturer = suppliers.name;

-- 6. Payment Table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  payment_method TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  transaction_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 7. Delivery Table
CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_method TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS and allow public read for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read to all" ON payments;
CREATE POLICY "Allow read to all" ON payments FOR SELECT USING (true);

-- Enable RLS and allow public read for deliveries
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read to all" ON deliveries;
CREATE POLICY "Allow read to all" ON deliveries FOR SELECT USING (true);

-- Allow users to insert their own payments (if they own the order)
DROP POLICY IF EXISTS "Users can insert payments" ON payments;
CREATE POLICY "Users can insert payments" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

-- Allow users to insert their own deliveries (if they own the order)
DROP POLICY IF EXISTS "Users can insert deliveries" ON deliveries;
CREATE POLICY "Users can insert deliveries" ON deliveries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = deliveries.order_id AND orders.user_id = auth.uid()
    )
  );

-- IMPORTANT: Remove existing image/images columns from products table if they exist
-- This is safe to run multiple times
DO $$
BEGIN
  -- Remove image column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'image'
  ) THEN
    ALTER TABLE products DROP COLUMN image;
  END IF;
  
  -- Remove images column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'images'
  ) THEN
    ALTER TABLE products DROP COLUMN images;
  END IF;
END$$;

-- Create helper functions for product image URLs
CREATE OR REPLACE FUNCTION get_product_image_url(product_name TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Return the public URL for the product image
  -- Images are stored as: product-name.png in the product-images bucket
  RETURN 'https://your-supabase-url.supabase.co/storage/v1/object/public/product-images/' || product_name || '.png';
END;
$$ LANGUAGE plpgsql;

-- Add current_branch_id to profiles for user branch selection
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_branch_id INTEGER REFERENCES branches(id);