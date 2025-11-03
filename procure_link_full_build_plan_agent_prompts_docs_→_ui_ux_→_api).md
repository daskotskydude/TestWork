# ProcureLink – Full Build Plan & Agent Prompts (Docs → UI/UX → API)

_Last updated: November 3, 2025_

## 0) Mission & Scope
**ProcureLink** is a B2B procurement & stock platform connecting Buyers (restaurants, hotels, offices, construction SMEs) and Suppliers (wholesalers/distributors). Phase 1 delivers a clean UI, working RFQ-to-Quote flow, and basic stock management. Backend uses **Supabase** (Auth, DB, Storage, RLS). Frontend hosted on **Cloudflare Pages** (Next.js/React). Optional Cloudflare Worker for webhooks/payments later.

---

## 1) Repository Structure (Monorepo – minimal)
```
procurelink/
├─ apps/
│  └─ web/                 # Next.js app (Cloudflare Pages)
├─ packages/
│  ├─ ui/                  # Shared UI components (optional)
│  └─ lib/                 # Shared utils (supabase client, types)
├─ infra/
│  ├─ supabase/            # SQL schema, policies, seeds
│  └─ cloudflare/          # workers, wrangler.toml, env docs
└─ docs/
   ├─ README.md
   ├─ PRODUCT_SPEC.md
   ├─ UX.md
   ├─ API.md
   ├─ DATA_MODEL.md
   ├─ SECURITY.md
   ├─ PLAYBOOK.md          # runbooks, test plans
   ├─ ROADMAP.md
   ├─ CHANGELOG.md
   └─ AGENT_INTERACTION.md
```

---

## 2) Documentation First – Task List & Templates

### 2.1 Tasks (Docs)
- [ ] Create `docs/README.md` – elevator pitch, stack, quick start.
- [ ] Create `docs/PRODUCT_SPEC.md` – problem, users, use cases, success metrics.
- [ ] Create `docs/UX.md` – IA sitemap, page list, component library, flows.
- [ ] Create `docs/DATA_MODEL.md` – ERD + table fields + RLS policies.
- [ ] Create `docs/API.md` – REST endpoints + parameters + examples.
- [ ] Create `docs/SECURITY.md` – auth, RLS, rate limits, Turnstile.
- [ ] Create `docs/PLAYBOOK.md` – QA checklists, manual test, UAT.
- [ ] Create `docs/ROADMAP.md` – phased delivery, milestones.
- [ ] Create `docs/AGENT_INTERACTION.md` – how to use AI agents in repo.

### 2.2 Doc Skeletons

**docs/README.md**
```
# ProcureLink
One platform to request, quote, order, and track stock.

## Stack
- Frontend: Next.js (App Router), Cloudflare Pages
- Backend: Supabase (Auth, Postgres, Storage, RLS)
- Optional: Cloudflare Worker for webhooks/payments

## Quick Start
1) Copy `.env.local.example` to `.env.local`
2) Fill SUPABASE_URL and SUPABASE_ANON_KEY
3) `npm i && npm run dev`
```

**docs/PRODUCT_SPEC.md**
```
## Problem
SMEs procure via WhatsApp/Excel → slow, error-prone.

## Users & Jobs-To-Be-Done
- Buyer: post RFQ, compare quotes, place order, track stock.
- Supplier: receive RFQs, quote fast, manage orders, win clients.

## Must-Haves (Phase 1)
- RFQ creation, supplier quotes, PO confirmation.
- Auth (email/magic link/Google), profiles.
- Basic stock items + low-stock alerts.

## KPIs
- Time to first quote < 2h
- RFQ→Order conversion > 30%
- Weekly active suppliers > 50
```

**docs/UX.md**
```
## IA / Sitemap
- Public: Home, Browse Suppliers, How it Works, Auth
- Buyer App: Dashboard, RFQs, Quotes, Orders, Inventory, Settings
- Supplier App: Dashboard, RFQs Inbox, Quotes Sent, Orders, Catalog, Settings

## Core Flows
- Buyer: Create RFQ → Receive Quotes → Compare → Convert to PO
- Supplier: See RFQs → Send Quote → Negotiate → Confirm Order

## Components
- NavBar, SideNav, DataTable, Form.Stepper, FileUpload, EmptyStates
- RFQCard, QuoteCard, SupplierCard, InventoryTable, POViewer

## Design System
- Tailwind + shadcn/ui, Lucide icons
- Spacing scale: 4/8/12/16/24
- Radius: 12–16px; Shadows: soft-md
```

**docs/DATA_MODEL.md**
```
## Tables (public schema)
- profiles { id (uuid, pk, = auth.users.id), role: 'buyer'|'supplier', name, org_name, phone, country }
- rfqs { id, buyer_id, title, description, category, budget_min, budget_max, status:'open'|'closed', created_at }
- rfq_items { id, rfq_id, name, sku, qty, unit }
- quotes { id, rfq_id, supplier_id, total_price, currency, lead_time_days, notes, status:'sent'|'accepted'|'rejected', created_at }
- orders { id, rfq_id, quote_id, buyer_id, supplier_id, po_number, status:'created'|'fulfilled'|'cancelled', created_at }
- inventory_items { id, owner_id (buyer), name, sku, qty, unit, reorder_level }

## RLS Policies (pseudocode)
- profiles: everyone can read; user can update own.
- rfqs: public read; only owner can insert/update/delete.
- rfq_items: same as rfqs owner.
- quotes: read: rfq owner + quoting supplier; create/update: quoting supplier.
- orders: read: buyer/supplier involved; write: platform + buyer.
- inventory_items: read/write owner only.
```

**docs/API.md**
```
## Auth
- Supabase Auth (email/magic link/Google). JWT stored client-side.

## REST Endpoints (via Supabase + Edge Routes)
- POST /api/rfqs        → create RFQ
- GET  /api/rfqs        → list public RFQs (filter by category, country)
- GET  /api/rfqs/:id     → RFQ detail + items + quotes (authorized)
- POST /api/quotes       → supplier submits quote
- POST /api/orders       → convert accepted quote to order
- GET  /api/orders/:id   → order detail

### Request/Response Examples
(Include example payloads for RFQ create, Quote submit, Order create)
```

**docs/SECURITY.md**
```
- RLS on all tables. No anonymous writes.
- Cloudflare Turnstile on sign-up and first RFQ.
- Rate limits: max 10 writes/min per user, 100 reads/min.
- Phone/email verification before quote submission.
```

**docs/PLAYBOOK.md**
```
## QA
- Create RFQ → list visible → supplier quote → buyer accepts → order exists
- Unauthorized access blocked by RLS
- Inventory low-stock alert triggers at threshold
```

**docs/ROADMAP.md**
```
Phase 1 (MVP, 2–4 weeks): Docs, Auth, RFQ, Quotes, Orders, Inventory basics
Phase 2: Payments/Escrow, Supplier Catalog, CSV import/export
Phase 3: Delivery integrations, Analytics, Multi-currency, Roles & Teams
```

**docs/AGENT_INTERACTION.md**
```
# Using AI Agents (Sonnet 4.5 / GPT-5 Thinking) in this repo
- Respect repo files; do not write outside workspace.
- Always update docs/CHANGELOG.md with conventional commits.
- Follow tasks in /docs/ROADMAP.md strictly, one by one.
- When unsure, generate best-effort implementation; do not pause work.
```

---

## 3) UI/UX First – Tasks & Acceptance Criteria

### 3.1 UI Tasks (No backend yet)
- [ ] Scaffold Next.js app with Tailwind + shadcn/ui.
- [ ] Layout: TopNav + SideNav; responsive grid; light/dark.
- [ ] Public pages: Home, Browse Suppliers, How It Works, Auth pages.
- [ ] Buyer dashboard: RFQs (list/create/detail), Quotes (list/detail), Orders, Inventory, Settings.
- [ ] Supplier dashboard: RFQs Inbox, Quote composer, Orders, Catalog, Settings.
- [ ] Reusable components: DataTable, Modal, Stepper, Upload, EmptyState, Toast.
- [ ] Mock data via fixtures; state via local store (Zustand) for demo.

### 3.2 Acceptance Criteria
- Navigation between all pages works without backend.
- RFQ create wizard (multi-step) captures: title, description, items, budget, location.
- Supplier quote modal shows RFQ, lets fill price, lead time, notes (mock submit).
- Order detail page displays PO summary view (mock).
- Inventory table supports add/edit/delete rows locally.

---

## 4) API & Data Wiring – Tasks & Acceptance Criteria

### 4.1 Backend Wiring Tasks
- [ ] Add Supabase client and env vars.
- [ ] Implement Auth (email + magic link + Google).
- [ ] Create SQL schema & RLS (infra/supabase/*.sql) and apply.
- [ ] Replace mocks: wire RFQ/Quotes/Orders/Inventory to Supabase.
- [ ] Protect pages with auth guards; profile setup on first login.
- [ ] Add Turnstile on sign-up and RFQ create.

### 4.2 Acceptance Criteria
- Logged-in user can create RFQ; appears in list; view detail.
- Supplier (different account) can view RFQs and submit quote.
- Buyer can accept quote → Order record created with PO number.
- Inventory changes persist per user; RLS prevents cross-tenant access.

---

## 5) Environment Variables & Config
```
# apps/web/.env.local.example
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```
Cloudflare Pages: add the PUBLIC_* keys as project variables. Keep service-role key only in Workers if used.

---

## 6) Supabase SQL (Initial Schema – paste into SQL editor)
```sql
-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('buyer','supplier')) default 'buyer',
  name text,
  org_name text,
  phone text,
  country text,
  created_at timestamptz default now()
);

-- RFQs
create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  budget_min numeric,
  budget_max numeric,
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists public.rfq_items (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid references public.rfqs(id) on delete cascade,
  name text not null,
  sku text,
  qty numeric,
  unit text
);

-- QUOTES
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid references public.rfqs(id) on delete cascade,
  supplier_id uuid references public.profiles(id) on delete cascade,
  total_price numeric,
  currency text default 'QAR',
  lead_time_days int,
  notes text,
  status text default 'sent',
  created_at timestamptz default now()
);

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid references public.rfqs(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  buyer_id uuid references public.profiles(id) on delete set null,
  supplier_id uuid references public.profiles(id) on delete set null,
  po_number text,
  status text default 'created',
  created_at timestamptz default now()
);

-- INVENTORY ITEMS (buyer-owned)
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  sku text,
  qty numeric default 0,
  unit text,
  reorder_level numeric default 0,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_items enable row level security;
alter table public.quotes enable row level security;
alter table public.orders enable row level security;
alter table public.inventory_items enable row level security;

-- Policies
create policy "read_profiles" on public.profiles for select using (true);
create policy "update_own_profile" on public.profiles for update using (auth.uid() = id);

create policy "read_rfqs" on public.rfqs for select using (true);
create policy "insert_rfqs" on public.rfqs for insert with check (auth.uid() = buyer_id);
create policy "update_delete_own_rfqs" on public.rfqs for update using (auth.uid() = buyer_id) with check (auth.uid() = buyer_id);

create policy "rfq_items_rw_owner" on public.rfq_items for all using (
  exists(select 1 from public.rfqs r where r.id = rfq_id and r.buyer_id = auth.uid())
) with check (
  exists(select 1 from public.rfqs r where r.id = rfq_id and r.buyer_id = auth.uid())
);

create policy "quotes_read_buyer_supplier" on public.quotes for select using (
  exists(select 1 from public.rfqs r where r.id = rfq_id and (r.buyer_id = auth.uid() or auth.uid() is not null))
);
create policy "quotes_insert_update_supplier" on public.quotes for all using (auth.uid() = supplier_id) with check (auth.uid() = supplier_id);

create policy "orders_read_parties" on public.orders for select using (
  buyer_id = auth.uid() or supplier_id = auth.uid()
);
create policy "orders_insert_buyer" on public.orders for insert with check (buyer_id = auth.uid());

create policy "inventory_rw_owner" on public.inventory_items for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
```

---

## 7) Agent Prompts – Copy/Paste (VS Code AI / Sonnet 4.5 / GPT‑5 Thinking)

### 7.1 Global System Prompt (put in agent “instructions”)
```
You are an expert full‑stack engineer and product operator. Work inside the repo only. Always:
- Read and update docs before coding.
- Follow ROADMAP tasks in order.
- Create minimal, clean, production‑ready code (Next.js + Tailwind + shadcn/ui).
- Implement accessibility, responsive design, and empty states.
- For data: use Supabase client; never expose service-role keys.
- After each task, write a short CHANGELOG entry with conventional commits.
- If ambiguous, make a best‑effort decision and proceed; do not wait.
```

### 7.2 Phase A – Create All Docs
**Prompt:**
```
Task: Generate all documentation skeletons under /docs per the Build Plan. Use the exact filenames and sections outlined. Do not invent new files. Populate each file with the provided skeleton content and expand with concise, practical details. Create /docs/CHANGELOG.md and add an entry: "docs: scaffold initial documentation set".
```

### 7.3 Phase B – Scaffold UI (No Backend)
**Prompt:**
```
Task: In apps/web, scaffold a Next.js (App Router) app with Tailwind and shadcn/ui. Implement the UI pages and components described in docs/UX.md. Use mock data/fixtures only. Ensure navigation flows work, RFQ create wizard exists, Supplier quote modal works (mock), Orders and Inventory tables render. Add basic theming, responsive layout, and empty states. Update CHANGELOG with "feat(web): scaffold UI screens without backend".
```

### 7.4 Phase C – Wire Supabase Auth + Data
**Prompt:**
```
Task: Integrate Supabase. Add env vars, supabase client, and auth pages (email + magic link + Google). Create SQL from docs/DATA_MODEL.md in infra/supabase/schema.sql and RLS policies. Replace mock data with live calls: RFQs, RFQ items, Quotes, Orders, Inventory. Implement protected routes and profile onboarding. Add Cloudflare Turnstile to signup and RFQ create. Update CHANGELOG with "feat(api): supabase schema + RLS + data wiring".
```

### 7.5 Phase D – API Endpoints & Testing
**Prompt:**
```
Task: Add /api routes for RFQs, Quotes, Orders using Next.js route handlers. Validate inputs (zod), return JSON. Write basic unit tests for route handlers and a manual QA checklist in docs/PLAYBOOK.md. Update CHANGELOG with "feat(api): route handlers + tests".
```

### 7.6 Phase E – Deployment & Env
**Prompt:**
```
Task: Prepare deployment to Cloudflare Pages. Add .env.local.example, document required variables in README. Ensure public keys prefixed with PUBLIC_. Provide a short DEPLOYMENT.md section in README explaining Cloudflare Pages setup and Supabase connection. Update CHANGELOG with "chore(deploy): cloudflare pages configuration".
```

### 7.7 Phase F – Polishing & Acceptance
**Prompt:**
```
Task: Run through docs/PLAYBOOK.md QA scenarios end-to-end. Fix bugs. Improve loading states, error handling, and toasts. Ensure RLS prevents cross-tenant access by testing two accounts (buyer vs supplier). Update docs/ROADMAP.md with completed items and next steps. Update CHANGELOG with "fix: qa fixes and polish".
```

---

## 8) Checklists

### Pre‑commit
- [ ] Lint passes, typecheck clean
- [ ] Env vars resolved
- [ ] No service-role key in client code
- [ ] Docs updated

### MVP Definition of Done
- [ ] Buyer can create RFQ; supplier can quote; buyer converts to order
- [ ] Inventory CRUD per buyer with RLS
- [ ] Auth (email + Google + magic link)
- [ ] Turnstile enabled
- [ ] Deployed to Cloudflare Pages

---

## 9) Next Steps (after MVP)
- Payments/Escrow (Stripe Connect)
- Supplier catalog + CSV import
- Delivery adapters (optional)
- Analytics (orders by category, quote speed)
- Teams/roles per organization

---

---

## 10) UI Flow – Auto-Onboarding (Supplier) & Buyer

> Goal: Agent can scaffold **all screens** without backend, using fixtures and state-only flows. Then we’ll wire to Supabase.

### 10.1 Supplier Auto‑Onboarding – Screens & Routes
1) **/supplier-register**  
   - **Components:** `AuthCard`, `SignupForm`, `TurnstileWidget`.  
   - **Fields:** business_name, contact_name, email, phone/whatsapp, password (or Google), business_category (multi-select), country, city.  
   - **Actions:** `Sign up` (mock), `Continue with Google` (mock).  
   - **Accept:** on submit → navigate to `/supplier/setup` with query `?step=profile`.

2) **/supplier/setup?step=profile**  
   - **Components:** `StepHeader`, `BusinessProfileForm`, `Uploader` (logo, trade_license).  
   - **Fields:** logo (image), trade_license (image/pdf), address_line, delivery_areas (tags).  
   - **Actions:** `Save & Continue` → `/supplier/setup?step=catalog`.

3) **/supplier/setup?step=catalog**  
   - **Components:** `UploadCard`, `CsvMappingDialog`, `ProductsPreviewTable`.  
   - **Features:** upload CSV/XLSX → map columns (name, unit, price, stock, category, moq) → preview.  
   - **Actions:** `Publish Catalog` → sets `status=active` (mock) → `/supplier/dashboard`.

4) **/supplier/dashboard**  
   - **Tabs:** `Overview`, `RFQs Inbox`, `Quotes Sent`, `Orders`, `Catalog`, `Settings`.  
   - **Overview Widgets:** `KPI` (RFQs today, Quotes sent, Orders won, Conversion).  
   - **RFQs Inbox:** table of open RFQs (fixtures) → `Quote` modal (price, lead_time, notes).  
   - **Catalog:** CRUD table for products (inline edit).  
   - **Settings:** profile data, notifications toggle (email/whatsapp), verification badge status.

### 10.2 Buyer – Core Screens & Routes
1) **/** (Home – public)  
   - Hero, value props, `How it works`, `Browse Suppliers`, `Create RFQ` CTA.

2) **/buyer-register**  
   - Simple signup or Google; on success → `/buyer/dashboard`.

3) **/buyer/dashboard**  
   - **Tabs:** `RFQs`, `Quotes`, `Orders`, `Inventory`, `Suppliers`, `Settings`.

4) **/buyer/rfqs/new** (RFQ Wizard)  
   - Steps: **Details** (title, description, category, country/city), **Items** (dynamic rows: name, qty, unit, target_price optional), **Budget** (min/max), **Review**.  
   - Submit → `/buyer/rfqs/:id` (mock id) and show success toast.

5) **/buyer/rfqs/:id**  
   - RFQ header, items, incoming quotes list (fixtures), `Accept Quote` → create mock order → link to `/buyer/orders/:id`.

6) **/buyer/orders/:id**  
   - PO summary (supplier, items, totals, lead time), status timeline.

7) **/buyer/inventory**  
   - Inventory table (CRUD local state), `Low‑stock` badge when qty ≤ reorder_level.

### 10.3 Navigation & Layout
- **TopNav:** brand, search, theme toggle, user menu.  
- **SideNav:** context-aware (Buyer vs Supplier).  
- **Breadcrumbs:** show on inner pages.  
- **Toasts:** all mutations give feedback.

### 10.4 Component Inventory
- **Layout:** `AppShell`, `TopNav`, `SideNav`, `PageHeader`, `KPI`, `EmptyState`.
- **Forms:** `FormStepper`, `Field.Text`, `Field.Number`, `Field.Select`, `Field.MultiSelect`, `Uploader`, `TurnstileWidget`.
- **Tables:** `DataTable` (sorting, pagination), `ProductsTable`, `RFQTable`, `QuotesTable`, `OrdersTable`, `InventoryTable`.
- **Modals:** `QuoteModal`, `CsvMappingDialog`, `ConfirmDialog`.

### 10.5 Fixtures (Mock Data Seeds)
- `fixtures/rfqs.json` – 10 items across categories & cities.  
- `fixtures/quotes.json` – 2–3 quotes per RFQ.  
- `fixtures/products.csv` – sample supplier catalog.  
- `fixtures/inventory.json` – buyer inventory examples.

### 10.6 Acceptance Criteria (UI Only)
- Full navigation between all routes without backend.  
- Supplier auto‑onboarding path completes and lands at dashboard with catalog visible.  
- Buyer RFQ wizard creates a mock RFQ and shows quotes from fixtures.  
- Quote modal validates fields; Accept Quote generates mock order page.  
- Inventory CRUD persists to client store until refresh.

---

## 11) Agent Commands – UI Flow (Step‑by‑Step, Copy/Paste)

> Use these **exact prompts** in Sonnet 4.5 / GPT‑5 Thinking (VS Code). Run them **in order**.

### 11.1 Scaffold & Design System
```
Task: In apps/web, scaffold Next.js (App Router) with Tailwind and shadcn/ui. Add a clean AppShell with TopNav + SideNav, responsive and dark-mode ready. Create base pages: /, /buyer-register, /buyer/dashboard, /supplier-register, /supplier/setup, /supplier/dashboard. Add a shared components folder with placeholders for KPI, DataTable, FormStepper, Uploader, QuoteModal, CsvMappingDialog, EmptyState, Toast. Commit: feat(web): scaffold app shell and base routes.
```

### 11.2 Supplier Registration & Setup Wizard
```
Task: Implement /supplier-register and /supplier/setup wizard. Step=profile (logo, trade_license upload, address, delivery areas) and step=catalog (CSV/XLSX upload → mapping dialog → preview table → publish). Use fixtures/products.csv and implement a CSV parser (client-side). After Publish, route to /supplier/dashboard with a success toast. Commit: feat(web-supplier): auto-onboarding wizard with CSV import preview.
```

### 11.3 Supplier Dashboard & RFQs Inbox
```
Task: Build /supplier/dashboard with tabs Overview, RFQs Inbox, Quotes Sent, Orders, Catalog, Settings. Use fixtures/rfqs.json and fixtures/quotes.json to populate RFQs Inbox and Quotes Sent. Implement QuoteModal (fields: total_price, currency, lead_time_days, notes) with validation and optimistic add to fixtures state. Commit: feat(web-supplier): dashboard tabs and quoting flow (mock).
```

### 11.4 Buyer RFQ Wizard & Detail
```
Task: Create /buyer/rfqs/new as a 4-step wizard (Details, Items, Budget, Review). Persist draft in local store. On submit, push a new RFQ into fixtures/rfqs.json (in-memory) and navigate to /buyer/rfqs/:id showing RFQ header, items, and quotes list (from fixtures). Add Accept Quote → create mock order and navigate to /buyer/orders/:id. Commit: feat(web-buyer): rfq wizard, rfq detail with quotes, accept-to-order (mock).
```

### 11.5 Inventory & Orders UI
```
Task: Implement /buyer/inventory and /buyer/orders/:id. InventoryTable supports add/edit/delete rows with basic validation and client-side persistence. Orders page shows PO summary, status timeline, and print-to-PDF button (client). Commit: feat(web-buyer): inventory CRUD and order detail screens.
```

### 11.6 Polish & QA (UI‑only)
```
Task: Add breadcrumbs, empty states, loading skeletons, and toasts across flows. Ensure mobile responsiveness for key screens. Add basic route guards (mock): redirect unauthenticated users from dashboards to register pages. Update docs/UX.md to reflect final component names. Commit: fix(web): polish ui flows and responsiveness.
```

---

---

## 12) Best Practice: "Real Data from Day 1" (Dev) — with Safe Seeds
> Build the UI **against Supabase immediately** (no local fixtures), but prefill your **Dev** database with sample data using a seed script. You get a live, realistic app while keeping production clean.

### 12.1 Dev/Preview/Prod Environments
- **DEV**: Supabase project #1 (seeded with sample data). Cloudflare Pages branch = `dev`. Public anon key okay.
- **PREVIEW**: Auto-deploy PRs; temporary Supabase schema (optionally reuse DEV DB).
- **PROD**: Supabase project #2 (no seeds, real users only). Strict email verification.

### 12.2 Data Access Layer (DAL) Toggle
Create a tiny DAL so the UI never calls Supabase directly from components.
```
// packages/lib/data.ts
export const dataMode = import.meta.env.PUBLIC_DATA_MODE || 'supabase' // 'supabase'|'mock'
```
- Default `supabase` (real). If something breaks, switch to `mock` quickly.

### 12.3 Seeding Strategy (Dev Only)
- One SQL file: `infra/supabase/seed.dev.sql`
- Creates 2 users (buyer/supplier), profiles, 8 RFQs, 16 RFQ items, 10 quotes, 1 order, and a small catalog & inventory.
- Run in Supabase SQL editor once, or via CLI later.

### 12.4 RLS-friendly Seeding
Use **auth.uid()** constraints carefully. For seeds, insert into `auth.users` is not allowed directly; create users via **Supabase Auth** (magic link) or insert with `pg_net` disabled policies workaround. For MVP, do this:
1) Create two test accounts via the Supabase Auth UI: 
   - buyer: `buyer@test.dev`  
   - supplier: `supplier@test.dev`
2) Copy their UUIDs from `auth.users` to use in seed script placeholders.

### 12.5 Example Seed (paste in SQL editor after creating test users)
```sql
-- Replace with your real UUIDs from auth.users
-- SELECT id,email FROM auth.users ORDER BY created_at DESC;
-- buyer_id: 00000000-0000-0000-0000-000000buyer1
-- supplier_id: 00000000-0000-0000-0000-0000supplr1

-- PROFILES
insert into public.profiles (id, role, name, org_name, phone, country)
values
  ('00000000-0000-0000-0000-000000buyer1','buyer','Chef Ali','Al Markhiya Grill','97450123456','Qatar')
, ('00000000-0000-0000-0000-0000supplr1','supplier','Gulf Foods','Gulf Foods Trading','97450987654','Qatar')
on conflict (id) do nothing;

-- RFQs
insert into public.rfqs (buyer_id,title,description,category,budget_min,budget_max,status)
values
  ('00000000-0000-0000-0000-000000buyer1','Chicken Breast 20kg','Fresh or frozen, weekly supply','Food',500,1200,'open'),
  ('00000000-0000-0000-0000-000000buyer1','Basmati Rice 50kg','1121 extra long grain','Food',350,600,'open'),
  ('00000000-0000-0000-0000-000000buyer1','Takeaway Cups 12oz x1000','With lids, heat resistant','Packaging',200,400,'open');

-- RFQ Items (map to first RFQ)
insert into public.rfq_items (rfq_id,name,sku,qty,unit)
select id,'Chicken Breast','CHKN-BRST',20,'kg' from public.rfqs where title='Chicken Breast 20kg' limit 1;

-- QUOTES (supplier to RFQ 1 & 2)
insert into public.quotes (rfq_id,supplier_id,total_price,currency,lead_time_days,notes,status)
select id,'00000000-0000-0000-0000-0000supplr1',1100,'QAR',2,'Fresh, Halal certified','sent' from public.rfqs where title='Chicken Breast 20kg' limit 1;

insert into public.quotes (rfq_id,supplier_id,total_price,currency,lead_time_days,notes,status)
select id,'00000000-0000-0000-0000-0000supplr1',520,'QAR',3,'1121 Basmati, 10kg bags','sent' from public.rfqs where title='Basmati Rice 50kg' limit 1;

-- ORDERS (accept quote for Chicken)
insert into public.orders (rfq_id,quote_id,buyer_id,supplier_id,po_number,status,created_at)
select q.rfq_id, q.id, '00000000-0000-0000-0000-000000buyer1', '00000000-0000-0000-0000-0000supplr1', 'PO-0001', 'created', now()
from public.quotes q
join public.rfqs r on r.id = q.rfq_id
where r.title='Chicken Breast 20kg'
limit 1;

-- INVENTORY for Buyer
insert into public.inventory_items (owner_id,name,sku,qty,unit,reorder_level)
values ('00000000-0000-0000-0000-000000buyer1','Cooking Oil 10L','OIL-10L',2,'can',2),
       ('00000000-0000-0000-0000-000000buyer1','Gloves (100pcs)','GLV-100',5,'box',3);

-- SUPPLIER CATALOG (create table if you add it later)
-- example table (optional for MVP)
-- create table if not exists public.supplier_products (
--   id uuid primary key default gen_random_uuid(),
--   supplier_id uuid references public.profiles(id) on delete cascade,
--   name text, unit text, price numeric, stock numeric, category text, moq numeric default 1
-- );
-- insert into public.supplier_products (supplier_id,name,unit,price,stock,category)
-- values ('00000000-0000-0000-0000-0000supplr1','Chicken Breast','kg',55,200,'Food');
```

### 12.6 UI Wiring (Read from Supabase Now)
- Replace fixture imports with DAL functions:
```
// packages/lib/data.ts
export async function listRFQs(supabase) {
  return await supabase.from('rfqs').select('*').order('created_at',{ascending:false})
}
export async function listRFQQuotes(supabase, rfqId) {
  return await supabase.from('quotes').select('*').eq('rfq_id', rfqId)
}
```
- In pages, call these on client (MVP) or server components later.

### 12.7 Test Accounts & QA
- Login as **buyer@test.dev** → create RFQ → see in list.
- Login as **supplier@test.dev** (different browser profile) → view RFQs → send Quote → buyer accepts → Order created.
- Verify RLS: supplier cannot edit buyer inventory; buyer cannot see other suppliers’ quotes for other RFQs.

---

## 13) Agent Commands — Real Data Wiring (Copy/Paste)

### 13.1 Create Dev Supabase & Env
```
Task: Create a .env.local.example in apps/web with PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY. Add a supabase client in packages/lib/supabaseClient.ts. Update README with setup steps. Commit: chore(env): supabase env and client.
```

### 13.2 Apply Schema & RLS
```
Task: Add infra/supabase/schema.sql from docs (tables + RLS). Provide run instructions in docs/README.md. Commit: feat(db): schema and rls.
```

### 13.3 Create Test Users & Seed Data
```
Task: In Supabase Auth UI, create buyer@test.dev and supplier@test.dev. Copy their UUIDs, paste into infra/supabase/seed.dev.sql, and execute in SQL editor. Commit: chore(db): dev seed data.
```

### 13.4 Replace Mocks with Live Queries
```
Task: Replace fixture imports with DAL functions that call Supabase (listRFQs, getRFQ, listQuotes, createQuote, createOrder, listInventory, upsertInventory). Ensure UI loads from live data in DEV. Commit: feat(data): live supabase wiring for rfqs/quotes/orders/inventory.
```

### 13.5 Guarded Actions & Toasts
```
Task: Add auth guards: dashboards require login. Add success/error toasts for create RFQ, send quote, accept quote. Commit: fix(ux): guards and feedback for live actions.
```

### 13.6 Dev/Prod Split
```
Task: Document DEV vs PROD setup in README. Add PUBLIC_DATA_MODE flag and default to 'supabase'. For emergency demos, allow 'mock' mode. Commit: docs: env modes and deployment notes.
```

---

---

## 14) Global Agent Instructions (Sonnet 4.5 / GPT‑5 Thinking)

> Copy this into your VS Code agent’s **System/Project Instructions**. These rules apply across the whole repo.

### 14.1 Mission & Scope
- **Mission:** Implement *exactly* what is defined in **this build plan**. Deliver a working MVP: **Docs → UI/UX → Supabase wiring → API routes → Deploy**.
- **Out of scope:** Do **not** invent new features, files, or folders that are not listed here.

### 14.2 Golden Rules (Do / Don’t)
**Do**
1. Read `/docs/*` and follow **ROADMAP** tasks **in order**.
2. Edit only files and folders specified in this plan.
3. Keep code **minimal, clean, accessible, responsive**.
4. Use **Supabase** for data, **Cloudflare Pages** for hosting.
5. Update `docs/CHANGELOG.md` with **conventional commits** after each task.
6. Add comments where non‑obvious. Prefer small, composable components.

**Don’t**
- Don’t create extra docs/tests beyond what this plan specifies.
- Don’t add libraries not required by this plan.
- Don’t expose secrets; never commit service‑role keys.
- Don’t block progress waiting for clarification; make a best‑effort implementation and continue.

### 14.3 File & Folder Controls
- Work **only** inside:
  - `apps/web` (Next.js app)
  - `packages/ui` (optional shared UI)
  - `packages/lib` (supabase client, DAL, types)
  - `infra/supabase` (schema.sql, seed.dev.sql)
  - `infra/cloudflare` (workers later)
  - `docs/*` (as defined)
- **Prohibited:** Any new top‑level folders, playgrounds, sample apps, or boilerplate READMEs not listed here.

### 14.4 Tech Stack & Standards
- **Frontend:** Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Lucide icons.
- **State:** Minimal local state; prefer server data from Supabase. Temporary client store allowed for UI‑only mocks.
- **APIs:** Next.js Route Handlers. Validate with **zod** when endpoints are added.
- **Accessibility:** Semantic HTML, labels, keyboard focus, aria where needed.
- **Performance:** Lazy‑load heavy components; avoid client‑wide state.
- **Styling:** Utility‑first Tailwind; keep CSS small; consistent spacing (4/8/12/16/24), radius (12–16px).

### 14.5 Security & Privacy
- Supabase RLS must guard all tables. No anonymous writes.
- Use **Cloudflare Turnstile** on sign‑up and RFQ create (where specified).
- No PII in logs. Do not print tokens.
- Service‑role keys live **only** in Workers (if/when used), never in client.

### 14.6 Working Loop (Each Task)
1. Read related section in `/docs` and acceptance criteria.
2. Implement minimally; prefer existing components.
3. Test locally; ensure navigation and UX flows work.
4. Update `/docs/CHANGELOG.md` with a conventional commit.
5. Move to the **next task in ROADMAP**.

### 14.7 Definition of Done (MVP)
- Buyer can: **Auth → Create RFQ → View Quotes → Accept → Order created**.
- Supplier can: **Auth → Auto‑onboard → Upload catalog (CSV) → Receive RFQs → Send Quote**.
- Inventory CRUD works per buyer with RLS.
- Deployed on Cloudflare Pages; environment variables documented.

### 14.8 Error Handling & Empty States
- Show inline errors with helpful text.
- Use skeletons/placeholders for loading.
- Provide **EmptyState** components for lists with no data.

### 14.9 Commits & Docs
- Use **conventional commits** (e.g., `feat(web): rfq wizard` / `fix(api): rls policy`) and append a short note in `/docs/CHANGELOG.md`.
- Keep `/docs/README.md` and `/docs/ROADMAP.md` updated when steps complete.

### 14.10 Ambiguity Policy
- If a requirement is unclear, choose the **simplest reasonable** approach consistent with this plan. Note the decision in `CHANGELOG.md` and proceed.

### 14.11 Env & Secrets
- `.env.local.example` must list **PUBLIC_SUPABASE_URL**, **PUBLIC_SUPABASE_ANON_KEY**, **NEXT_PUBLIC_TURNSTILE_SITE_KEY**, **TURNSTILE_SECRET_KEY**.
- Never commit real secrets. For local dev, use `.env.local` only.

### 14.12 Testing (MVP Level)
- Implement light tests **only** when the plan calls for them (route handlers). No snapshot or e2e suites unless specified.

### 14.13 Deployment
- Prepare Cloudflare Pages config and README deploy notes. Ensure **PUBLIC_** keys only on the client. Service‑role keys must not appear in client bundles.

---

### 14.14 Copy‑Paste Agent Prompt (Put in VS Code Agent Now)
```
Role: Senior full‑stack engineer executing a predefined build plan.

Rules:
- Work strictly within the files/folders and tasks defined in "ProcureLink – Full Build Plan & Agent Prompts (Docs → UI/UX → API)".
- Do not create any extra docs, tests, or folders beyond what the plan lists.
- Follow ROADMAP order. After each task, write a conventional commit into docs/CHANGELOG.md.
- Prioritize clean, minimal, production‑ready code in Next.js + Tailwind + shadcn/ui.
- Use Supabase for auth/data/storage with RLS; Cloudflare Pages for deploy.
- If unclear, choose the simplest reasonable solution, document the decision in CHANGELOG, and proceed.
- Never expose secrets; keep service‑role keys server‑side only.

Objective today: Complete Phase A (Docs), then Phase B (UI scaffolding), then Phase C (Supabase wiring) as described in the plan, stopping only at acceptance criteria.
```

---

---

## 15) Cloudflare Pages Deploy – Environment Details

### 15.1 Minimal Deploy (Pages)
- Connect Git repo → Framework: **Next.js** → Build command: `npm run build` → Output: `.next` (auto-detected).
- Set project variables (Pages → Settings → Environment Variables):
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY` (as **Encrypted**)
  - Optional: `PUBLIC_DATA_MODE=supabase`
- Branch previews: enable for PRs.

### 15.2 CLI Deploy (Wrangler)
```
# optional; useful for previews or CI
npm run build
npx wrangler pages deploy ./.next --project-name=procurelink-web
```

### 15.3 Common gotchas
- Ensure keys that must be client‑side start with **PUBLIC_**.
- Service‑role keys **must not** be used in client or Pages env. Put them only in Workers if added later.

---

## 16) Testing Strategy (Light, Targeted)

### 16.1 Frameworks
- **Vitest** for unit tests
- **@testing-library/react** for component behavior (only for critical forms/tables)

### 16.2 What to test (MVP)
- **Route handlers**: payload validation, RLS errors surface gracefully, success paths
- **Critical UI**: RFQ wizard field validation; QuoteModal form submission logic

### 16.3 Examples
**Install**
```
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom zod
```

**apps/web/tests/api.rfqs.post.test.ts**
```ts
import { describe, it, expect } from 'vitest'
import { rfqCreateSchema } from '@/app/api/rfqs/schema'

describe('rfqCreateSchema', () => {
  it('rejects missing title', () => {
    const r = rfqCreateSchema.safeParse({ description: 'x' })
    expect(r.success).toBe(false)
  })
  it('accepts minimal valid payload', () => {
    const r = rfqCreateSchema.safeParse({
      title: 'Chicken', category: 'Food', items: [{ name: 'Breast', qty: 20, unit: 'kg' }]
    })
    expect(r.success).toBe(true)
  })
})
```

---

## 17) Component Patterns (Concrete Examples)

### 17.1 FormStepper
```tsx
// components/FormStepper.tsx
export function FormStepper({ steps, active, onNext, onBack }) {
  /* render dots/titles; call onNext/onBack */
}
```
```tsx
// usage in /buyer/rfqs/new
<FormStepper steps={["Details","Items","Budget","Review"]} active={step} onNext={next} onBack={back} />
```

### 17.2 DataTable (generic)
```tsx
// components/DataTable.tsx
export function DataTable({ columns, rows, onRowClick }) {
  // render header + rows with sorting; call onRowClick(row)
}
```
```tsx
<DataTable
  columns={[{key:'title',label:'RFQ'},{key:'category',label:'Category'},{key:'created_at',label:'Created'}]}
  rows={rfqs}
  onRowClick={(r)=>router.push(`/buyer/rfqs/${r.id}`)}
/>
```

### 17.3 QuoteModal
```tsx
// components/QuoteModal.tsx
import { z } from 'zod'
const quoteSchema = z.object({ total_price: z.number().positive(), currency: z.string().min(1), lead_time_days: z.number().int().min(0), notes: z.string().optional() })
```
```tsx
<QuoteModal rfq={rfq} onSubmit={async (v)=>{
  const parsed = quoteSchema.parse(v)
  await createQuote(parsed)
  toast.success('Quote sent')
}}/>
```

### 17.4 CSV Mapping Dialog (catalog import)
```tsx
// accepts parsed CSV headers; map to { name, unit, price, stock, category, moq }
```

---

## 18) API Patterns – Route Handlers with Zod

### 18.1 Schemas
```ts
// apps/web/app/api/rfqs/schema.ts
import { z } from 'zod'
export const rfqItemSchema = z.object({ name: z.string().min(1), sku: z.string().optional(), qty: z.number().positive(), unit: z.string().min(1) })
export const rfqCreateSchema = z.object({ title: z.string().min(2), description: z.string().optional(), category: z.string().min(1), budget_min: z.number().optional(), budget_max: z.number().optional(), items: z.array(rfqItemSchema).min(1) })
```

### 18.2 Handler
```ts
// apps/web/app/api/rfqs/route.ts
import { NextResponse } from 'next/server'
import { rfqCreateSchema } from './schema'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { data, error } = await supabase.auth.getUser()
    if (!data?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const parsed = rfqCreateSchema.parse(body)
    const { data: rfq, error: e1 } = await supabase.from('rfqs').insert({
      buyer_id: data.user.id,
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      budget_min: parsed.budget_min,
      budget_max: parsed.budget_max,
    }).select('*').single()
    if (e1) throw e1

    const items = parsed.items.map(i => ({ ...i, rfq_id: rfq.id }))
    const { error: e2 } = await supabase.from('rfq_items').insert(items)
    if (e2) throw e2

    return NextResponse.json({ rfq })
  } catch (err: any) {
    const msg = err?.issues?.[0]?.message || err.message || 'Bad Request'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
```

### 18.3 Error Patterns
- 400 → validation failed (zod)
- 401 → unauthenticated
- 403 → blocked by RLS / policy
- 500 → unexpected

---
You are the senior full-stack engineer for the “ProcureLink” project. Work ONLY inside the files/folders and tasks defined by the canvas doc “ProcureLink – Full Build Plan & Agent Prompts (Docs → UI/UX → API)”. Do not create any extra docs, tests, or folders not listed there.

Objective for this run:
1) Expand docs per feedback.
2) Prepare repo hygiene files.
3) Scaffold UI (Phase B) with a /preview page so I can SEE the UI live while you work.
4) Keep unfinished areas visible with “Coming Soon” placeholders.
5) Do NOT wire Supabase yet (that’s Phase C), but set up .env example.

Golden rules:
- Follow ROADMAP order. Keep code minimal, accessible, responsive.
- Do not expose secrets. Never use service-role keys.
- After each task, append a conventional commit entry in docs/CHANGELOG.md.
- If unclear, choose the simplest reasonable solution, note it in CHANGELOG, and proceed.

──────────────────────────────────────────────────────────────────────────────
TASK 1 — Update docs per feedback (Sections 15–18 in plan)

A) SECURITY.md → Add “Policy Patterns” with two SQL examples:
   - Owner-based: auth.uid() = owner_id (e.g., inventory, profiles)
   - Party-based: buyer/supplier visibility on orders/quotes
   Include brief rationale and where each pattern applies.

B) README.md → Add “Developer Commands & Debugging”:
   - npm run dev / build / lint / typecheck / test
   - Seeding: where infra/supabase/seed.dev.sql lives; how to run
   - Supabase tips: finding UUIDs (auth.users), viewing logs, testing RLS with two accounts
   - Cloudflare Pages deploy notes and wrangler pages deploy command
   - Troubleshooting map: 401 (no session), 403 (RLS), 400 (zod), 500 (unexpected)

C) UX.md → Expand component patterns:
   - CSV Mapping Dialog: required headers, optional headers, validation errors, preview UX
   - DataTable: sortable columns, basic pagination, onRowClick pattern
   (FormStepper is fine as-is.)

D) ROADMAP.md → Clarify phase order:
   Phase B = UI scaffold (mock state allowed),
   Phase C = Supabase env + schema/RLS + DEV seeds + switch to live reads.

Commit: docs: clarify phases, security policy patterns, dev commands, and component patterns
Also append a short summary to docs/CHANGELOG.md.

──────────────────────────────────────────────────────────────────────────────
TASK 2 — Repo hygiene & env

1) Create .env.local.example in apps/web with:
   PUBLIC_SUPABASE_URL=
   PUBLIC_SUPABASE_ANON_KEY=
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=
   TURNSTILE_SECRET_KEY=
   PUBLIC_DATA_MODE=supabase

2) Create docs/CHANGELOG.md (if not exists) and seed it with:
   - docs: scaffold initial documentation set
   - chore(env): add .env.local.example

3) Add .github/pull_request_template.md with a tiny checklist:
   - [ ] Follows plan files only
   - [ ] No secrets committed
   - [ ] CHANGELOG updated
   - [ ] Screenshots/notes added for UI changes

(Do NOT add any other templates beyond this request.)

Commit: chore: add env example, PR template, and initialize CHANGELOG

──────────────────────────────────────────────────────────────────────────────
TASK 3 — Phase B UI scaffold (Sections 11.1 → 11.6 in plan), with live preview

A) App shell
- In apps/web (Next.js App Router), set up Tailwind + shadcn/ui.
- Create AppShell with TopNav + SideNav (role-aware: Buyer vs Supplier), dark mode ready.
- Base routes:
  / , /buyer-register , /buyer/dashboard ,
  /supplier-register , /supplier/setup , /supplier/dashboard
- Shared components (placeholders ok): KPI, DataTable, FormStepper, Uploader, QuoteModal, CsvMappingDialog, EmptyState, Toast, Breadcrumbs.

B) /preview (UI playground page)
- Create /preview route that renders:
  - Navigation shell with all tabs visible
  - A “Component Gallery” section showcasing: FormStepper, DataTable (sample rows), QuoteModal (open via button), CsvMappingDialog mock, KPI cards, EmptyState examples, Toast demo
- Add a big banner at top: “🔴 DEV PREVIEW — LIVE UI (No backend)”
- Add small “Coming Soon” chips where functionality isn’t implemented yet.

C) Supplier auto-onboarding (mock state only)
- /supplier-register → submit sends user to /supplier/setup?step=profile
- /supplier/setup?step=profile → logo & license upload (client-only), address, delivery areas → “Save & Continue” → step=catalog
- /supplier/setup?step=catalog → CSV/XLSX upload → mapping dialog → preview table → “Publish Catalog” → /supplier/dashboard with success toast
- /supplier/dashboard tabs: Overview, RFQs Inbox, Quotes Sent, Orders, Catalog, Settings
  * Use in-memory mock state (no backend).
  * RFQs Inbox shows mocked list with “Quote” button that opens QuoteModal and adds to a local “Quotes Sent” list.

D) Buyer flows (mock state only)
- /buyer/rfqs/new → FormStepper (Details → Items → Budget → Review); on submit, create in-memory RFQ and route to /buyer/rfqs/:id with mock quotes list
- /buyer/rfqs/:id → RFQ header, items, quotes list; “Accept Quote” → create in-memory order and route to /buyer/orders/:id
- /buyer/inventory → local CRUD table; show Low-stock badge when qty ≤ reorder_level
- /buyer/orders/:id → PO summary (supplier, items, totals, timeline), print button (client-side)

E) Coming Soon badges
- Where any endpoint is not implemented yet (e.g., real auth, Supabase reads), show a non-blocking “Coming Soon” chip in the header of that page.

F) Quick QA polish (UI only)
- Add breadcrumbs, empty states, skeleton loaders, and toasts.
- Minimal “route guard” mock: if not “logged in”, redirect dashboards to their register pages (client flag).

Commits (multiple, conventional):
- feat(web): scaffold app shell and base routes
- feat(web-supplier): auto-onboarding wizard with CSV import preview (mock)
- feat(web-supplier): dashboard tabs and quoting flow (mock)
- feat(web-buyer): rfq wizard, rfq detail with quotes, accept-to-order (mock)
- feat(web-buyer): inventory CRUD and order detail screens
- fix(web): polish ui flows, breadcrumbs, skeletons, toasts
Each commit: add a one-line summary in docs/CHANGELOG.md

──────────────────────────────────────────────────────────────────────────────
TASK 4 — Make it easy for me to SEE the UI while you work

- Add to README.md a “Run locally” section:
  1) cd apps/web
  2) npm i
  3) npm run dev
  4) Open http://localhost:3000/preview to see the Component Gallery and live UI
- Auto-open /preview link in your summary message after each major UI commit.
- On the home page (/), add a compact “Build Status” panel listing key pages with status chips:
  - ✅ Complete (UI-only)
  - 🟡 In Progress
  - ⏳ Coming Soon
  This lets me see progress at a glance.

Commit: docs: add run instructions and live /preview viewer

──────────────────────────────────────────────────────────────────────────────
Constraints & reminders:
- Do not add any files beyond those explicitly requested here and in the master plan.
- Keep components small and reusable.
- Accessibility: proper labels, focus states, and keyboard navigation for forms and dialogs.
- Performance: lazy-load heavier dialogs (CSV mapping, QuoteModal).

When finished with these tasks, reply with:
1) A bullet list of commits created
2) A short note of what’s visible at /preview and which pages show “Coming Soon”
3) The exact local URL to open (http://localhost:3000/preview)
4) Any TODOs that you deferred to Phase C (Supabase wiring)

**End of Plan**

