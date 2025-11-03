# Supabase Setup Guide

This guide walks you through setting up Supabase for ProcureLink development.

## Prerequisites
- Node.js 18+ installed
- Git repository cloned
- npm packages installed (`npm install`)

## Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in project details:
   - **Name**: `procurelink-dev` (or your preferred name)
   - **Database Password**: Save this securely (you'll need it later)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine for development

5. Click **"Create new project"**
6. Wait 2-3 minutes for project to initialize

## Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (long string starting with `eyJ...`)

## Step 3: Configure Environment Variables

1. In your project root, copy the example file:
   ```bash
   cp apps/web/.env.local.example apps/web/.env.local
   ```

2. Edit `apps/web/.env.local` and fill in your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key-here
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=  # Leave empty for now (Phase D)
   TURNSTILE_SECRET_KEY=             # Leave empty for now (Phase D)
   ```

## Step 4: Apply Database Schema

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open `infra/supabase/schema.sql` from your project
4. Copy the entire contents
5. Paste into the Supabase SQL Editor
6. Click **"Run"** (bottom right)
7. You should see: `Success. No rows returned`

This creates:
- 8 tables: profiles, rfqs, rfq_items, quotes, orders, inventory, products
- Row Level Security (RLS) policies for multi-tenant security
- Indexes for performance
- Triggers for auto-updating timestamps
- Helper functions (e.g., generate_po_number)

## Step 5: Create Test Accounts

We need two test accounts for development: one buyer and one supplier.

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Create **Buyer** account:
   - Email: `buyer@test.dev`
   - Password: `TestBuyer123!`
   - Auto Confirm User: **Yes** ✅
   - Click **"Create user"**

4. Click **"Add user"** again
5. Create **Supplier** account:
   - Email: `supplier@test.dev`
   - Password: `TestSupplier123!`
   - Auto Confirm User: **Yes** ✅
   - Click **"Create user"**

6. **Copy the UUIDs** for both users:
   - In the Users table, you'll see a column called `id`
   - Copy the buyer UUID (looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
   - Copy the supplier UUID

## Step 6: Update Seed File with UUIDs

1. Open `infra/supabase/seed.dev.sql` in your code editor
2. Find the two lines at the top:
   ```sql
   -- Replace these with actual UUIDs from auth.users:
   \set BUYER_UUID 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
   \set SUPPLIER_UUID 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
   ```

3. Replace the UUID strings with your actual UUIDs:
   ```sql
   \set BUYER_UUID 'your-actual-buyer-uuid-here'
   \set SUPPLIER_UUID 'your-actual-supplier-uuid-here'
   ```

## Step 7: Run Seed Data

1. Go back to Supabase dashboard → **SQL Editor**
2. Click **"New query"**
3. Open the updated `infra/supabase/seed.dev.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **"Run"**
7. You should see: `Success. No rows returned`

This creates:
- 2 profiles (buyer and supplier with complete org details)
- 3 sample RFQs from the buyer
- 5 RFQ items across the RFQs
- 2 quotes from supplier on RFQs
- 3 inventory items for the buyer
- 5 products in the supplier's catalog

## Step 8: Verify Setup

### Check Tables
1. In Supabase dashboard, go to **Table Editor**
2. You should see all 8 tables:
   - ✅ profiles (2 rows)
   - ✅ rfqs (3 rows)
   - ✅ rfq_items (5 rows)
   - ✅ quotes (2 rows)
   - ✅ orders (0 rows - empty, will be created when quotes are accepted)
   - ✅ inventory (3 rows)
   - ✅ products (5 rows)

### Test RLS Policies
Let's verify that Row Level Security is working:

1. Go to **SQL Editor** → **New query**
2. Run this query:
   ```sql
   -- Test as buyer - should see their own RFQs only
   SELECT * FROM rfqs WHERE buyer_id = 'your-buyer-uuid';
   
   -- Test inventory access - should only see own inventory
   SELECT * FROM inventory WHERE buyer_id = 'your-buyer-uuid';
   ```

3. You should see results. This confirms:
   - ✅ Buyer can see their RFQs
   - ✅ Buyer can see their inventory

## Step 9: Test in Application

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. The app is still using mock data from localStorage. We'll wire the real Supabase data in the next steps.

## Next Steps

With Supabase set up, we can now:
1. ✅ Database schema applied
2. ✅ Test accounts created
3. ✅ Seed data loaded
4. 🔄 Wire pages to use real Supabase data (via DAL functions)
5. 🔄 Implement auth pages (login, signup, magic link)
6. 🔄 Add auth guards to protect routes
7. 🔄 Test RLS with both accounts

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that `apps/web/.env.local` exists and has correct values
- Restart dev server after creating/editing `.env.local`
- Env vars must start with `NEXT_PUBLIC_` to be available in browser

### Error: "relation does not exist" when running schema
- Make sure you copied the ENTIRE schema.sql file
- Check that the SQL query ran successfully (green success message)
- Try running it again - it's idempotent (safe to run multiple times)

### Error: "RLS policy prevents access"
- This is expected! It means RLS is working
- Make sure you're logged in as the correct user
- Check that the UUID in seed.dev.sql matches the auth.users UUID

### Seed data not appearing
- Verify UUIDs in seed.dev.sql match auth.users IDs exactly
- Check for typos in the UUID strings
- Run the seed script again - it uses UPSERT so it's safe to re-run

### Can't log in with test accounts
- Check that "Auto Confirm User" was enabled when creating accounts
- Password must meet minimum requirements (8+ chars, uppercase, number)
- Try resetting password in Supabase Auth dashboard

## Security Notes

⚠️ **Important for Production**:
- Create a separate Supabase project for production
- Never commit `.env.local` to git (it's in .gitignore)
- Use different passwords for prod accounts
- Enable email confirmation for prod (disable "Auto Confirm User")
- Review and test all RLS policies thoroughly
- Enable 2FA on your Supabase account

## Reference

- Supabase Docs: https://supabase.com/docs
- RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
- Next.js + Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
