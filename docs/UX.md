# UX & UI Specifications

## Information Architecture / Sitemap

### Public Pages
- **/** - Home (hero, value props, CTAs)
- **/how-it-works** - Process explanation
- **/browse-suppliers** - Public supplier directory
- **/buyer-register** - Buyer signup
- **/supplier-register** - Supplier signup

### Buyer App
- **/buyer/dashboard** - Overview (tabs: RFQs, Quotes, Orders, Inventory, Suppliers, Settings)
- **/buyer/rfqs/new** - Create RFQ wizard (4 steps)
- **/buyer/rfqs/[id]** - RFQ detail with quotes
- **/buyer/orders/[id]** - Purchase order detail
- **/buyer/inventory** - Stock management table
- **/buyer/settings** - Profile, notifications, billing

### Supplier App
- **/supplier/setup** - Auto-onboarding wizard (`?step=profile|catalog`)
- **/supplier/dashboard** - Overview (tabs: RFQs Inbox, Quotes Sent, Orders, Catalog, Settings)
- **/supplier/catalog** - Product management
- **/supplier/settings** - Profile, verification, notifications

---

## Core User Flows

### Buyer Flow: RFQ → Quote → Order
1. **Create RFQ**: `/buyer/rfqs/new` wizard
   - Step 1: Details (title, description, category, location)
   - Step 2: Items (dynamic rows: name, qty, unit, target_price)
   - Step 3: Budget (min/max range)
   - Step 4: Review and submit
2. **Receive Quotes**: `/buyer/rfqs/[id]` shows incoming quotes in table
3. **Compare & Accept**: Click quote → expand details → "Accept Quote" button
4. **Order Created**: Navigate to `/buyer/orders/[id]` with PO number

### Supplier Flow: Onboard → Quote → Fulfill
1. **Auto-Onboarding**: `/supplier/setup`
   - Profile step: Upload logo, trade license, address, delivery areas
   - Catalog step: Upload CSV/XLSX → map columns → preview → publish
2. **Browse RFQs**: `/supplier/dashboard` → RFQs Inbox tab
3. **Send Quote**: Click "Quote" → modal with price, lead time, notes → submit
4. **Track Orders**: Orders tab shows accepted quotes with fulfillment status

---

## Design System

### Framework & Tools
- **CSS**: Tailwind CSS (utility-first)
- **Components**: shadcn/ui (headless, accessible)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Toasts**: Sonner (toast notifications)

### Spacing Scale
Use Tailwind's spacing scale consistently:
- `gap-1` / `space-x-1`: 4px (tight)
- `gap-2` / `space-x-2`: 8px (compact)
- `gap-3` / `space-x-3`: 12px (default)
- `gap-4` / `space-x-4`: 16px (comfortable)
- `gap-6` / `space-x-6`: 24px (spacious sections)

### Border Radius
- **Cards/Modals**: `rounded-xl` (12px)
- **Buttons**: `rounded-lg` (8px)
- **Inputs**: `rounded-md` (6px)
- **Badges**: `rounded-full` (pill shape)

### Shadows
- **Cards**: `shadow-sm` (subtle elevation)
- **Modals**: `shadow-lg` (prominent)
- **Dropdowns**: `shadow-md` (floating)

### Colors (Tailwind defaults)
- **Primary**: `blue-600` (CTAs, links)
- **Success**: `green-600` (completed, accepted)
- **Warning**: `yellow-500` (pending, low stock)
- **Error**: `red-600` (failed, rejected)
- **Neutral**: `gray-700` (text), `gray-200` (borders)

### Typography
- **Headings**: `font-semibold`, `text-2xl` / `text-xl` / `text-lg`
- **Body**: `text-base` (16px), `text-gray-700`
- **Small**: `text-sm` (labels, captions), `text-gray-500`

---

## Component Library

### Layout Components

#### AppShell
**Usage**: Wraps all authenticated pages
```tsx
<AppShell role="buyer|supplier">
  <TopNav />
  <SideNav />
  <main>{children}</main>
</AppShell>
```

#### TopNav
- Brand logo (left)
- Search bar (center, desktop only)
- Theme toggle (light/dark)
- User menu (avatar, dropdown)

#### SideNav
**Buyer**:
- Dashboard
- RFQs
- Quotes
- Orders
- Inventory
- Suppliers
- Settings

**Supplier**:
- Dashboard
- RFQs Inbox
- Quotes Sent
- Orders
- Catalog
- Settings

**Responsive**: Collapses to hamburger on mobile

#### PageHeader
```tsx
<PageHeader 
  title="Create RFQ" 
  breadcrumbs={[{label:'RFQs', href:'/buyer/rfqs'}, {label:'New'}]}
  actions={<Button>Save Draft</Button>}
/>
```

#### Breadcrumbs
- Home icon for root
- Separator: `/` or `>`
- Current page not clickable

---

### Data Display

#### DataTable
**Features**: Sortable columns, basic pagination, row click handler

**Pattern**:
```tsx
<DataTable
  columns={[
    {key: 'title', label: 'RFQ', sortable: true},
    {key: 'category', label: 'Category'},
    {key: 'created_at', label: 'Created', sortable: true}
  ]}
  rows={rfqs}
  onRowClick={(row) => router.push(`/buyer/rfqs/${row.id}`)}
  onSort={(key, direction) => setSortBy(key, direction)}
/>
```

**Pagination** (basic):
- Show page numbers if rows > 20
- "Previous" / "Next" buttons
- Display "Showing 1-20 of 45"

**Empty State**: When `rows.length === 0`, render `<EmptyState>` with icon and CTA

---

#### KPI (Metric Card)
```tsx
<KPI 
  title="RFQs Today" 
  value={12} 
  change="+3 from yesterday" 
  trend="up" // up|down|neutral
  icon={<FileTextIcon />}
/>
```

#### EmptyState
```tsx
<EmptyState
  icon={<InboxIcon />}
  title="No RFQs yet"
  description="Create your first request to get quotes from suppliers"
  action={<Button href="/buyer/rfqs/new">Create RFQ</Button>}
/>
```

---

### Forms & Inputs

#### FormStepper
**Usage**: Multi-step forms (RFQ wizard, supplier onboarding)

```tsx
<FormStepper 
  steps={['Details', 'Items', 'Budget', 'Review']} 
  active={currentStep} 
  onNext={handleNext} 
  onBack={handleBack}
/>
```

**Visual**: Numbered circles with connecting lines, current step highlighted

#### Field Components
- **Field.Text**: `<input type="text">` with label, error state
- **Field.Number**: `<input type="number">` with min/max, step
- **Field.Select**: Dropdown (single-select)
- **Field.MultiSelect**: Tags-based multi-select (delivery areas, categories)
- **Field.Textarea**: Multi-line text (descriptions, notes)

**Validation**: Show error message below field; red border on invalid

---

#### Uploader
**Single File**:
```tsx
<Uploader 
  label="Trade License" 
  accept="image/*,application/pdf" 
  maxSize="5MB"
  onUpload={(file) => setLicense(file)}
/>
```

**CSV/XLSX** (for catalog import):
```tsx
<Uploader 
  label="Upload Product Catalog" 
  accept=".csv,.xlsx" 
  maxSize="10MB"
  onUpload={(file) => handleParseCsv(file)}
/>
```

**States**: Idle, uploading (progress bar), success (checkmark), error (retry button)

---

### Modals & Dialogs

#### QuoteModal
**Triggered by**: "Quote" button in RFQs Inbox

**Fields**:
- Total Price (number, required)
- Currency (select: QAR, USD, EUR - default QAR)
- Lead Time (number, days, required)
- Notes (textarea, optional, max 500 chars)

**Actions**: "Cancel" (close), "Send Quote" (validate + submit)

**Validation**: 
- Price > 0
- Lead time >= 0
- Show inline errors below fields

---

#### CsvMappingDialog
**Triggered by**: After CSV/XLSX upload in supplier onboarding

**Purpose**: Map uploaded columns to required fields

**Required Headers** (must map):
- **Name**: Product name
- **Unit**: kg, liters, pcs, box, etc.
- **Price**: Numeric (local currency)

**Optional Headers**:
- **SKU**: Product code
- **Stock**: Current quantity
- **Category**: Food, Packaging, Cleaning, etc.
- **MOQ**: Minimum order quantity

**UI Flow**:
1. Show uploaded CSV headers in left column
2. Dropdowns for each required field to select matching column
3. "Auto-detect" button (match by header name similarity)
4. Validation errors if required fields unmapped
5. Preview table shows first 5 rows with mapped columns
6. "Cancel" (discard), "Confirm Mapping" (proceed to preview)

**Preview UX** (after mapping confirmed):
- Full table with all mapped rows
- Validation errors highlighted (e.g., negative price, empty name)
- "Edit Mapping" (go back), "Publish Catalog" (save to backend)

**Error Handling**:
- Invalid CSV format → show error toast, allow re-upload
- No rows detected → "Empty file" message
- Duplicate SKUs → warning badge, allow user to resolve

---

#### ConfirmDialog
**Generic confirmation** for destructive actions:
```tsx
<ConfirmDialog
  title="Delete Inventory Item?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>
```

---

### Feedback Components

#### Toast (Sonner)
**Usage**: Success/error feedback for mutations

```tsx
import { toast } from 'sonner'

toast.success('RFQ created successfully')
toast.error('Failed to submit quote')
toast.info('Draft saved')
```

**Position**: Bottom-right (desktop), bottom-center (mobile)

**Duration**: 3s (success/info), 5s (error)

---

#### Skeleton Loader
**Usage**: While fetching data

```tsx
<Skeleton className="h-10 w-full" /> // Single row
<Skeleton className="h-64 w-full" /> // Card
```

**Pattern**: Gray shimmer animation, matches target component shape

---

#### Loading Spinner
**Usage**: Button loading states

```tsx
<Button disabled>
  <LoaderIcon className="animate-spin" />
  Submitting...
</Button>
```

---

### Status & Badges

#### StatusBadge
```tsx
<StatusBadge status="open|closed|sent|accepted|rejected|created|fulfilled" />
```

**Colors**:
- `open`: blue
- `sent`: purple
- `accepted`: green
- `rejected`: red
- `created`: yellow (pending)
- `fulfilled`: green
- `closed`: gray

#### ComingSoonBadge
```tsx
<ComingSoonBadge />
```
**Visual**: Small yellow badge with "⏳ Coming Soon" text, non-blocking

---

## Responsive Design

### Breakpoints (Tailwind)
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl)

### Mobile Adaptations
- **SideNav**: Hamburger menu (drawer overlay)
- **DataTable**: Horizontal scroll or card list view
- **Forms**: Full-width inputs, stacked layout
- **Modals**: Full-screen on mobile (or 90% height)

---

## Accessibility Checklist

### Keyboard Navigation
- [ ] All interactive elements focusable (Tab/Shift+Tab)
- [ ] Modals trap focus (Escape to close)
- [ ] Dropdowns navigable with arrow keys
- [ ] Forms submittable with Enter key

### Screen Readers
- [ ] Semantic HTML (`<nav>`, `<main>`, `<article>`)
- [ ] Labels on all form inputs (`<label>` or `aria-label`)
- [ ] Alt text on images
- [ ] ARIA roles where needed (`role="dialog"`, `aria-expanded`)

### Visual
- [ ] Sufficient color contrast (WCAG AA: 4.5:1 for text)
- [ ] Focus indicators visible (outline or ring)
- [ ] No reliance on color alone (use icons + text)

---

## Component Patterns Summary

| Component | Usage | Key Props |
|-----------|-------|-----------|
| **DataTable** | Lists with sorting/pagination | `columns`, `rows`, `onRowClick`, `onSort` |
| **FormStepper** | Multi-step forms | `steps`, `active`, `onNext`, `onBack` |
| **QuoteModal** | Supplier quote submission | `rfq`, `onSubmit` |
| **CsvMappingDialog** | Catalog import mapping | `csvHeaders`, `onConfirm` |
| **Uploader** | File uploads | `accept`, `maxSize`, `onUpload` |
| **EmptyState** | No data placeholders | `icon`, `title`, `description`, `action` |
| **StatusBadge** | Order/quote status | `status` |
| **Skeleton** | Loading placeholders | `className` (for sizing) |

---

## Animation & Transitions

### Principles
- **Fast**: 150-200ms for small elements (dropdowns, tooltips)
- **Medium**: 300ms for modals, sidebars
- **Smooth**: Use `ease-in-out` or Tailwind's default timing

### Examples
```tsx
// Modal enter/exit
<Dialog className="transition-opacity duration-300">

// Sidebar slide
<aside className="transition-transform duration-200">

// Button hover
<Button className="transition-colors duration-150">
```

**Accessibility**: Respect `prefers-reduced-motion` (disable animations if set)

---

## Dark Mode
- **Toggle**: In TopNav user menu
- **Implementation**: Tailwind's `dark:` variant
- **Persistence**: Store preference in localStorage

```tsx
// Example
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

---

## Next Steps (Post-MVP)
- **Advanced search**: Filters, autocomplete
- **Notifications center**: Bell icon with unread count
- **Chat**: Real-time messaging between buyer/supplier
- **File attachments**: Images in RFQs, PDFs in quotes
- **Print styles**: Invoice-friendly order pages
