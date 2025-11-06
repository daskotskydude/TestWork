-- ============================================
-- UPDATE SUPPLIER RFQ ACCESS POLICY
-- Suppliers can view:
-- 1. Open RFQs with NO invitations (public/broadcast)
-- 2. Open RFQs where they are specifically invited
-- ============================================

-- Drop the old policy
DROP POLICY IF EXISTS "Suppliers can view open RFQs" ON rfqs;

-- Create new policy with invitation logic
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
