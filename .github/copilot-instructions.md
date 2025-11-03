# ProcureLink AI Agent Instructions

## Project Overview
**ProcureLink** is a B2B procurement platform connecting Buyers (restaurants, hotels, SMEs) with Suppliers (wholesalers/distributors). The system orchestrates RFQ-to-Quote-to-Order workflows with inventory management.

**Stack**: Next.js (App Router) on Cloudflare Pages | Supabase (Auth, Postgres, RLS) | Tailwind + shadcn/ui

## Architecture & Data Flow

### Monorepo Structure
```
apps/web/          # Next.js app - all UI and API routes
packages/lib/      # Supabase client, DAL functions, shared types
packages/ui/       # Shared UI components (optional)
infra/supabase/    # Schema, RLS policies, seed scripts
docs/              # Living documentation (always read first)
```

### Core Data Flow (RFQ Lifecycle)
1. **Buyer** creates RFQ with items → saved to `rfqs` + `rfq_items` tables
2. **Suppliers** view open RFQs → submit quotes to `quotes` table
3. **Buyer** accepts quote → creates record in `orders` table linking RFQ + Quote
4. **RLS policies** enforce: buyers own their RFQs/inventory, suppliers own their quotes, both parties see relevant orders

### Security Model
- **All data access goes through Supabase RLS** - no server-side API keys bypass this
- Client uses `PUBLIC_SUPABASE_ANON_KEY` only (safe to expose)
- Service-role keys restricted to Workers only (not in Pages deployment)
- Cloudflare Turnstile required on: signup, RFQ creation
- Never write RLS-bypassing code in API routes

## Development Workflow

### Phase-Based Development (Docs → UI → API)
**Always follow this sequence**:
1. Read/update `docs/ROADMAP.md` for current phase
2. Implement against acceptance criteria in build plan
3. Update `docs/CHANGELOG.md` with conventional commits
4. Test locally before moving to next task

### Environment Setup
```bash
# Copy template and fill Supabase credentials
cp apps/web/.env.local.example apps/web/.env.local

# Install and run
npm i && npm run dev
```

**Required env vars**: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

### Database Operations
- **Schema changes**: Edit `infra/supabase/schema.sql` → paste in Supabase SQL Editor
- **Dev seeding**: Use `infra/supabase/seed.dev.sql` with test accounts (`buyer@test.dev`, `supplier@test.dev`)
- **RLS testing**: Always verify with two logged-in accounts that cross-tenant data is blocked

## Code Conventions

### Component Architecture
- **Location**: Shared in `packages/ui/` or `apps/web/components/`
- **Naming**: PascalCase, descriptive (`FormStepper`, `QuoteModal`, `RFQCard`)
- **Props**: Explicit TypeScript interfaces, avoid `any`

Example reusable components:
```tsx
// components/DataTable.tsx - generic sortable table
<DataTable 
  columns={[{key:'title',label:'RFQ'},{key:'created_at',label:'Created'}]}
  rows={rfqs}
  onRowClick={(row)=>router.push(`/buyer/rfqs/${row.id}`)}
/>

// components/QuoteModal.tsx - validates with zod before submission
<QuoteModal rfq={rfq} onSubmit={async(data)=>{
  await createQuote(quoteSchema.parse(data))
  toast.success('Quote sent')
}}/>
```

### Data Access Pattern
**Never call Supabase directly from components** - use Data Access Layer:

```ts
// packages/lib/data.ts
export async function listRFQs(supabase) {
  return await supabase.from('rfqs')
    .select('*')
    .order('created_at', {ascending:false})
}

// In component/page:
const { data } = await listRFQs(supabaseClient)
```

Benefits: Mockable for testing, centralizes query logic, enforces RLS

### API Routes (Next.js Route Handlers)
- **Location**: `apps/web/app/api/[resource]/route.ts`
- **Validation**: Always use Zod schemas defined in `[resource]/schema.ts`
- **Auth**: Check `supabase.auth.getUser()` first, return 401 if missing
- **Errors**: Return appropriate HTTP codes (400=validation, 401=unauth, 403=RLS block)

```ts
// apps/web/app/api/rfqs/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({error:'Unauthorized'}, {status:401})
  
  const parsed = rfqCreateSchema.parse(body) // throws on invalid
  const { data: rfq } = await supabase.from('rfqs').insert({
    buyer_id: user.id,
    ...parsed
  }).select().single()
  
  return NextResponse.json({ rfq })
}
```

### UI/UX Standards
- **Design System**: Tailwind utilities, shadcn/ui components, Lucide icons
- **Spacing**: Use scale 4/8/12/16/24px (Tailwind `space-*` or `gap-*`)
- **Radius**: 12-16px for cards/modals (`rounded-xl`)
- **Responsive**: Mobile-first, test breakpoints for dashboards
- **Empty States**: Always provide `<EmptyState>` when lists have no data
- **Loading**: Skeleton loaders during fetch, not spinners alone
- **Toasts**: Success/error feedback on all mutations

### Routing Patterns
- **Public**: `/` (home), `/how-it-works`, `/browse-suppliers`
- **Buyer**: `/buyer/dashboard`, `/buyer/rfqs/new`, `/buyer/rfqs/[id]`, `/buyer/orders/[id]`, `/buyer/inventory`
- **Supplier**: `/supplier/dashboard`, `/supplier/setup?step=profile|catalog`
- **Auth Guards**: Redirect unauthenticated users to register pages

## Testing Strategy (MVP Scope)
Focus on **route handler validation** and **critical form logic** only:
- Use **Vitest** + `@testing-library/react` for unit tests
- Test Zod schemas independently (see `apps/web/tests/api.rfqs.post.test.ts` example)
- Manual QA checklist in `docs/PLAYBOOK.md` covers end-to-end flows
- No snapshot or e2e tests until post-MVP

## Common Pitfalls

### ❌ Don't
- Expose service-role keys in client code or Pages env vars
- Bypass RLS by writing custom auth logic in API routes
- Create files/folders outside the monorepo structure listed in Section 1
- Add libraries not explicitly required by the build plan
- Use `any` types - always define interfaces

### ✅ Do
- Read `docs/ROADMAP.md` before starting any task
- Update `docs/CHANGELOG.md` with conventional commits after each change
- Test RLS by logging in as both buyer and supplier
- Use absolute imports from `@/` (configured in tsconfig)
- Implement accessibility (semantic HTML, aria labels, keyboard nav)

## Key Files Reference
- **Data Model**: `docs/DATA_MODEL.md` - full schema + RLS policies
- **API Contracts**: `docs/API.md` - endpoint specs + examples
- **UI Flows**: `docs/UX.md` - sitemap + component inventory
- **Security Rules**: `docs/SECURITY.md` - RLS, rate limits, Turnstile
- **Deployment**: Section 15 of build plan - Cloudflare Pages config

## Deployment
- **Platform**: Cloudflare Pages (auto-deploy from Git)
- **Build**: `npm run build` → outputs `.next`
- **Env Vars**: Set in Pages dashboard (prefix client vars with `PUBLIC_`)
- **Preview Branches**: Enabled for PRs using same Supabase dev instance

## Working with AI Agents
1. **Start here**: Always read this file + `docs/ROADMAP.md` for current phase
2. **Ambiguity policy**: Make simplest reasonable decision consistent with build plan, document in `CHANGELOG.md`, proceed
3. **Scope control**: Only edit files in `apps/`, `packages/`, `infra/`, `docs/` - no new top-level folders
4. **Conventional commits**: Format as `feat(scope): description` or `fix(scope): description`
5. **MVP focus**: Implement only what's in the build plan - no extra features

## Current Phase
Check `docs/ROADMAP.md` for current milestone. Typical sequence:
- Phase A: Documentation scaffolding
- Phase B: UI components with mock data
- Phase C: Supabase wiring + auth
- Phase D: API routes + validation
- Phase E: Deployment prep
- Phase F: QA + polish
