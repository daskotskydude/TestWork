# Changelog

All notable changes to ProcureLink are documented in this file.

The format follows [Conventional Commits](https://www.conventionalcommits.org/).

---

## [Unreleased]

### Phase F - Production Ready (Complete ✅)

#### 2025-11-04
- **feat(settings)**: add profile editing to buyer and supplier settings
  - Implemented edit mode with phone, address, and description fields
  - Profile updates save to Supabase and refresh automatically
  - Added cancel button to revert unsaved changes
  - Notification preferences already functional with localStorage

- **fix(auth)**: handle profile creation under Supabase RLS
  - Store registration details in Supabase user metadata during sign up
  - Bootstrap `profiles` rows once a session exists to avoid RLS insert errors
  - Removed direct profile insert that failed when email confirmation is required

- **chore(turnstile)**: document production Turnstile configuration
  - Clarified that Vercel deployments require NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY
  - Noted that enabling the keys removes the local/dev security bypass banner

- **docs(roadmap)**: mark all MVP phases complete
  - Updated ROADMAP.md to reflect completion of Phases A-F
  - All core features implemented and tested
  - Production build passing
  - Security features (Turnstile + rate limiting) active
  - Comprehensive deployment documentation ready

- **feat(notifications)**: add email templates and notification system
  - Created email notification templates (newQuote, quoteAccepted, orderFulfilled, newRFQ)
  - Implemented notification context provider with unread count tracking
  - Built reusable Notification UI component with 4 types (success, error, info, warning)
  - Ready for Resend API integration post-MVP

- **feat(security)**: implement rate limiting and Turnstile protection
  - Created rate-limit middleware with in-memory store and automatic cleanup
  - Added 5 rate limit presets (AUTH, RFQ_CREATE, QUOTE_CREATE, API_DEFAULT, PUBLIC)
  - Integrated Cloudflare Turnstile on 3 forms (buyer/supplier register, RFQ creation)
  - API routes return proper rate limit headers and 429 status codes

- **feat(api)**: create API routes with validation
  - Implemented `/api/rfqs` (GET list, POST create) with authentication and rate limiting
  - Implemented `/api/quotes` (POST submit) with RLS error handling
  - Added runtime='nodejs' and dynamic='force-dynamic' exports for proper server rendering
  - Zod schema validation on all endpoints

- **fix(build)**: resolve production build issues
  - Wrapped useSearchParams() in Suspense boundary in supplier/setup page
  - Split SupplierSetupContent into separate component
  - Fixed all TypeScript errors and build warnings

- **feat(dashboard)**: enhance dashboards with better UI
  - Added colored stat card backgrounds (blue, orange, green, purple)
  - Implemented real order counts instead of mock data
  - Added subtitles showing acceptance rates and fulfillment counts
  - Fixed low stock comparison with proper Number() wrapper

- **docs(deployment)**: create comprehensive deployment guide
  - Created DEPLOYMENT.md with 546 lines covering full production setup
  - Documented Supabase project creation and schema application
  - Added Cloudflare Turnstile setup instructions
  - Included environment variables reference for local and production
  - Provided Cloudflare Pages deployment configuration
  - Added 15-item post-deployment verification checklist
  - Included troubleshooting guide and monitoring recommendations

- **docs(features)**: create complete feature documentation
  - Created FEATURES.md with comprehensive feature list
  - Documented all buyer and supplier capabilities
  - Listed all 37 page routes in the application
  - Provided end-to-end workflow documentation (7 steps)
  - Included design system and technical stack details
  - Added future enhancement roadmap (Phases 2-4)

### Phase E - Deployment Prep (Complete ✅)

#### 2025-11-04
- All production build configurations verified
- Environment variables template complete
- Bundle size optimized (< 200KB first load JS)
- No secrets in client-side code verified

### Phase D - Quote Submission + Order Management (Complete ✅)

#### 2025-11-03
- **feat(connections)**: add buyer-supplier connections feature
  - Created connections table for direct buyer-supplier relationships
  - Implemented connection management DAL functions (list, create, update, delete)
  - Built `/buyer/connections` page for searching and connecting with suppliers
  - Built `/supplier/connections` page for managing connection requests
  - Added "My Suppliers" and "My Buyers" to navigation sidebars
  - Support for pending, accepted, rejected, and blocked connection statuses
  - Full RLS policies ensuring connection privacy
  - Enables recurring business relationships outside formal RFQ process

- **fix(rfqs)**: wire buyer RFQ detail page to Supabase
  - Replaced useMockStore with real database queries
  - Added getRFQItems() function to fetch RFQ items separately
  - Implemented quote acceptance with createOrder() function
  - Show loading spinner while fetching data
  - Display all RFQ items and submitted quotes

- **fix(rfqs)**: correct RFQ status values to match database schema
  - Changed createRFQ to use 'open' status instead of invalid 'draft'
  - Updated updateRFQStatus to only accept 'open' | 'closed'
  - Fixed database constraint violations

- **fix(rfqs)**: wire Create New RFQ to save to Supabase
  - Replaced useMockStore with createRFQ() function
  - RFQs now persist to database with items
  - Added loading state during submission
  - Proper error handling with toast notifications

- **docs(home)**: update build status to reflect Phase C completion
  - Updated home page to show Phase C complete status
  - Added test account credentials display
  - Changed hero CTA to "Login / Try Demo"
  - Listed all completed features (auth, CRUD, RLS, live data)

### Phase C - Supabase Wiring + Auth (Complete ✅)

#### 2025-11-03
- **feat(dashboards)**: wire all pages to real Supabase data
  - Buyer dashboard: fetch RFQs, orders, inventory counts
  - Supplier dashboard: fetch open RFQs, quotes, products
  - Buyer RFQ list: real data with loading states
  - Supplier RFQ list: real data with quote tracking
  - Buyer inventory: full CRUD with upsertInventory/delete
  - Supplier catalog: full product CRUD with statistics
  - Added listQuotesBySupplier() function to DAL
  - Fixed RFQ type references (removed .items, using .category)
  - All pages use consistent loading spinners
  - Toast notifications for all mutations

- **feat(auth)**: complete authentication system
  - Implemented auth guards with middleware for route protection
  - Built supplier registration with real Supabase auth
  - Updated navigation to show user info and logout button
  - Role-based redirects after login (buyer → dashboard, supplier → dashboard)
  - Auth context automatically updates AppShell based on user role

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
  - Created packages/lib/data.ts with 30+ database operation functions
  - RFQ management: listRFQs, getRFQ, getRFQItems, createRFQ, updateRFQStatus, deleteRFQ
  - Quote management: listQuotes, listQuotesBySupplier, getQuote, createQuote, updateQuoteStatus
  - Order management: listOrders, getOrder, createOrder, updateOrderStatus
  - Inventory: listInventory, upsertInventory, deleteInventory
  - Products: listProducts, bulkUpsertProducts, deleteProduct, searchProducts
  - Connections: listConnections, createConnection, updateConnectionStatus, deleteConnection
  - All functions enforce RLS policies and provide type safety

- **chore(deps)**: install Supabase packages
  - Added @supabase/supabase-js for client SDK
  - Added @supabase/ssr for Next.js server-side rendering support

- **docs**: create Supabase setup guide
  - Created docs/SUPABASE_SETUP.md with complete setup instructions
  - Created docs/PHASE_C_COMPLETION.md with status and next steps

- **chore(env)**: update environment variable naming
  - Fixed .env.local.example to use NEXT_PUBLIC_ prefix for Supabase vars
  - Updated all client files to use correct environment variable names

### Phase B - UI Scaffold (Mock Data) (Complete ✅)

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
