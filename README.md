# ProcureLink

> **B2B procurement platform connecting Buyers with Suppliers**

One platform to request, quote, order, and track stock for restaurants, hotels, construction SMEs, and wholesalers.

---

## 🚀 Quick Start

### Phase B: UI-Only Mode (No Backend Required)

```powershell
# 1. Install dependencies
cd apps\web
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:3000 (home + build status)
# http://localhost:3000/preview (component gallery)
```

**What you'll see**: Fully functional UI with mock data, perfect for demos and frontend development.

📖 **Detailed setup**: See [`INSTALL.md`](./INSTALL.md)

---

## 📂 Project Structure

```
procurelink/
├─ apps/
│  └─ web/              # Next.js app (all UI + API routes)
│     ├─ app/           # App Router pages
│     ├─ components/    # Shared components
│     └─ lib/           # Utilities, mock store
├─ packages/
│  ├─ lib/              # Supabase client, DAL (Phase C)
│  └─ ui/               # Shared UI components (optional)
├─ infra/
│  ├─ supabase/         # Schema, RLS policies, seeds
│  └─ cloudflare/       # Workers config (Phase 2)
└─ docs/                # Living documentation
   ├─ README.md         # Dev commands, troubleshooting
   ├─ ROADMAP.md        # Current phase and tasks
   ├─ UX.md             # Component patterns, design system
   ├─ DATA_MODEL.md     # ERD, RLS policies
   ├─ SECURITY.md       # RLS patterns, auth rules
   └─ CHANGELOG.md      # Conventional commits log
```

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Auth, Postgres, RLS) - wired in Phase C
- **Hosting**: Cloudflare Pages
- **Icons**: Lucide React
- **Validation**: Zod
- **Testing**: Vitest, Testing Library

---

## 📋 Current Phase

**Phase B - UI Scaffold (Mock Data)**

✅ **Completed**:
- Component library (DataTable, FormStepper, QuoteModal, etc.)
- Buyer RFQ wizard (4-step)
- Supplier auto-onboarding with CSV catalog import
- Inventory CRUD with low-stock alerts
- Mock data store with localStorage persistence
- Home page with build status panel
- Component gallery at `/preview`

⏳ **Coming in Phase C**:
- Supabase authentication (email, magic link, Google)
- Live data persistence with RLS policies
- Profile onboarding flow
- Cloudflare Turnstile (bot protection)

See [`docs/ROADMAP.md`](./docs/ROADMAP.md) for detailed phase breakdown.

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| [`INSTALL.md`](./INSTALL.md) | Step-by-step setup guide |
| [`docs/README.md`](./docs/README.md) | Developer commands, debugging, troubleshooting |
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | Phased delivery plan, task checklist |
| [`docs/UX.md`](./docs/UX.md) | Component patterns, design system, flows |
| [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) | Database schema, RLS policies |
| [`docs/SECURITY.md`](./docs/SECURITY.md) | Security model, RLS patterns |
| [`docs/API.md`](./docs/API.md) | Endpoint contracts (Phase D) |
| [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) | Conventional commits history |

---

## 💻 Developer Commands

```powershell
# Development
npm run dev          # Start dev server (hot reload)
npm run build        # Production build
npm run start        # Start production server

# Quality
npm run lint         # ESLint check
npm run typecheck    # TypeScript validation
npm run test         # Vitest unit tests
```

All commands run in `apps/web` workspace.

---

## 🎯 Key Features

### For Buyers (Restaurants, Hotels, SMEs)
- ✅ Create detailed RFQs with multi-step wizard
- ✅ Receive and compare supplier quotes
- ✅ Convert quotes to purchase orders
- ✅ Track inventory with low-stock alerts
- ✅ Reorder workflows

### For Suppliers (Wholesalers, Distributors)
- ✅ Auto-onboarding wizard (profile + CSV catalog import)
- ✅ Browse open RFQs from buyers
- ✅ Submit competitive quotes quickly
- ✅ Track orders and fulfillment
- ✅ Manage product catalog

---

## 🔒 Security (Phase C+)

- **Authentication**: Supabase Auth (email, magic link, Google OAuth)
- **Authorization**: Row Level Security (RLS) policies on all tables
- **Bot Protection**: Cloudflare Turnstile on signup and RFQ creation
- **Rate Limiting**: 10 writes/min, 100 reads/min per user
- **Data Validation**: Zod schemas on all API endpoints

**Security patterns**: Owner-based (inventory, profiles) and Party-based (quotes, orders)

See [`docs/SECURITY.md`](./docs/SECURITY.md) for detailed policy examples.

---

## 🚢 Deployment (Phase E)

**Platform**: Cloudflare Pages (auto-deploy from Git)

**Build Settings**:
- Framework: Next.js
- Build command: `npm run build`
- Output directory: `.next`

**Environment Variables** (set in Pages dashboard):
```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-key
```

**Branch Previews**: Enabled for PRs (uses DEV Supabase instance)

---

## 🤝 Contributing

1. Read [`docs/ROADMAP.md`](./docs/ROADMAP.md) for current phase
2. Follow conventional commits: `feat(scope): description`
3. Update [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) after each task
4. Test RLS with two accounts (buyer + supplier) before submitting PR
5. Use PR template checklist in `.github/pull_request_template.md`

**Golden Rules**:
- Work only within files/folders defined in the build plan
- No extra docs/tests beyond plan scope
- Never commit secrets
- Make best-effort decisions when unclear and document in CHANGELOG

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `$env:PORT=3001; npm run dev` |
| Dependencies fail | `rm -r node_modules; npm install` |
| TypeScript errors | `npm run typecheck` |
| Mock data not persisting | Check browser localStorage, clear cache |

See [`docs/README.md`](./docs/README.md) for comprehensive troubleshooting map.

---

## 📅 Roadmap

**Phase 1 (MVP)**: Docs → UI → Supabase → API → Deploy  
**Phase 2**: Payments (Stripe Connect), Analytics, Multi-currency  
**Phase 3**: Integrations, Teams/Roles, White-label

See [`docs/ROADMAP.md`](./docs/ROADMAP.md) for detailed milestones.

---

## 📄 License

MIT

---

## 📞 Support

- **Documentation**: [`/docs`](./docs) folder
- **Build Plan**: Root `procure_link_full_build_plan...md`
- **Issues**: GitHub issues with `[Phase X]` prefix

---

**Current Status**: Phase B - UI Scaffold (Mock Data)  
**Live Preview**: `http://localhost:3000/preview` after `npm run dev`
