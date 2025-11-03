-- Temporary policies for testing without auth
-- Run this in Supabase SQL Editor to enable public viewing for testing

-- Allow public read access to profiles (for test page)
CREATE POLICY "Public can view profiles (testing)"
  ON profiles FOR SELECT
  USING (true);

-- Allow public read access to RFQs (for test page)
CREATE POLICY "Public can view RFQs (testing)"
  ON rfqs FOR SELECT
  USING (true);

-- Allow public read access to quotes (for test page)
CREATE POLICY "Public can view quotes (testing)"
  ON quotes FOR SELECT
  USING (true);

-- Allow public read access to inventory (for test page)
CREATE POLICY "Public can view inventory (testing)"
  ON inventory FOR SELECT
  USING (true);

-- ============================================
-- TO REMOVE THESE LATER (after implementing auth):
-- ============================================
-- DROP POLICY "Public can view profiles (testing)" ON profiles;
-- DROP POLICY "Public can view RFQs (testing)" ON rfqs;
-- DROP POLICY "Public can view quotes (testing)" ON quotes;
-- DROP POLICY "Public can view inventory (testing)" ON inventory;
