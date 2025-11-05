'use client'

import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Store } from 'lucide-react'

interface RoleIndicatorProps {
  role: 'buyer' | 'supplier'
  className?: string
}

/**
 * RoleIndicator - Visual badge showing user's role with color-coded theme
 * 
 * Buyers: Blue badge with shopping bag icon
 * Suppliers: Green badge with store icon
 */
export function RoleIndicator({ role, className = '' }: RoleIndicatorProps) {
  const config = {
    buyer: {
      label: 'Buyer Account',
      icon: ShoppingBag,
      className: 'bg-accent-buyer border-accent-buyer text-blue-700 dark:text-blue-300',
    },
    supplier: {
      label: 'Supplier Account',
      icon: Store,
      className: 'bg-accent-supplier border-accent-supplier text-green-700 dark:text-green-300',
    },
  }

  const { label, icon: Icon, className: roleClassName } = config[role]

  return (
    <Badge variant="outline" className={`${roleClassName} ${className}`}>
      <Icon className="h-3 w-3 mr-1.5" />
      {label}
    </Badge>
  )
}
