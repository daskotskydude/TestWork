-- Apply RLS Policies to Existing Database
-- Run this in Supabase SQL Editor if RLS isn't working

-- Drop existing policies first (in case they were created incorrectly)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Buyers can view own RFQs" ON rfqs;
DROP POLICY IF EXISTS "Suppliers can view open RFQs" ON rfqs;
DROP POLICY IF EXISTS "Buyers can create own RFQs" ON rfqs;
DROP POLICY IF EXISTS "Buyers can update own RFQs" ON rfqs;
DROP POLICY IF EXISTS "Items visible if RFQ visible" ON rfq_items;
DROP POLICY IF EXISTS "Buyers can insert items for own RFQs" ON rfq_items;
DROP POLICY IF EXISTS "Suppliers can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Buyers can view quotes for own RFQs" ON quotes;
DROP POLICY IF EXISTS "Suppliers can create quotes" ON quotes;
DROP POLICY IF EXISTS "Buyers can update quote status" ON quotes;
DROP POLICY IF EXISTS "Buyers can view own orders" ON orders;
DROP POLICY IF EXISTS "Suppliers can view own orders" ON orders;
DROP POLICY IF EXISTS "Buyers can create orders" ON orders;
DROP POLICY IF EXISTS "Suppliers can update order status" ON orders;
DROP POLICY IF EXISTS "Users can view own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can manage own inventory" ON inventory;
DROP POLICY IF EXISTS "Suppliers can view own products" ON products;
DROP POLICY IF EXISTS "Suppliers can manage own products" ON products;
DROP POLICY IF EXISTS "Everyone can search products" ON products;
DROP POLICY IF EXISTS "Buyers can view own connections" ON connections;
DROP POLICY IF EXISTS "Suppliers can view own connections" ON connections;
DROP POLICY IF EXISTS "Buyers can create connections" ON connections;
DROP POLICY IF EXISTS "Suppliers can update connection status" ON connections;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RFQS: Buyer owns, Supplier can view open RFQs
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

-- RFQ_ITEMS: Inherit from parent RFQ
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

-- QUOTES: Supplier owns, Buyer of RFQ can view
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

-- ORDERS: Both parties can view their orders
CREATE POLICY "Buyers can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Suppliers can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Suppliers can update order status"
  ON orders FOR UPDATE
  USING (auth.uid() = supplier_id);

-- INVENTORY: Users can only see and manage their own inventory
CREATE POLICY "Users can view own inventory"
  ON inventory FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can manage own inventory"
  ON inventory FOR ALL
  USING (auth.uid() = owner_id);

-- PRODUCTS: Suppliers manage their own products, everyone can search
CREATE POLICY "Suppliers can view own products"
  ON products FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can manage own products"
  ON products FOR ALL
  USING (auth.uid() = supplier_id);

CREATE POLICY "Everyone can search products"
  ON products FOR SELECT
  USING (true);

-- CONNECTIONS: Both parties can view their connections
CREATE POLICY "Buyers can view own connections"
  ON connections FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Suppliers can view own connections"
  ON connections FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Buyers can create connections"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Suppliers can update connection status"
  ON connections FOR UPDATE
  USING (auth.uid() = supplier_id);
