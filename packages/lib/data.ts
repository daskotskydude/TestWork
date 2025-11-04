/**
 * Data Access Layer (DAL)
 * 
 * All Supabase database operations go through these functions.
 * Benefits:
 * - Centralized query logic
 * - Enforces RLS policies
 * - Mockable for testing
 * - Type-safe with TypeScript
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { RFQ, RFQItem, Quote, Order, InventoryItem, Product, Profile, Connection } from './supabaseClient';

// ============================================
// PROFILES
// ============================================

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function upsertProfile(supabase: SupabaseClient, profile: Partial<Profile> & { id: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

// ============================================
// RFQs (Requests for Quotation)
// ============================================

/**
 * List all RFQs visible to the current user
 * - Buyers see their own RFQs
 * - Suppliers see all open RFQs
 */
export async function listRFQs(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('rfqs')
    .select('*, rfq_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as (RFQ & { rfq_items: RFQItem[] })[];
}

/**
 * Get a single RFQ with all items
 */
export async function getRFQ(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('rfqs')
    .select('*, rfq_items(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as RFQ & { rfq_items: RFQItem[] };
}

/**
 * Create a new RFQ with items
 */
export async function createRFQ(
  supabase: SupabaseClient,
  rfqData: Omit<RFQ, 'id' | 'created_at' | 'updated_at' | 'status'>,
  items: Omit<RFQItem, 'id' | 'rfq_id' | 'created_at'>[]
) {
  // First create the RFQ
  const { data: rfq, error: rfqError } = await supabase
    .from('rfqs')
    .insert({
      ...rfqData,
      status: 'open'
    })
    .select()
    .single();

  if (rfqError) throw rfqError;

  // Then create all items
  const { data: rfqItems, error: itemsError } = await supabase
    .from('rfq_items')
    .insert(
      items.map(item => ({
        ...item,
        rfq_id: rfq.id
      }))
    )
    .select();

  if (itemsError) throw itemsError;

  return { rfq: rfq as RFQ, items: rfqItems as RFQItem[] };
}

/**
 * Update RFQ status
 */
export async function updateRFQStatus(
  supabase: SupabaseClient,
  rfqId: string,
  status: 'open' | 'closed'
) {
  const { data, error } = await supabase
    .from('rfqs')
    .update({ status })
    .eq('id', rfqId)
    .select()
    .single();

  if (error) throw error;
  return data as RFQ;
}

/**
 * Delete an RFQ (and cascade delete items via DB constraint)
 */
export async function deleteRFQ(supabase: SupabaseClient, rfqId: string) {
  const { error } = await supabase
    .from('rfqs')
    .delete()
    .eq('id', rfqId);

  if (error) throw error;
}

/**
 * Get RFQ items for a specific RFQ
 */
export async function getRFQItems(supabase: SupabaseClient, rfqId: string) {
  const { data, error } = await supabase
    .from('rfq_items')
    .select('*')
    .eq('rfq_id', rfqId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as RFQItem[];
}

// ============================================
// QUOTES
// ============================================

/**
 * List quotes for a specific RFQ
 */
export async function listQuotes(supabase: SupabaseClient, rfqId: string) {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('rfq_id', rfqId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Quote[];
}

/**
 * Get a single quote
 */
export async function getQuote(supabase: SupabaseClient, quoteId: string) {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quoteId)
    .single();

  if (error) throw error;
  return data as Quote;
}

/**
 * Create a new quote
 */
export async function createQuote(
  supabase: SupabaseClient,
  quoteData: Omit<Quote, 'id' | 'created_at' | 'updated_at' | 'status'>
) {
  const { data, error } = await supabase
    .from('quotes')
    .insert({
      ...quoteData,
      status: 'sent'
    })
    .select()
    .single();

  if (error) throw error;
  return data as Quote;
}

/**
 * Update quote status
 */
export async function updateQuoteStatus(
  supabase: SupabaseClient,
  quoteId: string,
  status: 'sent' | 'accepted' | 'rejected'
) {
  const { data, error } = await supabase
    .from('quotes')
    .update({ status })
    .eq('id', quoteId)
    .select()
    .single();

  if (error) throw error;
  return data as Quote;
}

/**
 * List all quotes by a supplier
 */
export async function listQuotesBySupplier(supabase: SupabaseClient, supplierId: string) {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Quote[];
}

// ============================================
// ORDERS
// ============================================

/**
 * List orders visible to the current user
 * - Buyers see their orders
 * - Suppliers see orders where they're the supplier
 */
export async function listOrders(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      buyer:buyer_id(id, email, org_name, role),
      supplier:supplier_id(id, email, org_name, role),
      rfq:rfq_id(id, title, category)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get a single order
 */
export async function getOrder(supabase: SupabaseClient, orderId: string) {
  const { data, error} = await supabase
    .from('orders')
    .select(`
      *,
      buyer:buyer_id(id, email, org_name, role),
      supplier:supplier_id(id, email, org_name, role),
      rfq:rfq_id(id, title, description, category)
    `)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create an order from an accepted quote
 */
export async function createOrder(
  supabase: SupabaseClient,
  orderData: Omit<Order, 'id' | 'po_number' | 'created_at' | 'updated_at' | 'status'>
) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...orderData,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  supabase: SupabaseClient,
  orderId: string,
  status: 'created' | 'fulfilled' | 'cancelled'
) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

// ============================================
// INVENTORY
// ============================================

/**
 * List inventory items for the current user (buyer)
 */
export async function listInventory(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('owner_id', userId)
    .order('name');

  if (error) throw error;
  return data as InventoryItem[];
}

/**
 * Get a single inventory item
 */
export async function getInventoryItem(supabase: SupabaseClient, itemId: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', itemId)
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

/**
 * Create or update an inventory item
 */
export async function upsertInventory(
  supabase: SupabaseClient,
  itemData: Partial<InventoryItem> & { owner_id: string }
) {
  const { data, error } = await supabase
    .from('inventory')
    .upsert(itemData)
    .select()
    .single();

  if (error) throw error;
  return data as InventoryItem;
}

/**
 * Delete an inventory item
 */
export async function deleteInventory(supabase: SupabaseClient, itemId: string) {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

// ============================================
// PRODUCTS (Supplier Catalog)
// ============================================

/**
 * List products for a specific supplier
 */
export async function listProducts(supabase: SupabaseClient, supplierId?: string) {
  let query = supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name');

  if (supplierId) {
    query = query.eq('supplier_id', supplierId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Product[];
}

/**
 * Get a single product
 */
export async function getProduct(supabase: SupabaseClient, productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Create or update a product
 */
export async function upsertProduct(
  supabase: SupabaseClient,
  productData: Partial<Product> & { supplier_id: string }
) {
  const { data, error } = await supabase
    .from('products')
    .upsert(productData)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Bulk upsert products (for CSV import)
 */
export async function bulkUpsertProducts(
  supabase: SupabaseClient,
  products: (Partial<Product> & { supplier_id: string })[]
) {
  const { data, error } = await supabase
    .from('products')
    .upsert(products)
    .select();

  if (error) throw error;
  return data as Product[];
}

/**
 * Delete a product
 */
export async function deleteProduct(supabase: SupabaseClient, productId: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
}

/**
 * Search products by name or category
 */
export async function searchProducts(supabase: SupabaseClient, searchTerm: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
    .order('name');

  if (error) throw error;
  return data as Product[];
}

// ============================================
// CONNECTIONS (Buyer-Supplier Relationships)
// ============================================

/**
 * List all connections for a user (buyer or supplier)
 */
export async function listConnections(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      buyer:buyer_id(id, email, org_name, role),
      supplier:supplier_id(id, email, org_name, role)
    `)
    .or(`buyer_id.eq.${userId},supplier_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as any[]; // TODO: Create proper joined type
}

/**
 * Get a specific connection
 */
export async function getConnection(supabase: SupabaseClient, connectionId: string) {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      buyer:buyer_id(id, email, org_name, role),
      supplier:supplier_id(id, email, org_name, role)
    `)
    .eq('id', connectionId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a connection request from buyer to supplier
 */
export async function createConnection(
  supabase: SupabaseClient,
  data: { buyer_id: string; supplier_id: string; notes?: string }
) {
  const { data: connection, error } = await supabase
    .from('connections')
    .insert({
      ...data,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return connection as Connection;
}

/**
 * Update connection status (accept, reject, block)
 */
export async function updateConnectionStatus(
  supabase: SupabaseClient,
  connectionId: string,
  status: 'accepted' | 'rejected' | 'blocked'
) {
  const { data, error } = await supabase
    .from('connections')
    .update({ status })
    .eq('id', connectionId)
    .select()
    .single();

  if (error) throw error;
  return data as Connection;
}

/**
 * Delete a connection
 */
export async function deleteConnection(supabase: SupabaseClient, connectionId: string) {
  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('id', connectionId);

  if (error) throw error;
}

/**
 * Get list of suppliers for a buyer (accepted connections only)
 */
export async function getConnectedSuppliers(supabase: SupabaseClient, buyerId: string) {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      supplier:supplier_id(*)
    `)
    .eq('buyer_id', buyerId)
    .eq('status', 'accepted');

  if (error) throw error;
  return data.map(d => d.supplier);
}

/**
 * Get list of buyers for a supplier (accepted connections only)
 */
export async function getConnectedBuyers(supabase: SupabaseClient, supplierId: string) {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      buyer:buyer_id(*)
    `)
    .eq('supplier_id', supplierId)
    .eq('status', 'accepted');

  if (error) throw error;
  return data.map(d => d.buyer);
}
