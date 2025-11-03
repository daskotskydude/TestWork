import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our database
export type Profile = {
  id: string
  email: string
  role: 'buyer' | 'supplier'
  org_name: string
  phone?: string
  address?: string
  logo_url?: string
  license_url?: string
  description?: string
  created_at: string
  updated_at: string
}

export type RFQ = {
  id: string
  buyer_id: string
  title: string
  description: string
  category: string
  budget_min?: number
  budget_max?: number
  status: 'open' | 'closed'
  created_at: string
  updated_at: string
}

export type RFQItem = {
  id: string
  rfq_id: string
  name: string
  sku?: string
  qty: number
  unit: string
  target_price?: number
  created_at: string
}

export type Quote = {
  id: string
  rfq_id: string
  supplier_id: string
  total_price: number
  currency: string
  lead_time_days: number
  notes?: string
  status: 'sent' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  rfq_id: string
  quote_id: string
  buyer_id: string
  supplier_id: string
  po_number: string
  status: 'created' | 'fulfilled' | 'cancelled'
  total_price: number
  currency: string
  lead_time_days: number
  created_at: string
  updated_at: string
}

export type InventoryItem = {
  id: string
  owner_id: string
  name: string
  sku?: string
  qty: number
  unit: string
  reorder_level: number
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  supplier_id: string
  name: string
  sku?: string
  unit: string
  price: number
  stock: number
  category: string
  moq: number
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export type Connection = {
  id: string
  buyer_id: string
  supplier_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
  notes?: string
  created_at: string
  updated_at: string
}
