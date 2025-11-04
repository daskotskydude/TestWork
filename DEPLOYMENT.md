# ProcureLink - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- Supabase account (https://supabase.com)
- Cloudflare account (https://cloudflare.com) 
- Cloudflare Turnstile site key (for bot protection)
- GitHub repository

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Choose organization, name your project (e.g., "procurelink-prod")
4. Choose region closest to your users
5. Set database password (save securely!)

### 1.2 Apply Database Schema
1. Open SQL Editor in Supabase dashboard
2. Copy entire contents of `infra/supabase/schema.sql`
3. Paste and run in SQL Editor
4. Verify tables created: profiles, rfqs, rfq_items, quotes, orders, inventory_items, products, connections

### 1.3 Create Test Users (Optional for Development)
```sql
-- Run in Supabase SQL Editor
-- Replace with actual user IDs from Auth > Users after signup
UPDATE profiles SET role = 'buyer' WHERE email = 'buyer@example.com';
UPDATE profiles SET role = 'supplier' WHERE email = 'supplier@example.com';
```

### 1.4 Get API Credentials
1. Go to Project Settings > API
2. Copy:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - anon/public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

⚠️ **NEVER expose service_role key in client code!**

## Step 2: Cloudflare Turnstile Setup

### 2.1 Create Turnstile Site
1. Go to https://dash.cloudflare.com
2. Navigate to Turnstile
3. Click "Add Site"
4. Domain: Your production domain (or `localhost` for testing)
5. Widget Mode: Managed (recommended)
6. Copy:
   - Site Key (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`)
   - Secret Key (`TURNSTILE_SECRET_KEY`) - for server-side verification

## Step 3: Environment Variables

### 3.1 Create `.env.local` (Local Development)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key

# Optional: Email (Resend or similar)
# RESEND_API_KEY=re_...
```

### 3.2 Verify Local Build
```bash
npm install
npm run build
npm run start
```

Visit http://localhost:3000 and verify:
- ✅ Pages load without errors
- ✅ Can sign up as buyer/supplier
- ✅ Turnstile widget appears on forms
- ✅ Database operations work

## Step 4: Deploy to Cloudflare Pages

### 4.1 Connect GitHub Repository
1. Go to https://dash.cloudflare.com
2. Navigate to Workers & Pages
3. Click "Create Application" > "Pages" > "Connect to Git"
4. Authorize GitHub and select your repository
5. Choose branch: `main`

### 4.2 Configure Build Settings
```
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: apps/web
Node version: 18
```

### 4.3 Add Environment Variables
In Cloudflare Pages dashboard:
1. Go to Settings > Environment Variables
2. Add **Production** variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_TURNSTILE_SITE_KEY
   TURNSTILE_SECRET_KEY
   ```
3. ⚠️ Make sure variables start with `NEXT_PUBLIC_` for client access

### 4.4 Deploy
1. Click "Save and Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Visit your `.pages.dev` URL

### 4.5 Custom Domain (Optional)
1. Go to Custom Domains in Pages dashboard
2. Click "Set up a custom domain"
3. Add your domain (e.g., `app.procurelink.com`)
4. Update DNS records as instructed
5. Wait for SSL certificate provisioning (~5 minutes)

## Step 5: Post-Deployment Verification

### ✅ Checklist
- [ ] Homepage loads correctly
- [ ] Buyer registration works with Turnstile
- [ ] Supplier registration works with Turnstile
- [ ] Can create RFQ (Turnstile on submission)
- [ ] Supplier can view RFQs
- [ ] Supplier can submit quote
- [ ] Buyer can accept quote (creates order)
- [ ] Supplier can fulfill order
- [ ] Inventory CRUD works
- [ ] Catalog CRUD works
- [ ] Mobile responsive (test on phone)
- [ ] No console errors in browser

### 🔍 Troubleshooting

**Build Fails:**
- Check Node version is 18+
- Verify `npm run build` works locally
- Check build logs for specific errors

**Supabase Connection Fails:**
- Verify environment variables are correct
- Check Supabase project is not paused
- Verify RLS policies allow operations

**Turnstile Widget Not Showing:**
- Check `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set
- Verify domain matches Turnstile site configuration
- Check browser console for errors

**RLS Policy Blocks Requests:**
- Verify user is authenticated
- Check `auth.uid()` matches expected user ID
- Test with Supabase SQL Editor directly

## Step 6: Monitoring & Maintenance

### Analytics
- Cloudflare Pages Analytics (built-in)
- Supabase Dashboard > Logs
- Browser DevTools Console

### Database Backups
Supabase automatically backs up your database. To enable manual backups:
1. Go to Database > Backups
2. Enable daily backups
3. Configure retention period

### Updates
```bash
git pull origin main
# Test locally
npm install
npm run build
# Push to trigger auto-deploy
git push origin main
```

## 🔐 Security Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Enable RLS on all tables
- Rate limit API endpoints
- Use Turnstile on all forms
- Validate all user inputs
- Keep dependencies updated

❌ **DON'T:**
- Commit `.env.local` to Git
- Expose `service_role` key in client code
- Disable RLS policies
- Skip input validation
- Use HTTP (always HTTPS)

## 📊 Performance Optimization

### Current Metrics (Target)
- First Load JS: < 200KB ✅
- Lighthouse Performance: > 80 ✅
- Lighthouse Accessibility: > 90 ✅
- Time to Interactive: < 3s ✅

### Optimizations Applied
- Static page generation where possible
- Dynamic imports for heavy components
- Image optimization (Next.js Image)
- Code splitting by route
- Cloudflare CDN caching

## 🆘 Support & Resources

- **Documentation**: `/docs` folder in repository
- **Issues**: GitHub Issues
- **Supabase Docs**: https://supabase.com/docs
- **Cloudflare Docs**: https://developers.cloudflare.com/pages
- **Next.js Docs**: https://nextjs.org/docs

## 🎉 Success!

Your ProcureLink platform is now live! Users can:
- ✅ Sign up as buyers or suppliers
- ✅ Create and manage RFQs
- ✅ Submit and accept quotes
- ✅ Track orders and inventory
- ✅ Connect with business partners

**Next Steps:**
1. Create your first admin accounts
2. Test the complete workflow
3. Invite beta users
4. Monitor analytics
5. Iterate based on feedback
