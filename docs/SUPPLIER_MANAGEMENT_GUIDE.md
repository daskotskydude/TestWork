# Supplier Management System - User Guide

## Overview
Complete supplier relationship management for buyers, including connection management, communication, history tracking, and targeted RFQ sending.

## Features Implemented

### 1. 📋 My Suppliers Page (`/buyer/connections`)

#### Enhanced Supplier Cards
Each connected supplier now shows:
- **Logo** and company name
- **Contact info**: Email and phone (clickable)
- **Connection date**: When relationship was established
- **Status badge**: Connected (green) or Pending (yellow)

#### Action Buttons on Each Supplier Card:

1. **Send New RFQ** 
   - Creates new RFQ targeted to this supplier only
   - Redirects to RFQ form with supplier pre-selected
   
2. **View History**
   - Opens modal showing complete relationship history:
     * All RFQs sent to this supplier
     * All orders placed with this supplier
     * Click any item to view full details
   
3. **Contact**
   - Opens email client with supplier's email pre-filled
   - Quick way to communicate directly
   
4. **Remove**
   - Removes supplier from your connections
   - Requires confirmation

### 2. 📊 Supplier History Modal

When you click "View History" on any supplier, you see:

#### RFQs Section:
- List of all RFQs sent to this supplier
- Shows: Title, category, date, status
- Click any RFQ to view details
- Button: "Send New RFQ to [Supplier Name]"

#### Orders Section:
- List of all orders placed with this supplier
- Shows: Order ID, related RFQ, date, status, total amount
- Click any order to view details

**Use Cases:**
- Check what you've ordered before from a supplier
- Review pricing history
- See response patterns
- Reorder previous items

### 3. 🎯 Supplier Selection in RFQ Creation

When creating a new RFQ (`/buyer/rfqs/new`):

#### Option 1: Select from My Suppliers
1. Click **"Select from My Suppliers"** button
2. Dropdown shows all your connected suppliers with logos
3. Click on any supplier to select them
4. Blue badge appears: "Direct RFQ - Sending to: [Supplier Name]"
5. RFQ will only be visible to that supplier

#### Option 2: Broadcast to All
- Don't select any supplier
- RFQ will be visible to ALL suppliers (public mode)
- Traditional broadcast behavior

#### Change Selection:
- Click **"Change to Broadcast"** to switch from direct to public
- Click **"Select from My Suppliers"** again to choose different supplier

## Workflows

### Workflow 1: Regular Buyer-Supplier Relationship
```
1. Browse Suppliers → View Profile → Add to My Suppliers
2. Go to Connections → View supplier card
3. Click "Send New RFQ" → Create targeted RFQ
4. Supplier responds with quote
5. Accept quote → Place order
6. Later: Click "View History" to see past RFQs/orders
```

### Workflow 2: Reordering from Known Supplier
```
1. Go to Connections
2. Find supplier you've ordered from before
3. Click "View History"
4. Review previous orders and pricing
5. Click "Send New RFQ to [Supplier]"
6. Fill out form with same/similar items
7. Get updated quote and place order
```

### Workflow 3: Comparing Suppliers
```
1. Go to Connections
2. For Supplier A: View History → note prices and delivery times
3. For Supplier B: View History → note prices and delivery times
4. Decide which supplier to use for next order
5. Send targeted RFQ to chosen supplier
```

## Database Requirements

### ⚠️ IMPORTANT: Run Migration First
Before using these features, you must run the SQL migration:

1. Open Supabase Dashboard → SQL Editor
2. Copy SQL from: `infra/supabase/migrations/RUNME_add_rfq_invitations_system.sql`
3. Run the migration

This creates the `rfq_invitations` table needed for targeted RFQs.

## Technical Details

### How Direct RFQs Work:
1. When you select a supplier during RFQ creation, the system:
   - Creates the RFQ as normal
   - Inserts a record into `rfq_invitations` table
   - Links the RFQ to that specific supplier

2. RLS Policies ensure:
   - Only invited suppliers see the RFQ
   - Other suppliers don't see it in their dashboard
   - Buyer always sees their own RFQs

### How History Tracking Works:
1. **RFQ History**: Queries `rfq_invitations` table to find all RFQs sent to a supplier
2. **Order History**: Queries `orders` table filtered by `supplier_id`
3. Joins with related tables to show complete context

### Backward Compatibility:
- ✅ RFQs created without supplier selection = public (old behavior)
- ✅ Existing RFQs remain visible to all suppliers
- ✅ No breaking changes to existing functionality

## Benefits

### For Buyers:
1. **Better Organization**: All suppliers in one place
2. **Faster Reordering**: See what you ordered before
3. **Price History**: Compare quotes over time
4. **Targeted Communication**: Send RFQs to specific suppliers
5. **Relationship Management**: Track all interactions

### For Suppliers:
1. **Cleaner Dashboard**: Only see relevant RFQs
2. **Better Context**: Know when buyer is returning customer
3. **Direct Relationships**: Build repeat business

## Tips & Best Practices

### 1. Build Your Supplier Network First
- Add suppliers you trust to "My Suppliers"
- This becomes your preferred vendor list

### 2. Use Direct RFQs for:
- Repeat orders with trusted suppliers
- Specialty items only one supplier offers
- Time-sensitive procurement (skip broadcast)

### 3. Use Broadcast RFQs for:
- First-time purchases
- Comparing multiple vendors
- Competitive pricing situations

### 4. Review History Before Reordering:
- Check previous pricing
- Verify past quality/delivery
- Make informed decisions

### 5. Keep Connections Updated:
- Remove suppliers you no longer work with
- Add new reliable suppliers as you find them

## Keyboard Shortcuts & Quick Actions

- **From Connections Page:**
  - Click supplier name → View history
  - Alt+Click "Send RFQ" → Opens in new tab
  
- **From RFQ Creation:**
  - Press `Esc` to close supplier selector
  - Click outside dropdown to cancel selection

## Troubleshooting

### "No RFQs showing in history"
- Check that you sent RFQs using the "Send RFQ" button
- Direct RFQs require the migration to be run first

### "Supplier not in my list"
- Go to Browse Suppliers
- Click "View Profile" on the supplier
- Click "Add to My Suppliers"

### "Can't see supplier selector"
- Make sure you have at least one connected supplier
- Check that connections are in "accepted" status

## Future Enhancements (Coming Soon)

- 📧 In-app messaging with suppliers
- 📊 Supplier performance ratings
- 📈 Spending analytics per supplier
- 🔔 Notifications for supplier responses
- 💾 Save RFQ templates for quick reordering
