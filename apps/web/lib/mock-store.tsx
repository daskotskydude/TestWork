'use client'

import { useState, useEffect } from 'react'

// Mock user for client-side auth simulation
export interface MockUser {
  id: string
  email: string
  name: string
  role: 'buyer' | 'supplier'
  org_name: string
}

// Mock RFQ
export interface RFQ {
  id: string
  buyer_id: string
  title: string
  description: string
  category: string
  budget_min?: number
  budget_max?: number
  status: 'open' | 'closed'
  created_at: string
  items: RFQItem[]
}

export interface RFQItem {
  id: string
  rfq_id: string
  name: string
  sku?: string
  qty: number
  unit: string
  target_price?: number
}

// Mock Quote
export interface Quote {
  id: string
  rfq_id: string
  supplier_id: string
  supplier_name: string
  total_price: number
  currency: string
  lead_time_days: number
  notes?: string
  status: 'sent' | 'accepted' | 'rejected'
  created_at: string
}

// Mock Order
export interface Order {
  id: string
  rfq_id: string
  quote_id: string
  buyer_id: string
  supplier_id: string
  po_number: string
  status: 'created' | 'fulfilled' | 'cancelled'
  created_at: string
  buyer_name: string
  supplier_name: string
  total_price: number
  currency: string
  lead_time_days: number
}

// Mock Inventory Item
export interface InventoryItem {
  id: string
  owner_id: string
  name: string
  sku?: string
  qty: number
  unit: string
  reorder_level: number
  created_at: string
}

// Product for supplier catalog
export interface Product {
  id: string
  supplier_id: string
  name: string
  unit: string
  price: number
  stock: number
  category: string
  moq: number
  sku?: string
}

// Mock data storage
const STORAGE_KEY = 'procurelink_mock_data'

interface MockData {
  user: MockUser | null
  rfqs: RFQ[]
  quotes: Quote[]
  orders: Order[]
  inventory: InventoryItem[]
  products: Product[]
}

const defaultData: MockData = {
  user: null,
  rfqs: [
    {
      id: 'rfq-1',
      buyer_id: 'buyer-1',
      title: 'Chicken Breast 20kg',
      description: 'Fresh or frozen, weekly supply',
      category: 'Food',
      budget_min: 500,
      budget_max: 1200,
      status: 'open',
      created_at: new Date().toISOString(),
      items: [
        {
          id: 'item-1',
          rfq_id: 'rfq-1',
          name: 'Chicken Breast',
          sku: 'CHKN-BRST',
          qty: 20,
          unit: 'kg',
          target_price: 55,
        },
      ],
    },
    {
      id: 'rfq-2',
      buyer_id: 'buyer-1',
      title: 'Basmati Rice 50kg',
      description: '1121 extra long grain',
      category: 'Food',
      budget_min: 350,
      budget_max: 600,
      status: 'open',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      items: [
        {
          id: 'item-2',
          rfq_id: 'rfq-2',
          name: 'Basmati Rice 1121',
          qty: 50,
          unit: 'kg',
        },
      ],
    },
  ],
  quotes: [
    {
      id: 'quote-1',
      rfq_id: 'rfq-1',
      supplier_id: 'supplier-1',
      supplier_name: 'Gulf Foods Trading',
      total_price: 1100,
      currency: 'QAR',
      lead_time_days: 2,
      notes: 'Fresh, Halal certified',
      status: 'sent',
      created_at: new Date().toISOString(),
    },
  ],
  orders: [],
  inventory: [
    {
      id: 'inv-1',
      owner_id: 'buyer-1',
      name: 'Cooking Oil 10L',
      sku: 'OIL-10L',
      qty: 2,
      unit: 'can',
      reorder_level: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 'inv-2',
      owner_id: 'buyer-1',
      name: 'Gloves (100pcs)',
      sku: 'GLV-100',
      qty: 5,
      unit: 'box',
      reorder_level: 3,
      created_at: new Date().toISOString(),
    },
  ],
  products: [],
}

export function useMockStore() {
  const [data, setData] = useState<MockData>(defaultData)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setData(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse mock data', e)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  return {
    // User
    user: data.user,
    login: (user: MockUser) => setData({ ...data, user }),
    logout: () => setData({ ...data, user: null }),

    // RFQs
    rfqs: data.rfqs,
    addRFQ: (rfq: RFQ) => setData({ ...data, rfqs: [...data.rfqs, rfq] }),
    getRFQ: (id: string) => data.rfqs.find((r) => r.id === id),

    // Quotes
    quotes: data.quotes,
    addQuote: (quote: Quote) => setData({ ...data, quotes: [...data.quotes, quote] }),
    getQuotesForRFQ: (rfqId: string) => data.quotes.filter((q) => q.rfq_id === rfqId),
    acceptQuote: (quoteId: string) => {
      const quote = data.quotes.find((q) => q.id === quoteId)
      if (!quote) return

      const rfq = data.rfqs.find((r) => r.id === quote.rfq_id)
      if (!rfq) return

      const order: Order = {
        id: `order-${Date.now()}`,
        rfq_id: quote.rfq_id,
        quote_id: quote.id,
        buyer_id: rfq.buyer_id,
        supplier_id: quote.supplier_id,
        po_number: `PO-${1000 + data.orders.length + 1}`,
        status: 'created',
        created_at: new Date().toISOString(),
        buyer_name: data.user?.org_name || 'Buyer',
        supplier_name: quote.supplier_name,
        total_price: quote.total_price,
        currency: quote.currency,
        lead_time_days: quote.lead_time_days,
      }

      setData({
        ...data,
        quotes: data.quotes.map((q) =>
          q.id === quoteId ? { ...q, status: 'accepted' } : q
        ),
        orders: [...data.orders, order],
      })

      return order.id
    },

    // Orders
    orders: data.orders,
    getOrder: (id: string) => data.orders.find((o) => o.id === id),

    // Inventory
    inventory: data.inventory,
    addInventoryItem: (item: InventoryItem) =>
      setData({ ...data, inventory: [...data.inventory, item] }),
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) =>
      setData({
        ...data,
        inventory: data.inventory.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      }),
    deleteInventoryItem: (id: string) =>
      setData({ ...data, inventory: data.inventory.filter((i) => i.id !== id) }),

    // Products (supplier catalog)
    products: data.products,
    addProducts: (products: Product[]) =>
      setData({ ...data, products: [...data.products, ...products] }),
  }
}
