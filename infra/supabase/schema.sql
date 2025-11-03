-- ProcureLink Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'supplier')),
  org_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  license_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can only see and edit their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- RFQS TABLE
-- ============================================
CREATE TABLE rfqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Buyer owns, Supplier can view open RFQs
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own RFQs"
  ON rfqs FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Suppliers can view open RFQs"
  ON rfqs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'supplier'
    )
    AND status = 'open'
  );

CREATE POLICY "Buyers can create own RFQs"
  ON rfqs FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update own RFQs"
  ON rfqs FOR UPDATE
  USING (auth.uid() = buyer_id);

-- ============================================
-- RFQ_ITEMS TABLE
-- ============================================
CREATE TABLE rfq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  qty DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  target_price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Inherit from parent RFQ
ALTER TABLE rfq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items visible if RFQ visible"
  ON rfq_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = rfq_items.rfq_id
      AND (
        rfqs.buyer_id = auth.uid()
        OR (rfqs.status = 'open' AND EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'supplier'
        ))
      )
    )
  );

CREATE POLICY "Buyers can insert items for own RFQs"
  ON rfq_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = rfq_items.rfq_id
      AND rfqs.buyer_id = auth.uid()
    )
  );

-- ============================================
-- QUOTES TABLE
-- ============================================
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  lead_time_days INTEGER NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Supplier owns, Buyer of RFQ can view
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Suppliers can view own quotes"
  ON quotes FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Buyers can view quotes for own RFQs"
  ON quotes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = quotes.rfq_id
      AND rfqs.buyer_id = auth.uid()
    )
  );

CREATE POLICY "Suppliers can create quotes"
  ON quotes FOR INSERT
  WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "Buyers can update quote status"
  ON quotes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = quotes.rfq_id
      AND rfqs.buyer_id = auth.uid()
    )
  );

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE RESTRICT,
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE RESTRICT,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  po_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'fulfilled', 'cancelled')),
  total_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL,
  lead_time_days INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Both parties can view their orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Suppliers can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Both parties can update order status"
  ON orders FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);

-- ============================================
-- INVENTORY TABLE
-- ============================================
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  qty DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  reorder_level DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Owner-only access
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own inventory"
  ON inventory FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert own inventory"
  ON inventory FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own inventory"
  ON inventory FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own inventory"
  ON inventory FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- PRODUCTS TABLE (Supplier Catalog)
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  unit TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  moq INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Supplier owns, Everyone can view
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Suppliers can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = supplier_id);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX idx_rfqs_buyer_id ON rfqs(buyer_id);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_rfq_items_rfq_id ON rfq_items(rfq_id);
CREATE INDEX idx_quotes_rfq_id ON quotes(rfq_id);
CREATE INDEX idx_quotes_supplier_id ON quotes(supplier_id);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX idx_inventory_owner_id ON inventory(owner_id);
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate PO number
CREATE OR REPLACE FUNCTION generate_po_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COUNT(*) + 1000 INTO next_num FROM orders;
  RETURN 'PO-' || next_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfqs_updated_at
  BEFORE UPDATE ON rfqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
