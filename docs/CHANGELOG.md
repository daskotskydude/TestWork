# Changelog

All notable changes to ProcureLink are documented in this file.

The format follows [Conventional Commits](https://www.conventionalcommits.org/).

---

## [Unreleased]

### Phase C - Supabase Wiring + Auth

#### 2025-01-XX
- **feat(supabase)**: create database schema with RLS policies
  - Created infra/supabase/schema.sql with 8 tables (profiles, rfqs, rfq_items, quotes, orders, inventory, products)
  - Implemented Row Level Security (RLS) policies for multi-tenant security
  - Added indexes for performance optimization
  - Created auto-update triggers for timestamp columns
  - Added generate_po_number() function for order PO generation
- **feat(supabase)**: create development seed data
  - Created infra/supabase/seed.dev.sql with test data template
  - Includes 2 test profiles (buyer@test.dev, supplier@test.dev)
  - Sample data: 3 RFQs, 5 RFQ items, 2 quotes, 3 inventory items, 5 products
- **feat(lib)**: create Supabase client libraries
  - Created packages/lib/supabaseClient.ts with TypeScript type definitions
  - Created packages/lib/supabaseServer.ts with server-side client utilities
  - Created packages/lib/useSupabase.ts hook for client components
- **feat(lib)**: create Data Access Layer (DAL)
  - Created packages/lib/data.ts with all database operation functions
  - Implements: listRFQs, getRFQ, createRFQ, listQuotes, createQuote, createOrder, listInventory, upsertInventory, listProducts, bulkUpsertProducts, searchProducts
  - All functions enforce RLS policies and provide type safety
- **chore(deps)**: install Supabase packages
  - Added @supabase/supabase-js for client SDK
  - Added @supabase/ssr for Next.js server-side rendering support
- **docs**: create Supabase setup guide
  - Created docs/SUPABASE_SETUP.md with complete setup instructions
  - Includes step-by-step guide for project creation, schema application, test account setup, seed data loading
  - Added troubleshooting section and security notes
- **chore(env)**: update environment variable naming
  - Fixed .env.local.example to use NEXT_PUBLIC_ prefix for Supabase vars
  - Updated all client files to use correct environment variable names
- **docs**: update ROADMAP to reflect Phase B completion
  - Marked Phase B as complete (all 20+ UI pages implemented)
  - Updated Phase C status to "In Progress"
  - Checked off completed Phase C infrastructure tasks

### Phase B - UI Scaffold (Mock Data)

#### 2025-11-03
- **docs**: scaffold initial documentation set
  - Created README, PRODUCT_SPEC, UX, DATA_MODEL, API, SECURITY, PLAYBOOK, ROADMAP, AGENT_INTERACTION
- **docs**: clarify phases, security policy patterns, dev commands, and component patterns
  - Added RLS policy patterns (owner-based, party-based) with SQL examples to SECURITY.md
  - Expanded README with developer commands, debugging workflows, Supabase tips, troubleshooting map
  - Enhanced UX.md with detailed CSV mapping dialog, DataTable, and component pattern specs
  - Clarified ROADMAP with Phase B (mock state allowed) and Phase C (Supabase wiring) distinction

### Phase B - UI Scaffold (Mock Data)

#### 2025-11-03
- **chore(env)**: add .env.local.example
  - Created apps/web/.env.local.example with Supabase and Turnstile placeholders
- **chore**: add PR template and gitignore
  - Created .github/pull_request_template.md with plan adherence checklist
  - Added comprehensive .gitignore files for root and apps/web
- **feat(web)**: scaffold app shell and base routes
  - Next.js 14 App Router with Tailwind CSS and shadcn/ui setup
  - Core UI components: Button, Input, Textarea, Card, Badge, Skeleton
  - Mock data store with localStorage persistence for UI-only testing
  - Home page with build status panel and feature showcase
  - Configuration: tsconfig, tailwind.config, next.config, package.json
  - Monorepo workspace setup with npm workspaces
- **docs**: add installation guide and update README
  - Created root README.md with project overview, tech stack, quick start
  - Created INSTALL.md with detailed Phase B setup instructions
  - Updated docs/README.md with "Run Locally" section and localhost URLs
  - Created QUICKSTART.md for 5-minute setup guide
  - Created PHASE_B_SUMMARY.md documenting all completed work and next steps

---

## Notes
- Each phase follows **Docs → UI → API** sequence
- All UI work in Phase B uses mock/fixture data
- Supabase wiring begins in Phase C
