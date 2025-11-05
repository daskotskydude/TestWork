-- Fix RFQ ownership
-- This script reassigns RFQs to match the current logged-in user

-- First, check what's wrong
SELECT 
  r.id,
  r.title,
  r.buyer_id as rfq_buyer_id,
  p.id as profile_id,
  p.org_name,
  p.role,
  (r.buyer_id = p.id) as ids_match
FROM rfqs r
LEFT JOIN profiles p ON r.buyer_id = p.id;

-- If you see NULL profiles or ids_match = false, the buyer_ids are orphaned

-- OPTION 1: Delete all RFQs and start fresh
-- DELETE FROM rfq_items;
-- DELETE FROM rfqs;

-- OPTION 2: Reassign all RFQs to the first buyer in your profiles table
-- UPDATE rfqs 
-- SET buyer_id = (SELECT id FROM profiles WHERE role = 'buyer' LIMIT 1)
-- WHERE buyer_id NOT IN (SELECT id FROM profiles);

-- OPTION 3: Check auth.uid() in real-time
-- Run this while logged in to see what auth.uid() returns:
SELECT auth.uid() as current_user_id;

-- Compare with your profile:
SELECT id, email, role, org_name FROM profiles WHERE id = auth.uid();

-- Check which RFQs you should see:
SELECT id, title, buyer_id, (buyer_id = auth.uid()) as should_see 
FROM rfqs;
