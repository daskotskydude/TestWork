# RFQ Invitations System Setup

## Problem Solved
Previously, all RFQs were visible to ALL suppliers. Now you can:
- ✅ Send RFQ to a **specific supplier only**
- ✅ Broadcast RFQ to **all suppliers** (default behavior)
- ✅ Suppliers only see RFQs they're invited to OR public RFQs

## Database Migration Required

### Step 1: Run SQL Migration
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Open the file: `infra/supabase/migrations/RUNME_add_rfq_invitations_system.sql`
5. Copy the entire SQL content
6. Paste into SQL Editor and click **Run**

### Step 2: Verify
Run this query to verify the table was created:
```sql
SELECT * FROM rfq_invitations LIMIT 1;
```

## How It Works

### For Buyers
1. **Browse Suppliers** page: Click "View Profile" on any supplier
2. In the modal, click **"Send RFQ to This Supplier"**
3. You'll see a blue badge: "Direct RFQ - This RFQ will be sent only to: [Supplier Name]"
4. Fill out the RFQ form normally
5. Submit → Only that supplier can see and quote on it

### For Suppliers
- **Without invitations**: You see ALL open RFQs (broadcast mode)
- **With invitations**: You only see RFQs where you were specifically invited OR public RFQs with no invitations

### Database Schema
```sql
rfq_invitations
  - id: UUID (primary key)
  - rfq_id: UUID (links to rfqs table)
  - supplier_id: UUID (links to profiles table)
  - created_at: timestamp
```

## Testing
1. Login as Buyer
2. Go to Browse Suppliers
3. Click "View Profile" on a supplier
4. Click "Send RFQ to This Supplier"
5. Create and submit the RFQ
6. Login as that Supplier
7. Check Dashboard → You should see the RFQ
8. Login as a DIFFERENT Supplier
9. Check Dashboard → You should NOT see that RFQ

## Backward Compatibility
- ✅ Existing RFQs without invitations remain visible to all suppliers
- ✅ New RFQs created without ?supplier= param are public (old behavior)
- ✅ No breaking changes to existing functionality

## Files Changed
- `apps/web/app/buyer/rfqs/new/page.tsx` - Reads ?supplier= param, creates invitation
- `apps/web/app/browse-suppliers/page.tsx` - Already had the correct link
- `infra/supabase/migrations/RUNME_add_rfq_invitations_system.sql` - Database migration
