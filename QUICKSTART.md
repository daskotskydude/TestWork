# 🚀 Quick Start - Get Running in 5 Minutes

## What You Have Now
✅ Complete project structure  
✅ Core UI components scaffolded  
✅ Mock data store ready  
✅ Home page with build status  
✅ Documentation complete  

## What You Need to Do

### Step 1: Install Dependencies (3 minutes)

Open PowerShell in the project root and run:

```powershell
cd apps\web
npm install
```

**What's happening**: Installing Next.js, React, Tailwind, shadcn/ui, and all dependencies (~150 packages)

**Expected output**:
```
added 250 packages in 2m
```

### Step 2: Start Development Server (10 seconds)

```powershell
npm run dev
```

**Expected output**:
```
   ▲ Next.js 14.2.10
   - Local:        http://localhost:3000
   - Ready in 1.5s
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

**What you'll see**:
- Clean home page with ProcureLink branding
- Feature cards (Create RFQs, Receive Quotes, Track Orders, Manage Inventory)
- **Build Status Panel** showing:
  - ✅ Complete (UI-only): Component Gallery, RFQ Wizard, etc.
  - ⏳ Coming Soon: Auth, Live Data Wiring
- Links to routes (some will 404 - that's expected)

---

## What's Working Right Now

### ✅ You Can See
1. **Home page** at `http://localhost:3000`
2. **Build status tracker** with progress indicators
3. **Responsive layout** (try resizing browser)
4. **Tailwind styling** (clean, modern design)

### ⚠️ Expected Issues (Normal)
- **404 on `/preview`**: Not created yet (coming in next session)
- **404 on `/buyer/*` routes**: Pages not scaffolded yet
- **404 on `/supplier/*` routes**: Pages not scaffolded yet
- **Dark mode toggle missing**: Will add in next session

---

## Next: Add a Quick Test Page (Optional)

Want to verify components are working? Create a test page:

### Create `apps/web/app/test/page.tsx`:

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function TestPage() {
  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Component Test Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="secondary">Secondary</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Text input" />
          <Input type="email" placeholder="Email input" />
          <Input type="number" placeholder="Number input" />
        </CardContent>
      </Card>
    </div>
  )
}
```

**View at**: `http://localhost:3000/test`

This will show all your core components working!

---

## Troubleshooting

### "Port 3000 is already in use"
```powershell
$env:PORT=3001; npm run dev
```
Then open `http://localhost:3001`

### "Module not found" errors
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### TypeScript errors in VS Code
- Wait for `npm install` to finish
- Restart VS Code
- Run: `npm run typecheck`

---

## What's Next?

After you've verified everything works:

1. **Review the structure**: Look at files in `apps/web/app` and `apps/web/components`
2. **Check mock data**: Open browser DevTools → Application → Local Storage → see mock RFQs
3. **Read the docs**: Especially `docs/UX.md` for component patterns
4. **Next session**: Continue Phase B by creating:
   - `/preview` Component Gallery
   - Buyer and Supplier flow pages
   - All remaining UI components

---

## Quick Reference

| URL | What You'll See |
|-----|-----------------|
| `http://localhost:3000` | Home page with build status |
| `http://localhost:3000/test` | Component test page (if you created it) |
| `http://localhost:3000/preview` | 404 (not created yet) |

---

## Commands Cheat Sheet

```powershell
# Start dev server
npm run dev

# Build for production
npm run build

# Check types
npm run typecheck

# Lint code
npm run lint

# Stop server
Ctrl+C
```

---

## 🎯 Success!

If you see the home page with the build status panel, **you're ready to continue Phase B!**

**Next Task**: Create the `/preview` Component Gallery so you can see all UI components in action.

See `PHASE_B_SUMMARY.md` for what's completed and what's next.
