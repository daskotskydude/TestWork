# ProcureLink Shared Library

This package contains shared code used across the ProcureLink application, including Supabase clients, data access functions, and TypeScript types.

## Structure

```
packages/lib/
├── supabaseClient.ts    # Browser client + TypeScript types
├── supabaseServer.ts    # Server-side client utilities
├── useSupabase.ts       # React hook for client components
├── data.ts              # Data Access Layer (DAL)
└── README.md            # This file
```

## Supabase Clients

### Browser Client (`supabaseClient.ts`)

For use in Client Components when you need the singleton client instance:

```typescript
import { supabase } from '@/lib/supabaseClient';

// Example: Fetching data in a client component
const { data } = await supabase.from('rfqs').select('*');
```

### Client Hook (`useSupabase.ts`)

For use in Client Components with React hooks:

```typescript
'use client';
import { useSupabase } from '@/lib/useSupabase';

function MyComponent() {
  const supabase = useSupabase();
  
  // Use supabase client here
}
```

### Server Clients (`supabaseServer.ts`)

For use in Server Components, Server Actions, and API Routes:

```typescript
// Server Component (page.tsx, layout.tsx)
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export default async function Page() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('rfqs').select('*');
  // ...
}

// Server Action
import { createServerActionClient } from '@/lib/supabaseServer';

export async function createRFQAction(formData: FormData) {
  'use server';
  const supabase = createServerActionClient();
  // ...
}

// API Route
import { createRouteHandlerClient } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const response = new Response();
  const supabase = createRouteHandlerClient(request, response);
  // ...
}
```

## Data Access Layer (DAL)

The DAL provides type-safe, centralized database operations. **Always use DAL functions instead of direct Supabase queries** in your application code.

### Benefits
- **Type Safety**: All functions use TypeScript types
- **RLS Enforcement**: All queries respect Row Level Security policies
- **Centralized Logic**: Query logic in one place
- **Testable**: Easy to mock for unit tests
- **Consistent**: Same patterns across the codebase

### Usage Examples

#### Profiles

```typescript
import { getProfile, upsertProfile } from '@/lib/data';

// Get user profile
const profile = await getProfile(supabase, userId);

// Update profile
const updated = await upsertProfile(supabase, {
  id: userId,
  org_name: 'My Restaurant',
  phone: '+1234567890'
});
```

#### RFQs (Requests for Quotation)

```typescript
import { listRFQs, getRFQ, createRFQ, updateRFQStatus } from '@/lib/data';

// List all RFQs (filtered by RLS - buyers see theirs, suppliers see all open)
const rfqs = await listRFQs(supabase);

// Get single RFQ with items
const rfq = await getRFQ(supabase, rfqId);

// Create new RFQ with items
const { rfq, items } = await createRFQ(
  supabase,
  {
    buyer_id: userId,
    title: 'Weekly Produce Order',
    description: 'Need fresh vegetables',
    closing_date: '2025-01-15'
  },
  [
    { name: 'Tomatoes', qty: 50, unit: 'lbs', notes: 'Organic preferred' },
    { name: 'Lettuce', qty: 30, unit: 'heads' }
  ]
);

// Update RFQ status
const updated = await updateRFQStatus(supabase, rfqId, 'open');
```

#### Quotes

```typescript
import { listQuotes, createQuote, updateQuoteStatus } from '@/lib/data';

// Get all quotes for an RFQ
const quotes = await listQuotes(supabase, rfqId);

// Submit a quote
const quote = await createQuote(supabase, {
  rfq_id: rfqId,
  supplier_id: userId,
  total_price: 450.00,
  notes: 'Delivery available Tuesday',
  valid_until: '2025-01-10'
});

// Accept a quote
const accepted = await updateQuoteStatus(supabase, quoteId, 'accepted');
```

#### Orders

```typescript
import { listOrders, getOrder, createOrder, updateOrderStatus } from '@/lib/data';

// List orders (buyers see theirs, suppliers see where they're the supplier)
const orders = await listOrders(supabase);

// Get order details
const order = await getOrder(supabase, orderId);

// Create order from accepted quote
const order = await createOrder(supabase, {
  rfq_id: rfqId,
  quote_id: quoteId,
  buyer_id: buyerId,
  supplier_id: supplierId,
  total_price: 450.00,
  delivery_date: '2025-01-15',
  delivery_address: '123 Main St'
});

// Update order status
const updated = await updateOrderStatus(supabase, orderId, 'confirmed');
```

#### Inventory

```typescript
import { listInventory, upsertInventory, deleteInventory } from '@/lib/data';

// List all inventory items for buyer
const items = await listInventory(supabase, userId);

// Add or update inventory item
const item = await upsertInventory(supabase, {
  buyer_id: userId,
  name: 'Tomatoes',
  qty: 25,
  unit: 'lbs',
  reorder_level: 10,
  last_order_date: '2025-01-01'
});

// Delete inventory item
await deleteInventory(supabase, itemId);
```

#### Products (Supplier Catalog)

```typescript
import { 
  listProducts, 
  upsertProduct, 
  bulkUpsertProducts, 
  searchProducts 
} from '@/lib/data';

// List all products for a supplier
const products = await listProducts(supabase, supplierId);

// Add/update single product
const product = await upsertProduct(supabase, {
  supplier_id: userId,
  name: 'Organic Tomatoes',
  category: 'Produce',
  unit: 'lb',
  unit_price: 3.50,
  available: true
});

// Bulk upload products (CSV import)
const products = await bulkUpsertProducts(supabase, [
  { supplier_id: userId, name: 'Carrots', category: 'Produce', unit: 'lb', unit_price: 2.00 },
  { supplier_id: userId, name: 'Onions', category: 'Produce', unit: 'lb', unit_price: 1.50 }
]);

// Search products
const results = await searchProducts(supabase, 'tomato');
```

## TypeScript Types

All database table types are exported from `supabaseClient.ts`:

```typescript
import type { 
  Profile, 
  RFQ, 
  RFQItem, 
  Quote, 
  Order, 
  InventoryItem, 
  Product 
} from '@/lib/supabaseClient';

// Use in your components and functions
function MyComponent({ rfq }: { rfq: RFQ }) {
  // TypeScript knows all RFQ fields
}
```

## Error Handling

All DAL functions throw errors on failure. Use try/catch:

```typescript
try {
  const rfqs = await listRFQs(supabase);
  // Success
} catch (error) {
  console.error('Failed to fetch RFQs:', error);
  // Handle error (show toast, etc.)
}
```

Common errors:
- **RLS Policy Violation**: User doesn't have permission (403)
- **Not Found**: Resource doesn't exist (404)
- **Validation Error**: Invalid data (400)
- **Unauthorized**: Not logged in (401)

## Authentication Helpers

Check authentication in server contexts:

```typescript
import { getCurrentUser, requireAuth } from '@/lib/supabaseServer';

// Optional auth (returns null if not logged in)
const user = await getCurrentUser(supabase);
if (user) {
  // User is logged in
}

// Required auth (throws if not logged in)
const user = await requireAuth(supabase);
// User is guaranteed to be logged in here
```

## Best Practices

1. **Always use DAL functions** - Don't write raw Supabase queries in components
2. **Client vs Server** - Use correct client type for your context
3. **Error Handling** - Always wrap DAL calls in try/catch
4. **Type Safety** - Use exported types, avoid `any`
5. **RLS Testing** - Test with multiple logged-in users to verify policies
6. **Performance** - Use indexes (already in schema.sql) for frequently queried fields

## Testing

DAL functions can be mocked for unit tests:

```typescript
import * as data from '@/lib/data';

jest.mock('@/lib/data', () => ({
  listRFQs: jest.fn(),
  createRFQ: jest.fn()
}));

// In test
(data.listRFQs as jest.Mock).mockResolvedValue([mockRFQ1, mockRFQ2]);
```

## Migration Guide

When switching from mock store to real Supabase:

```typescript
// Before (mock store)
const rfqs = getMockRFQs();

// After (DAL)
const supabase = useSupabase();
const rfqs = await listRFQs(supabase);
```

See individual page migration examples in the Phase C tasks.
