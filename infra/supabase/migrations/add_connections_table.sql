-- Add Connections/Contacts table for direct buyer-supplier relationships
-- This allows users to establish connections and make deals outside formal RFQs

CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate connections
  UNIQUE(buyer_id, supplier_id)
);

-- Create index for faster queries
CREATE INDEX idx_connections_buyer ON connections(buyer_id);
CREATE INDEX idx_connections_supplier ON connections(supplier_id);
CREATE INDEX idx_connections_status ON connections(status);

-- RLS Policies
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Buyers can see their own connections
CREATE POLICY "Buyers can view own connections"
  ON connections FOR SELECT
  USING (auth.uid() = buyer_id);

-- Suppliers can see connections where they are the supplier
CREATE POLICY "Suppliers can view connections to them"
  ON connections FOR SELECT
  USING (auth.uid() = supplier_id);

-- Buyers can create connection requests to suppliers
CREATE POLICY "Buyers can create connections"
  ON connections FOR INSERT
  WITH CHECK (
    auth.uid() = buyer_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'buyer'
    )
  );

-- Suppliers can update connection status (accept/reject)
CREATE POLICY "Suppliers can update connection status"
  ON connections FOR UPDATE
  USING (
    auth.uid() = supplier_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'supplier'
    )
  );

-- Buyers can update their own connections (notes, cancel request)
CREATE POLICY "Buyers can update own connections"
  ON connections FOR UPDATE
  USING (auth.uid() = buyer_id);

-- Both parties can delete connections
CREATE POLICY "Users can delete their connections"
  ON connections FOR DELETE
  USING (auth.uid() = buyer_id OR auth.uid() = supplier_id);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE connections IS 'Stores direct connections between buyers and suppliers for ongoing relationships';
COMMENT ON COLUMN connections.status IS 'pending: awaiting response, accepted: active connection, rejected: declined, blocked: blocked by either party';
