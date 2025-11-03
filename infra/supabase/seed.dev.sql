-- ProcureLink Development Seed Data
-- Run this AFTER creating test accounts in Supabase Auth
-- Replace the UUIDs below with actual UUIDs from your test accounts

-- ============================================
-- INSTRUCTIONS:
-- 1. Test accounts created in Supabase Auth ✓
-- 2. UUIDs updated below ✓
-- 3. Ready to run in Supabase SQL Editor
-- ============================================

-- UUIDs from test accounts:
-- Buyer: 42d79734-62be-4f37-a666-bea0a4606b90
-- Supplier: 3d19741b-29f1-409d-b600-dc60bbd30492

-- ============================================
-- PROFILES
-- ============================================
INSERT INTO profiles (id, email, role, org_name, phone, address, description)
VALUES
  (
    '42d79734-62be-4f37-a666-bea0a4606b90',  -- buyer@test.dev
    'buyer@test.dev',
    'buyer',
    'Test Restaurant Group',
    '+1-555-0100',
    '123 Main St, Test City, TC 12345',
    'A restaurant group testing the platform'
  ),
  (
    '3d19741b-29f1-409d-b600-dc60bbd30492',  -- supplier@test.dev
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
    '42d79734-62be-4f37-a666-bea0a4606b90',
    'Weekly Fresh Chicken Supply',
    'Need 20kg fresh or frozen chicken breast weekly for next 3 months',
    'Meat & Poultry',
    500,
    1200,
    'open'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '42d79734-62be-4f37-a666-bea0a4606b90',
    'Basmati Rice Bulk Order',
    'Looking for 50kg of premium 1121 extra long grain basmati rice',
    'Dry Goods',
    350,
    600,
    'open'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '42d79734-62be-4f37-a666-bea0a4606b90',
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
    '3d19741b-29f1-409d-b600-dc60bbd30492',
    1100,
    'USD',
    2,
    'Fresh chicken, Halal certified, weekly delivery available',
    'sent'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '3d19741b-29f1-409d-b600-dc60bbd30492',
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
    '42d79734-62be-4f37-a666-bea0a4606b90',
    'Cooking Oil 10L',
    'OIL-10L',
    2,
    'can',
    2
  ),
  (
    '42d79734-62be-4f37-a666-bea0a4606b90',
    'Disposable Gloves (100pcs)',
    'GLV-100',
    5,
    'box',
    3
  ),
  (
    '42d79734-62be-4f37-a666-bea0a4606b90',
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
    '3d19741b-29f1-409d-b600-dc60bbd30492',
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
    '3d19741b-29f1-409d-b600-dc60bbd30492',
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
    '3d19741b-29f1-409d-b600-dc60bbd30492',
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
    '3d19741b-29f1-409d-b600-dc60bbd30492',
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
    '3d19741b-29f1-409d-b600-dc60bbd30492',
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
