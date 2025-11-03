'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Inbox,
  Send,
  Users,
} from 'lucide-react'

interface SideNavProps {
  role: 'buyer' | 'supplier'
  isOpen?: boolean
}

const buyerLinks = [
  { href: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/buyer/rfqs', label: 'My RFQs', icon: FileText },
  { href: '/buyer/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/buyer/inventory', label: 'Inventory', icon: Package },
  { href: '/buyer/connections', label: 'My Suppliers', icon: Users },
  { href: '/buyer/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/buyer/settings', label: 'Settings', icon: Settings },
]

const supplierLinks = [
  { href: '/supplier/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/supplier/rfqs', label: 'RFQs Inbox', icon: Inbox },
  { href: '/supplier/quotes', label: 'Quotes Sent', icon: Send },
  { href: '/supplier/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/supplier/catalog', label: 'Catalog', icon: Package },
  { href: '/supplier/connections', label: 'My Buyers', icon: Users },
  { href: '/supplier/settings', label: 'Settings', icon: Settings },
]

export function SideNav({ role, isOpen = true }: SideNavProps) {
  const pathname = usePathname()
  const links = role === 'buyer' ? buyerLinks : supplierLinks

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
