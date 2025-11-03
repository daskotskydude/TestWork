-- ProcureLink Development Seed Data
-- Run this AFTER creating test accounts in Supabase Auth
-- Replace the UUIDs below with actual UUIDs from your test accounts

-- ============================================
-- INSTRUCTIONS:
-- 1. Create test accounts in Supabase Auth:
--    - buyer@test.dev (password: TestBuyer123!)
--    - supplier@test.dev (password: TestSupplier123!)
-- 2. Get their UUIDs from auth.users table
-- 3. Replace <BUYER_UUID> and <SUPPLIER_UUID> below
-- 4. Run this script in Supabase SQL Editor
-- ============================================

-- REPLACE THESE WITH ACTUAL UUIDs FROM YOUR SUPABASE AUTH USERS:
-- Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

-- ============================================
-- PROFILES
-- ============================================
INSERT INTO profiles (id, email, role, org_name, phone, address, description)
VALUES
  (
    '<BUYER_UUID>',  -- Replace with actual buyer UUID
    'buyer@test.dev',
    'buyer',
    'Test Restaurant Group',
    '+1-555-0100',
    '123 Main St, Test City, TC 12345',
    'A restaurant group testing the platform'
  ),
  (
    '<SUPPLIER_UUID>',  -- Replace with actual supplier UUID
    'supplier@test.dev',
    'supplier',
    'Gulf Foods Trading',
    '+974-5555-0200',
    '456 Industrial Ave, Doha, Qatar',
    'Fresh and frozen food supplier with 10+ years experience'
  );

-- ============================================
-- RFQS (Buyer creates)
-- ============================================
INSERT INTO rfqs (id, buyer_id, title, description, category, budget_min, budget_max, status)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '<BUYER_UUID>',
    'Weekly Fresh Chicken Supply',
    'Need 20kg fresh or frozen chicken breast weekly for next 3 months',
    'Meat & Poultry',
    500,
    1200,
    'open'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '<BUYER_UUID>',
    'Basmati Rice Bulk Order',
    'Looking for 50kg of premium 1121 extra long grain basmati rice',
    'Dry Goods',
    350,
    600,
    'open'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '<BUYER_UUID>',
    'Fresh Vegetables - Mixed',
    'Daily fresh vegetables: tomatoes, onions, peppers, lettuce',
    'Produce',
    200,
    400,
    'open'
  );

-- ============================================
-- RFQ ITEMS
-- ============================================
INSERT INTO rfq_items (rfq_id, name, sku, qty, unit, target_price)
VALUES
  -- Items for RFQ 1 (Chicken)
  (
    '11111111-1111-1111-1111-111111111111',
    'Chicken Breast - Boneless',
    'CHKN-BRST-001',
    20,
    'kg',
    55
  ),
  
  -- Items for RFQ 2 (Rice)
  (
    '22222222-2222-2222-2222-222222222222',
    'Basmati Rice 1121',
    'RICE-BSM-1121',
    50,
    'kg',
    8
  ),
  
  -- Items for RFQ 3 (Vegetables)
  (
    '33333333-3333-3333-3333-333333333333',
    'Tomatoes - Fresh',
    'VEG-TOM-001',
    10,
    'kg',
    4
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Onions - Yellow',
    'VEG-ONI-001',
    8,
    'kg',
    3
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Bell Peppers - Mixed',
    'VEG-PEP-001',
    5,
    'kg',
    6
  );

-- ============================================
-- QUOTES (Supplier submits)
-- ============================================
INSERT INTO quotes (rfq_id, supplier_id, total_price, currency, lead_time_days, notes, status)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '<SUPPLIER_UUID>',
    1100,
    'USD',
    2,
    'Fresh chicken, Halal certified, weekly delivery available',
    'sent'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '<SUPPLIER_UUID>',
    400,
    'USD',
    3,
    'Premium quality 1121 basmati, vacuum sealed packaging',
    'sent'
  );

-- ============================================
-- INVENTORY (Buyer's stock)
-- ============================================
INSERT INTO inventory (owner_id, name, sku, qty, unit, reorder_level)
VALUES
  (
    '<BUYER_UUID>',
    'Cooking Oil 10L',
    'OIL-10L',
    2,
    'can',
    2
  ),
  (
    '<BUYER_UUID>',
    'Disposable Gloves (100pcs)',
    'GLV-100',
    5,
    'box',
    3
  ),
  (
    '<BUYER_UUID>',
    'Paper Towels',
    'PPR-TWL',
    1,
    'pack',
    2
  );

-- ============================================
-- PRODUCTS (Supplier's catalog)
-- ============================================
INSERT INTO products (supplier_id, name, sku, unit, price, stock, category, moq, description)
VALUES
  (
    '<SUPPLIER_UUID>',
    'Chicken Breast - Fresh',
    'CHKN-BRST-F',
    'kg',
    55,
    500,
    'Meat & Poultry',
    5,
    'Fresh boneless chicken breast, Halal certified'
  ),
  (
    '<SUPPLIER_UUID>',
    'Chicken Breast - Frozen',
    'CHKN-BRST-FZ',
    'kg',
    50,
    1000,
    'Meat & Poultry',
    10,
    'Frozen boneless chicken breast, Halal certified, IQF'
  ),
  (
    '<SUPPLIER_UUID>',
    'Basmati Rice 1121',
    'RICE-BSM-1121',
    'kg',
    8,
    2000,
    'Dry Goods',
    25,
    'Premium quality extra long grain basmati rice'
  ),
  (
    '<SUPPLIER_UUID>',
    'White Rice',
    'RICE-WHT',
    'kg',
    5,
    3000,
    'Dry Goods',
    50,
    'Standard white rice, polished'
  ),
  (
    '<SUPPLIER_UUID>',
    'Tomatoes',
    'VEG-TOM',
    'kg',
    4,
    200,
    'Produce',
    5,
    'Fresh tomatoes, locally sourced'
  );

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these to verify data was inserted correctly:

-- SELECT * FROM profiles;
-- SELECT * FROM rfqs;
-- SELECT * FROM rfq_items;
-- SELECT * FROM quotes;
-- SELECT * FROM inventory;
-- SELECT * FROM products;
