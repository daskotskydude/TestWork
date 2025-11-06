-- ============================================
-- FULL MIGRATION: ADD RFQ INVITATIONS SYSTEM
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create rfq_invitations table
CREATE TABLE IF NOT EXISTS rfq_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rfq_id, supplier_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rfq_invitations_rfq ON rfq_invitations(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_invitations_supplier ON rfq_invitations(supplier_id);

-- Step 2: Enable RLS
ALTER TABLE rfq_invitations ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for rfq_invitations
CREATE POLICY "Buyers can view invitations for own RFQs"
  ON rfq_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = rfq_invitations.rfq_id
      AND rfqs.buyer_id = auth.uid()
    )
  );

CREATE POLICY "Suppliers can view own invitations"
  ON rfq_invitations FOR SELECT
  USING (auth.uid() = supplier_id);

CREATE POLICY "Buyers can create invitations for own RFQs"
  ON rfq_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = rfq_invitations.rfq_id
      AND rfqs.buyer_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can delete invitations for own RFQs"
  ON rfq_invitations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = rfq_invitations.rfq_id
      AND rfqs.buyer_id = auth.uid()
    )
  );

-- Step 4: Update supplier RFQ access policy
DROP POLICY IF EXISTS "Suppliers can view open RFQs" ON rfqs;

CREATE POLICY "Suppliers can view open RFQs"
  ON rfqs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'supplier'
    )
    AND status = 'open'
    AND (
      -- Either no invitations exist (broadcast to all)
      NOT EXISTS (
        SELECT 1 FROM rfq_invitations
        WHERE rfq_invitations.rfq_id = rfqs.id
      )
      OR
      -- Or supplier is specifically invited
      EXISTS (
        SELECT 1 FROM rfq_invitations
        WHERE rfq_invitations.rfq_id = rfqs.id
        AND rfq_invitations.supplier_id = auth.uid()
      )
    )
  );

-- Verification queries (optional - run to check)
-- SELECT * FROM rfq_invitations;
-- SELECT tablename, policyname FROM pg_policies WHERE tablename = 'rfq_invitations';
