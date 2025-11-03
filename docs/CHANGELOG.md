# Changelog

All notable changes to ProcureLink are documented in this file.

The format follows [Conventional Commits](https://www.conventionalcommits.org/).

---

## [Unreleased]

### Phase A - Documentation

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
