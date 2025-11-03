# Security Model

## Overview
ProcureLink uses **Supabase Row Level Security (RLS)** as the primary security enforcement mechanism. All tables have RLS enabled, and policies control read/write access based on authenticated user context.

## Authentication
- **Supabase Auth**: Email + Magic Link + Google OAuth
- **JWT Storage**: Client-side only (httpOnly cookies or localStorage)
- **Session Management**: Supabase SDK handles token refresh
- **Cloudflare Turnstile**: Required on signup and RFQ creation (bot protection)

## RLS Policy Patterns

### Pattern 1: Owner-Based Access
**When to use**: Single-user ownership (profiles, inventory, buyer's RFQs)

**Rationale**: Each resource belongs to one user. Only that user can read/write their own data.

**Example - Inventory Items**:
```sql
-- Read/Write: Only the owner
create policy "inventory_rw_owner" on public.inventory_items 
for all 
using (owner_id = auth.uid()) 
with check (owner_id = auth.uid());
```

**Example - Profile Updates**:
```sql
-- Anyone can read profiles (supplier discovery)
create policy "read_profiles" on public.profiles 
for select 
using (true);

-- Only owner can update their profile
create policy "update_own_profile" on public.profiles 
for update 
using (auth.uid() = id);
```

**Applies to**: `profiles` (update), `inventory_items`, `rfqs` (owner operations)

---

### Pattern 2: Party-Based Access
**When to use**: Multi-party transactions (quotes, orders) where buyer AND supplier need visibility

**Rationale**: Business records involve two parties. Both need read access; write access depends on role and workflow stage.

**Example - Quotes**:
```sql
-- Read: RFQ owner (buyer) + quoting supplier
create policy "quotes_read_buyer_supplier" on public.quotes 
for select 
using (
  exists(
    select 1 from public.rfqs r 
    where r.id = rfq_id 
    and (r.buyer_id = auth.uid() or auth.uid() is not null)
  )
);

-- Write: Only the supplier submitting the quote
create policy "quotes_insert_update_supplier" on public.quotes 
for all 
using (auth.uid() = supplier_id) 
with check (auth.uid() = supplier_id);
```

**Example - Orders**:
```sql
-- Read: Both buyer and supplier involved in the order
create policy "orders_read_parties" on public.orders 
for select 
using (
  buyer_id = auth.uid() or supplier_id = auth.uid()
);

-- Write: Buyer creates order (from accepted quote)
create policy "orders_insert_buyer" on public.orders 
for insert 
with check (buyer_id = auth.uid());
```

**Applies to**: `quotes`, `orders`, `rfq_items` (derived from RFQ owner)

---

## Security Rules

### Environment Variables
- **PUBLIC_SUPABASE_ANON_KEY**: Safe to expose (client-side, RLS-protected)
- **Service-role key**: **NEVER** in client code or Cloudflare Pages env
  - Only in Workers (if needed for admin operations)
  - Bypasses RLS - extreme caution required

### Rate Limiting
- **Writes**: Max 10 writes/min per authenticated user (Supabase)
- **Reads**: Max 100 reads/min per user
- **Anonymous**: 5 reads/min (public RFQ browsing only)

### Data Validation
- **Client**: Zod schemas in API route handlers (`apps/web/app/api/*/schema.ts`)
- **Database**: CHECK constraints on enums (`role`, `status` fields)
- **No trust**: Always validate server-side; client validation is UX only

### Secrets Management
- **.env.local**: Never committed (in .gitignore)
- **Cloudflare Pages**: Encrypted env vars for production keys
- **Logs**: No PII, tokens, or sensitive data in console/logs

### Phone/Email Verification
- Required before first quote submission (supplier)
- Required before order creation (buyer)
- Prevents spam and ensures reachability

---

## Testing RLS Policies

### Local Testing Workflow
1. Create two test accounts in Supabase Auth UI:
   - `buyer@test.dev` (role: buyer)
   - `supplier@test.dev` (role: supplier)

2. Open two browser profiles:
   - Profile A: Login as buyer
   - Profile B: Login as supplier

3. Test cross-tenant isolation:
   - Buyer creates RFQ → verify supplier CAN see it
   - Buyer creates inventory item → verify supplier CANNOT see it
   - Supplier submits quote → verify buyer CAN see it
   - Supplier tries to edit buyer's RFQ → verify 403 error

4. Check Supabase logs for policy violations:
   - Dashboard → Logs → Filter by "permission denied"

### Common RLS Errors
- **403 Forbidden**: Policy blocked the operation (expected for cross-tenant access)
- **401 Unauthorized**: No valid session (auth.uid() is null)
- **500 Internal**: Policy logic error (check SQL syntax)

---

## Incident Response
- **Data breach**: Revoke all JWT tokens via Supabase dashboard
- **Compromised key**: Rotate immediately in Supabase settings + update Pages env
- **RLS bypass detected**: Audit all service-role key usage; disable if unnecessary

---

## Compliance Notes
- **GDPR**: User can request data export/deletion (implement in Phase 3)
- **Data residency**: Supabase region set to EU/US based on target market
- **Audit logs**: Supabase audit logs enabled for compliance tracking
