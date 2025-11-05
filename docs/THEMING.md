# Role-Based Theming System

## Overview

ProcureLink implements a modern **role-based color theming** system that dynamically applies different color palettes based on user roles (Buyer vs Supplier). This creates visual distinction and brand identity for each user type while maintaining consistent design patterns.

## Color Schemes

### 🔵 Buyer Theme
- **Primary Color**: Blue (`221.2 83.2% 53.3%` in HSL)
- **Psychology**: Trust, reliability, professionalism
- **Use Case**: Procurement teams, restaurants, hotels, SMEs purchasing goods

### 🟢 Supplier Theme
- **Primary Color**: Green (`142.1 76.2% 36.3%` in HSL)
- **Psychology**: Growth, commerce, productivity
- **Use Case**: Wholesalers, distributors, manufacturers providing goods

## Technical Implementation

### 1. CSS Custom Properties

The theme system is built on CSS variables defined in `apps/web/app/globals.css`:

```css
/* Role-based theme variants */
[data-role="buyer"] {
  --primary: 221.2 83.2% 53.3%; /* Blue */
  --ring: 221.2 83.2% 53.3%;
  --chart-1: 221 83% 53%;
}

[data-role="supplier"] {
  --primary: 142.1 76.2% 36.3%; /* Green */
  --ring: 142.1 76.2% 36.3%;
  --chart-1: 142 76% 36%;
}
```

### 2. Data Attribute Detection

The `RoleThemeProvider` component automatically applies the `data-role` attribute to the document root:

```tsx
// apps/web/components/theme/RoleThemeProvider.tsx
export function RoleThemeProvider({ children }) {
  const { profile } = useAuth()

  useEffect(() => {
    if (profile?.role) {
      document.documentElement.setAttribute('data-role', profile.role)
    }
  }, [profile?.role])

  return <>{children}</>
}
```

### 3. Provider Integration

Added to root layout for automatic role detection:

```tsx
// apps/web/app/layout.tsx
<AuthProvider>
  <RoleThemeProvider>
    <NotificationsProvider>
      {children}
    </NotificationsProvider>
  </RoleThemeProvider>
</AuthProvider>
```

## Usage Patterns

### Automatic (Recommended)

All `shadcn/ui` components automatically inherit the role-based primary color:

```tsx
<Button>Create RFQ</Button>
// Buyers see blue button, suppliers see green button
```

### Explicit Role Classes

For custom styling, use utility classes:

```tsx
<div className="accent-buyer">Buyer-specific content</div>
<div className="accent-supplier">Supplier-specific content</div>

<div className="bg-accent-buyer">Buyer background</div>
<div className="bg-accent-supplier">Supplier background</div>
```

### Role Indicator Component

Visual badge showing current role:

```tsx
import { RoleIndicator } from '@/components/theme/RoleIndicator'

<RoleIndicator role="buyer" />
<RoleIndicator role="supplier" />
```

## Available Utility Classes

| Class                | Effect                                    |
|----------------------|-------------------------------------------|
| `accent-buyer`       | Blue text (buyer theme)                   |
| `bg-accent-buyer`    | Light blue background (buyer)             |
| `border-accent-buyer`| Blue border (buyer)                       |
| `accent-supplier`    | Green text (supplier theme)               |
| `bg-accent-supplier` | Light green background (supplier)         |
| `border-accent-supplier`| Green border (supplier)                |

## Dark Mode Support

Both role themes automatically adapt to dark mode:

```css
[data-role="buyer"].dark {
  --primary: 217.2 91.2% 59.8%; /* Lighter blue for dark mode */
}

[data-role="supplier"].dark {
  --primary: 142.1 70.6% 45.3%; /* Lighter green for dark mode */
}
```

## Customization Guide

### Changing Role Colors

Edit `apps/web/app/globals.css`:

```css
/* Example: Change buyer to purple */
[data-role="buyer"] {
  --primary: 270 100% 50%; /* Purple HSL */
  --ring: 270 100% 50%;
}

/* Example: Change supplier to orange */
[data-role="supplier"] {
  --primary: 30 100% 50%; /* Orange HSL */
  --ring: 30 100% 50%;
}
```

### HSL Color Format

Colors use HSL (Hue, Saturation, Lightness):
- **Hue**: 0-360 (color wheel position)
- **Saturation**: 0-100% (color intensity)
- **Lightness**: 0-100% (brightness)

**Popular Colors**:
- Blue: `220 90% 56%`
- Green: `142 76% 36%`
- Purple: `270 95% 60%`
- Orange: `30 100% 50%`
- Red: `0 84% 60%`
- Teal: `180 77% 47%`

## Testing Role Themes

### Local Testing

1. **Create test accounts**:
   ```sql
   -- In Supabase SQL Editor
   -- Buyer: buyer@test.dev / password123
   -- Supplier: supplier@test.dev / password123
   ```

2. **Log in and verify**:
   - Buyer account → Blue primary color, blue buttons
   - Supplier account → Green primary color, green buttons

3. **Toggle dark mode** → Colors should adapt automatically

### Browser DevTools

Check applied data attribute:

```javascript
console.log(document.documentElement.dataset.role)
// Should output: "buyer" or "supplier"
```

## Best Practices

✅ **DO**:
- Use default primary colors for main CTAs (automatically role-aware)
- Add `RoleIndicator` to dashboards for visual confirmation
- Test both light/dark modes with each role
- Use semantic color names (destructive, success) for universal actions

❌ **DON'T**:
- Hardcode blue/green colors—use `primary` instead
- Override role colors for critical UI (logout, errors)
- Use role colors for status badges (use semantic: success, warning, etc.)

## Migration from Neutral Theme

The original theme was neutral grayscale (`0 0% 9%`). All components now automatically inherit role-based colors with no code changes required.

**Before** (neutral):
```css
--primary: 0 0% 9%; /* Black */
```

**After** (role-based):
```css
[data-role="buyer"] {
  --primary: 221.2 83.2% 53.3%; /* Blue */
}
```

## Future Enhancements

Potential improvements:
- **Custom brand colors**: Allow users to upload logo and extract color palette
- **Accessibility presets**: High contrast modes for better visibility
- **Multi-brand support**: Different themes for white-label deployments
- **A/B testing**: Track conversion rates with different color schemes

## Troubleshooting

**Issue**: Theme not applying
- **Check**: Is `RoleThemeProvider` in layout?
- **Check**: Does user have `profile.role` set in database?
- **Check**: Is `data-role` attribute present on `<html>` element?

**Issue**: Colors wrong in dark mode
- **Check**: CSS variables defined for both `:root` and `.dark`
- **Check**: System dark mode enabled or manual toggle working

**Issue**: Custom components not using theme
- **Solution**: Use Tailwind's `bg-primary`, `text-primary`, or CSS `var(--primary)`

## Related Files

- `apps/web/app/globals.css` - Theme variable definitions
- `apps/web/components/theme/RoleThemeProvider.tsx` - Role detection provider
- `apps/web/components/theme/RoleIndicator.tsx` - Visual role badge
- `apps/web/app/layout.tsx` - Provider integration
- `tailwind.config.ts` - Tailwind configuration (if custom classes needed)

---

**Last Updated**: 2025-11-05  
**Status**: ✅ Production Ready
