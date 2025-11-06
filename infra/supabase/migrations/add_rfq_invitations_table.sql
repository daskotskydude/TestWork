-- ============================================
-- RFQ_INVITATIONS TABLE
-- Track which suppliers are invited to quote on specific RFQs
-- ============================================
CREATE TABLE rfq_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rfq_id, supplier_id)
);

-- Indexes for performance
CREATE INDEX idx_rfq_invitations_rfq ON rfq_invitations(rfq_id);
CREATE INDEX idx_rfq_invitations_supplier ON rfq_invitations(supplier_id);

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE rfq_invitations ENABLE ROW LEVEL SECURITY;

-- Buyers can view invitations for their RFQs
CREATE POLICY "Buyers can view invitations for own RFQs"
  ON rfq_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = rfq_invitations.rfq_id
      AND rfqs.buyer_id = auth.uid()
    )
  );

-- Suppliers can view their own invitations
CREATE POLICY "Suppliers can view own invitations"
  ON rfq_invitations FOR SELECT
  USING (auth.uid() = supplier_id);

-- Buyers can create invitations for their RFQs
CREATE POLICY "Buyers can create invitations for own RFQs"
  ON rfq_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = rfq_invitations.rfq_id
      AND rfqs.buyer_id = auth.uid()
    )
  );

-- Buyers can delete invitations for their RFQs
CREATE POLICY "Buyers can delete invitations for own RFQs"
  ON rfq_invitations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM rfqs
      WHERE rfqs.id = rfq_invitations.rfq_id
      AND rfqs.buyer_id = auth.uid()
    )
  );
