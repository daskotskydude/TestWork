# Roadmap & Phased Delivery

## Overview
ProcureLink follows a **documentation-first, UI-first, then API** approach. Each phase has clear acceptance criteria and builds on the previous phase without breaking existing work.

---

## Phase A: Documentation Scaffolding
**Timeline**: 1-2 days  
**Status**: ✅ Complete

### Tasks
- [x] Create all `/docs` files per build plan
- [x] Define data model with RLS policies (`DATA_MODEL.md`)
- [x] Document API contracts (`API.md`)
- [x] Clarify UX flows and component patterns (`UX.md`)
- [x] Security model with policy patterns (`SECURITY.md`)
- [x] Developer commands and debugging guide (`README.md`)
- [x] Initialize `CHANGELOG.md` with conventional commits

### Acceptance Criteria
- All doc files exist with detailed skeletons
- Security patterns (owner-based, party-based) documented with SQL examples
- Component patterns include CSV mapping, DataTable, and FormStepper details
- Developer troubleshooting map included in README

---

## Phase B: UI Scaffold (Mock Data)
**Timeline**: 3-5 days  
**Status**: ✅ Complete

### Philosophy
Build **all UI screens with mock/fixture data** first. This lets us:
- Validate UX flows without backend complexity
- Iterate on design quickly
- Provide live preview for stakeholders
- Ensure accessibility and responsiveness from day 1

**Mock state allowed**: Use in-memory state (React `useState`, Zustand, or fixtures) for data persistence until Phase C.

### Tasks
- [x] Scaffold Next.js app with Tailwind + shadcn/ui
- [x] AppShell with TopNav + SideNav (role-aware)
- [x] Create `/preview` route (Component Gallery for live demos)
- [x] Public pages: Home (`/`), How It Works, Browse Suppliers
- [x] Auth pages: `/buyer-register`, `/supplier-register` (mock signup)
- [x] **Supplier onboarding wizard**:
  - `/supplier/setup?step=profile` (logo, license upload, address)
  - `/supplier/setup?step=catalog` (CSV upload → mapping dialog → preview → publish)
- [x] **Supplier dashboard**:
  - Tabs: Overview, RFQs Inbox, Quotes Sent, Orders, Catalog, Settings
  - Mock RFQs list with "Quote" button → QuoteModal
- [x] **Buyer RFQ wizard**:
  - `/buyer/rfqs/new` (4-step: Details → Items → Budget → Review)
  - Submit creates in-memory RFQ, navigates to detail page
- [x] **Buyer RFQ detail**:
  - `/buyer/rfqs/[id]` shows RFQ header, items, quotes list
  - "Accept Quote" → creates in-memory order, navigates to `/buyer/orders/[id]`
- [x] **Buyer inventory**:
  - `/buyer/inventory` CRUD table with client-side persistence
  - Low-stock badge when `qty <= reorder_level`
- [x] **Buyer orders**:
  - `/buyer/orders/[id]` PO summary with print button
- [x] **Reusable components**:
  - DataTable, FormStepper, QuoteModal, CsvMappingDialog, Uploader
  - KPI cards, EmptyState, StatusBadge, Skeleton loaders, Toast
  - Breadcrumbs, ComingSoonBadge
- [x] Basic route guards (mock: redirect unauthenticated users)
- [x] Polish: empty states, loading skeletons, toasts, responsive design

### Acceptance Criteria
- Full navigation between all routes without backend
- `/preview` shows Component Gallery with all major components
- Supplier can complete onboarding wizard with CSV import (mock)
- Buyer can create RFQ, see mock quotes, accept quote, view order
- Inventory CRUD works client-side
- "Coming Soon" badges visible on pages where backend is needed
- Mobile-responsive (test on 375px width)
- Accessibility: keyboard nav, labels, focus states

---

## Phase C: Supabase Wiring + Auth
**Timeline**: 3-4 days  
**Status**: ✅ Complete

### Philosophy
**"Real data from day 1"** - Wire Supabase immediately, but use DEV seeds to prefill data.

### Environment Split
- **DEV**: Supabase project #1 (seeded with test data)
- **PROD**: Supabase project #2 (clean, real users only)

### Tasks
- [x] Add `.env.local` with Supabase credentials
- [x] Create `packages/lib/supabaseClient.ts`
- [x] Apply schema + RLS policies from `infra/supabase/schema.sql`
- [x] Create test accounts in Supabase Auth:
  - `buyer@test.dev`
  - `supplier@test.dev`
- [x] Run `infra/supabase/seed.dev.sql` (replace UUIDs from test accounts)
- [x] Implement auth pages:
  - Email login + registration (buyer & supplier)
  - Role-based redirects after login
  - Auth context with profile management
- [x] Create Data Access Layer (DAL) in `packages/lib/data.ts`:
  - `listRFQs(supabase)`
  - `getRFQ(supabase, id)`
  - `createRFQ(supabase, data)`
  - `listQuotes(supabase, rfqId)`
  - `createQuote(supabase, data)`
  - `createOrder(supabase, data)`
  - `listInventory(supabase, userId)`
  - `upsertInventory(supabase, data)`
- [x] Add auth guards:
  - Middleware protects buyer/supplier routes
  - Redirects unauthenticated users to login
  - Redirects logged-in users from auth pages to dashboard
- [x] Replace mock state with DAL calls:
  - RFQs list → `listRFQs()`
  - RFQ detail → `getRFQ(id)` + `listQuotes(rfqId)`
  - Inventory → `listInventory(userId)` + `upsertInventory()`
- [x] Add Cloudflare Turnstile to:
  - Signup pages
  - RFQ creation
- [x] Implement auth guards:
  - Redirect unauthenticated users from dashboards
  - Check role (buyer/supplier) and restrict routes
- [x] Add success/error toasts for all mutations
- [x] Test RLS with two logged-in accounts:
  - Buyer creates RFQ → Supplier sees it
  - Buyer creates inventory → Supplier does NOT see it
  - Supplier submits quote → Buyer sees it
  - Supplier tries to edit Buyer's RFQ → 403 error

### Acceptance Criteria
- Auth flow works (email, magic link, Google)
- User can create real RFQ → appears in Supabase table
- Supplier can submit real quote → Buyer sees it
- Buyer can accept quote → Order created in DB
- Inventory CRUD persists to Supabase
- RLS blocks cross-tenant access (verify with two accounts)
- Turnstile blocks bots on signup and RFQ creation

---

## Phase D: API Routes + Validation
**Timeline**: 2-3 days  
**Status**: ✅ Complete

### Tasks
- [x] Add Zod schemas in `apps/web/app/api/[resource]/schema.ts`:
  - `rfqCreateSchema`, `rfqItemSchema`
  - `quoteCreateSchema`
  - `orderCreateSchema`
  - `inventoryUpsertSchema`
- [x] Implement Next.js Route Handlers:
  - `POST /api/rfqs` (create RFQ + items)
  - `GET /api/rfqs` (list public RFQs with filters)
  - `POST /api/quotes` (supplier submits quote)
  - Rate limiting on all endpoints
- [x] Validation:
  - Parse request body with Zod schema
  - Return 400 with error details if invalid
- [x] Auth checks:
  - `supabase.auth.getUser()` at top of each handler
  - Return 401 if no session
- [x] Error handling:
  - Catch RLS errors (403)
  - Catch constraint violations (400)
  - Return 500 for unexpected errors
- [x] Rate limiting middleware (`packages/lib/rate-limit.ts`)
- [x] Manual QA checklist verified

### Acceptance Criteria
- All API endpoints return JSON with correct status codes
- Invalid payloads return 400 with Zod error details
- Unauthenticated requests return 401
- RLS blocks return 403 (not 500)
- Rate limiting active on all endpoints
- Manual QA checklist covers happy path + error cases

---

## Phase E: Deployment Prep
**Timeline**: 1 day  
**Status**: ✅ Complete

### Tasks
- [x] Verify `.env.local.example` lists all required vars
- [x] Document Cloudflare Pages setup in `DEPLOYMENT.md`:
  - Framework: Next.js
  - Build command: `npm run build`
  - Output: `.next`
  - Env vars (with `PUBLIC_` prefix)
- [x] Test production build locally:
  - `npm run build`
  - `npm run start`
  - Verify no build errors
- [x] Check bundle size (< 500KB first load JS)
- [x] Verify no service-role keys in client bundle
- [x] Add comprehensive deployment guide

### Acceptance Criteria
- Production build succeeds without errors
- All env vars documented in DEPLOYMENT.md
- No secrets in client-side code
- Bundle size optimized

---

## Phase F: QA + Polish
**Timeline**: 2-3 days  
**Status**: ✅ Complete

### Tasks
- [x] Run manual QA from `docs/PLAYBOOK.md`:
  - Buyer creates RFQ → Supplier quotes → Buyer accepts → Order exists
  - Inventory low-stock alert triggers
  - RLS blocks unauthorized access
- [x] Fix bugs found during QA (quote/order creation issues resolved)
- [x] Improve loading states:
  - Skeleton loaders on all list pages
  - Button loading spinners during submit
- [x] Improve error handling:
  - User-friendly error messages (no stack traces)
  - Proper HTTP status codes
- [x] Security features:
  - Cloudflare Turnstile on 3 forms
  - Rate limiting middleware
  - RLS policies enforced
- [x] Mobile responsiveness:
  - Test on 375px (iPhone SE)
  - Test on 768px (tablet)
- [x] Enhanced dashboards with colored stat cards
- [x] Email notification templates
- [x] In-app notification system
- [x] Update `docs/ROADMAP.md` with completed items
- [x] Final CHANGELOG update

### Acceptance Criteria
- All manual QA scenarios pass
- No critical bugs (P0/P1)
- Mobile-responsive on 375px width
- Keyboard navigation works on all forms
- ROADMAP updated with Phase 1 completion

---

## Post-MVP (Phase 2+)
**Status**: ⏳ Planned

### Phase 2: Payments & Extended Features
- Stripe Connect integration (escrow)
- Supplier catalog (public product listings)
- CSV export (RFQs, orders, inventory)
- Advanced filters (category, location, price range)

### Phase 3: Integrations & Scale
- Delivery integrations (third-party APIs)
- Analytics dashboard (orders by category, supplier performance)
- Multi-currency support (USD, EUR, QAR)
- Roles & teams (multi-user orgs)
- Email/WhatsApp notifications

### Phase 4: Enterprise Features
- API for third-party integrations
- White-label options
- Advanced procurement workflows (approvals, budgets)
- Reporting & compliance

---

## Milestone Summary

| Phase | Focus | Deliverables | Status |
|-------|-------|--------------|--------|
| **A** | Docs | All `/docs` files with detailed specs | ✅ Complete |
| **B** | UI | Mock UI, Component Gallery, `/preview` | ✅ Complete |
| **C** | Auth + Data | Supabase wiring, RLS testing, DEV seeds | ✅ Complete |
| **D** | API | Route handlers, Zod validation, rate limiting | ✅ Complete |
| **E** | Deploy | Cloudflare Pages, env setup | ✅ Complete |
| **F** | QA | Bug fixes, security, polish | ✅ Complete |

---

## Definition of Done (MVP)
- [x] Buyer can: Auth → Create RFQ → View Quotes → Accept → Order created
- [x] Supplier can: Auth → Auto-onboard → Upload catalog (CSV) → Receive RFQs → Send Quote
- [x] Inventory CRUD works with RLS
- [x] Security features: Turnstile + Rate limiting
- [x] Email notification templates ready
- [x] Deployed on Cloudflare Pages (ready)
- [x] Environment variables documented
- [x] Manual QA checklist passes
- [x] Mobile-responsive (375px+)
- [x] Production build passes

---

## 🎉 MVP STATUS: COMPLETE

All core features implemented and ready for production deployment!

**Next Steps:**
1. Deploy to Cloudflare Pages (follow DEPLOYMENT.md)
2. Create Supabase production project
3. Set up Cloudflare Turnstile production site
4. Configure environment variables
5. Test complete workflow with real users

---

## Notes for AI Agents
- **Always read this file first** before starting work
- Work on phases **in order** (don't jump ahead)
- Update `docs/CHANGELOG.md` after each task with conventional commits
- If a task is unclear, choose the simplest solution consistent with the build plan and proceed
- Mark tasks as `[x]` when completed in this file
