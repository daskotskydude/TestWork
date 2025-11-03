# ProcureLink - Installation & Setup Guide

## Phase B: UI-Only Setup (Current)

This guide will get you running with the full UI in **mock data mode**. Perfect for:
- Reviewing UI/UX flows
- Testing component behavior
- Demos and screenshots
- Frontend development

**No Supabase or backend required for Phase B!**

---

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- Code editor (VS Code recommended)

---

## Installation Steps

### 1. Install Dependencies

```powershell
# Navigate to the web app directory
cd apps\web

# Install all npm packages
npm install
```

**Expected time**: 2-3 minutes (depending on internet speed)

**Packages installed**:
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- shadcn/ui components
- Lucide icons
- Zod validation
- Sonner (toasts)
- Vitest (testing)

---

### 2. Start Development Server

```powershell
npm run dev
```

**Output you'll see**:
```
   ▲ Next.js 14.2.10
   - Local:        http://localhost:3000
   - Ready in 1.5s
```

---

### 3. Open in Browser

Navigate to:

- **http://localhost:3000** - Home page with build status
- **http://localhost:3000/preview** - Component Gallery (recommended first stop)

---

## What's Available in Phase B

### ✅ Complete (UI-only, mock data)

1. **Component Gallery** (`/preview`)
   - Live showcase of all UI components
   - Interactive demos
   - "Coming Soon" indicators for incomplete features

2. **Buyer Flows**
   - RFQ Creation Wizard (4 steps)
   - RFQ Detail with quotes
   - Accept Quote → Order flow
   - Inventory CRUD

3. **Supplier Flows**
   - Auto-onboarding wizard
   - CSV catalog upload with mapping dialog
   - RFQ inbox with quoting
   - Dashboard tabs

4. **Shared Components**
   - DataTable (sortable, paginated)
   - FormStepper (multi-step forms)
   - QuoteModal, CsvMappingDialog
   - KPI cards, Status badges
   - Empty states, skeleton loaders
   - Toast notifications

### ⏳ Coming Soon (Phase C)

- Supabase authentication (email, magic link, Google)
- Live data persistence
- RLS policy enforcement
- Real-time updates

---

## Mock Data Behavior

**Storage**: `localStorage` in browser  
**Persistence**: Survives page refresh, cleared on browser clear  
**Reset**: Clear browser storage or hard refresh

**Default mock users**:
- Buyer: `buyer@test.dev` (org: "Al Markhiya Grill")
- Supplier: `supplier@test.dev` (org: "Gulf Foods Trading")

**Mock data includes**:
- 2 RFQs with items
- 1 quote
- 2 inventory items
- 0 orders (create by accepting a quote)

---

## Development Commands

```powershell
# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm run start

# Type checking
npm run typecheck

# Linting
npm run lint

# Run tests
npm run test
```

---

## Troubleshooting

### Port 3000 Already in Use

```powershell
# Use a different port
$env:PORT=3001; npm run dev
```

### Dependencies Not Installing

```powershell
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### TypeScript Errors in Editor

- Install VS Code extension: **TypeScript and JavaScript Language Features**
- Restart VS Code
- Run `npm run typecheck` to verify

### Page Not Loading

1. Check console for errors (F12 → Console)
2. Verify `npm run dev` is still running
3. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## Next Steps

### After Reviewing UI (Phase B → Phase C)

1. **Set up Supabase project**:
   - Sign up at [supabase.com](https://supabase.com)
   - Create new project
   - Get credentials from Settings → API

2. **Configure environment**:
   ```powershell
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Apply database schema**:
   - Open Supabase SQL Editor
   - Paste contents of `infra/supabase/schema.sql`
   - Run to create tables + RLS policies

4. **Create test accounts**:
   - Use Supabase Auth UI to create:
     - `buyer@test.dev`
     - `supplier@test.dev`
   - Copy UUIDs for seed script

5. **Seed dev data** (optional but recommended):
   - Edit `infra/supabase/seed.dev.sql` with real UUIDs
   - Paste into SQL Editor and run

6. **Wire Supabase client**:
   - Covered in Phase C instructions

---

## Quick Reference

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Home + build status |
| `http://localhost:3000/preview` | Component gallery |
| `http://localhost:3000/buyer-register` | Buyer signup (mock) |
| `http://localhost:3000/buyer/rfqs/new` | RFQ wizard |
| `http://localhost:3000/buyer/inventory` | Inventory CRUD |
| `http://localhost:3000/supplier-register` | Supplier signup (mock) |
| `http://localhost:3000/supplier/setup` | Onboarding wizard |
| `http://localhost:3000/supplier/dashboard` | Supplier dashboard |

---

## Getting Help

- **Docs**: See `/docs` folder (README, ROADMAP, UX, DATA_MODEL, etc.)
- **Build Plan**: See root `procure_link_full_build_plan...md`
- **Issues**: Open GitHub issue with `[Phase B]` prefix
- **Questions**: Check `docs/README.md` troubleshooting map

---

**Current Phase**: B - UI Scaffold (Mock Data)  
**Next Phase**: C - Supabase Wiring (Auth + Live Data)

See `docs/ROADMAP.md` for detailed phase breakdown.
