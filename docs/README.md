# ProcureLink

**One platform to request, quote, order, and track stock.**

B2B procurement platform connecting Buyers (restaurants, hotels, SMEs) with Suppliers (wholesalers/distributors). Built for speed, transparency, and mobile-first access.

---

## Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, Postgres, Storage, Row Level Security)
- **Hosting**: Cloudflare Pages (frontend), optional Workers (webhooks/payments)
- **Security**: RLS policies, Cloudflare Turnstile (bot protection)

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works - for Phase C)
- Cloudflare account (for Turnstile keys - for Phase C)

### Run Locally (Phase B - UI Only)

**Note**: Phase B uses mock data only. No Supabase setup required yet!

```bash
# 1. Navigate to the web app
cd apps/web

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev
```

**Open in browser:**
- **http://localhost:3000** - Home page with build status
- **http://localhost:3000/preview** - Component Gallery (live UI playground)

### What You'll See
- ✅ **Component Gallery** at `/preview` - All UI components in action
- ✅ **Buyer Flow** - Create RFQ wizard, view quotes, accept orders
- ✅ **Supplier Flow** - Auto-onboarding wizard, CSV catalog import, quote submission
- ✅ **Inventory Management** - CRUD operations with low-stock alerts
- 🟡 **Coming Soon badges** - On pages where backend isn't wired yet

All data is **mock/in-memory** - perfect for UI testing and demos!

### Setting Up for Phase C (Supabase Wiring)
When you're ready to wire live data:

```bash
# 1. Copy environment template
cd apps/web
cp .env.local.example .env.local

# 2. Edit .env.local with your Supabase credentials
# PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Open **http://localhost:3000/preview** to see the Component Gallery and live UI (no backend required for Phase B).

---

## Developer Commands & Debugging

### Build & Test Commands
```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# Unit tests (Vitest)
npm run test

# Run specific test file
npm run test apps/web/tests/api.rfqs.post.test.ts
```

---

### Database Operations

#### Seeding Dev Data
Location: `infra/supabase/seed.dev.sql`

**How to run**:
1. Create test accounts in Supabase Auth UI:
   - `buyer@test.dev`
   - `supplier@test.dev`
2. Copy their UUIDs from `auth.users` table
3. Replace placeholder UUIDs in `seed.dev.sql`
4. Paste entire SQL into Supabase SQL Editor and run

**Finding User UUIDs**:
```sql
-- In Supabase SQL Editor
SELECT id, email FROM auth.users ORDER BY created_at DESC;
```

#### Schema Changes
1. Edit `infra/supabase/schema.sql`
2. Copy updated section to Supabase SQL Editor
3. Run and verify (check Logs tab for errors)
4. Update `docs/DATA_MODEL.md` with schema changes

#### Viewing Logs
- Supabase Dashboard → Logs → Filter by table/operation
- Look for "permission denied" (RLS blocks) or "violates check constraint"

---

### Testing RLS Policies

**Two-Account Method** (recommended):
1. Open Chrome (Profile 1) → Login as `buyer@test.dev`
2. Open Chrome (Profile 2) → Login as `supplier@test.dev`
3. Test cross-tenant isolation:
   - Buyer creates RFQ → Supplier SHOULD see it (public read)
   - Buyer creates inventory → Supplier SHOULD NOT see it (owner-only)
   - Supplier submits quote → Buyer SHOULD see it (party-based)
   - Supplier tries to edit Buyer's RFQ → SHOULD fail with 403

**RLS Debug Tips**:
- Use Supabase SQL Editor with `SELECT * FROM table WHERE condition` to test policies manually
- Add `RAISE NOTICE` in policy definitions for debugging (Postgres logs)
- Check policy with: `SELECT * FROM pg_policies WHERE tablename = 'rfqs';`

---

### Deployment

#### Cloudflare Pages (Production)
1. Connect Git repo in Cloudflare Pages dashboard
2. Framework preset: **Next.js**
3. Build command: `npm run build`
4. Output directory: `.next` (auto-detected)
5. Set environment variables (prefix client vars with `PUBLIC_`):
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY` (encrypted)

**Branch Previews**: Enabled for PRs (uses same DEV Supabase instance)

#### Manual Deploy with Wrangler
```bash
npm run build
npx wrangler pages deploy ./.next --project-name=procurelink-web
```

---

### Troubleshooting Map

| Error Code | Meaning | Common Causes | Fix |
|------------|---------|---------------|-----|
| **401 Unauthorized** | No valid session | JWT expired, user logged out, missing auth header | Re-login, check `supabase.auth.getUser()` |
| **403 Forbidden** | RLS policy blocked | Cross-tenant access, policy logic error | Verify ownership, check policy with test accounts |
| **400 Bad Request** | Validation failed | Zod schema mismatch, missing required field | Check API payload against schema in `schema.ts` |
| **500 Internal** | Unexpected server error | Database constraint violation, policy syntax error, Supabase down | Check Supabase logs, verify schema constraints |

#### RLS-Specific Debugging
```sql
-- Check if policy exists
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test policy manually (as authenticated user)
SET request.jwt.claims.sub = '<user-uuid>';
SELECT * FROM your_table;
```

#### Zod Validation Errors
```bash
# Example error output
{
  "error": "String must contain at least 2 character(s)",
  "issues": [
    {
      "path": ["title"],
      "message": "String must contain at least 2 character(s)"
    }
  ]
}
```
→ Fix: Check `apps/web/app/api/[resource]/schema.ts` for field requirements

---

## Project Structure
```
procurelink/
├─ apps/web/              # Next.js app (all UI + API routes)
├─ packages/
│  ├─ ui/                 # Shared UI components (optional)
│  └─ lib/                # Supabase client, DAL, types
├─ infra/
│  ├─ supabase/           # Schema, RLS policies, seeds
│  └─ cloudflare/         # Workers, wrangler.toml
└─ docs/                  # Living documentation
   ├─ README.md           # This file
   ├─ ROADMAP.md          # Current phase and tasks
   ├─ DATA_MODEL.md       # ERD + table schemas
   ├─ API.md              # Endpoint specs
   ├─ SECURITY.md         # RLS patterns, auth rules
   └─ CHANGELOG.md        # Conventional commit history
```

---

## Build Status

Current Phase: **Phase B - UI Scaffold (Mock Data)**

| Page/Feature | Status | Notes |
|--------------|--------|-------|
| Component Gallery (`/preview`) | ✅ Complete | Live UI playground |
| Buyer RFQ Wizard | ✅ Complete | Mock state only |
| Supplier Onboarding | ✅ Complete | CSV import preview |
| Inventory CRUD | ✅ Complete | Client-side persistence |
| Auth (Supabase) | ⏳ Coming Soon | Phase C |
| Live Data Wiring | ⏳ Coming Soon | Phase C |
| Payments/Escrow | ⏳ Coming Soon | Phase 2 |

---

## Documentation
- **Product Spec**: `docs/PRODUCT_SPEC.md` - problem, users, KPIs
- **UX/UI**: `docs/UX.md` - flows, components, design system
- **Data Model**: `docs/DATA_MODEL.md` - ERD, RLS policies
- **API**: `docs/API.md` - endpoint contracts, examples
- **Security**: `docs/SECURITY.md` - RLS patterns, rate limits
- **Playbook**: `docs/PLAYBOOK.md` - QA checklists, runbooks
- **Roadmap**: `docs/ROADMAP.md` - phased delivery plan

---

## Contributing
1. Read `docs/ROADMAP.md` for current phase
2. Follow conventional commits: `feat(scope): description`
3. Update `docs/CHANGELOG.md` after each task
4. Test RLS with two accounts before submitting PR
5. Use PR template checklist

---

## License
MIT (or your preferred license)
