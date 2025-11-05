'use client'

import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Store } from 'lucide-react'

interface RoleIndicatorProps {
  role: 'buyer' | 'supplier'
  className?: string
}

/**
 * RoleIndicator - Visual badge showing user's role with unified brutal blue theme
 * 
 * Both buyers and suppliers use the same modern blue color scheme
 */
export function RoleIndicator({ role, className = '' }: RoleIndicatorProps) {
  const config = {
    buyer: {
      label: 'Buyer Account',
      icon: ShoppingBag,
      className: 'bg-accent-buyer border-accent-buyer text-[#0049B7] dark:text-blue-400',
    },
    supplier: {
      label: 'Supplier Account',
      icon: Store,
      className: 'bg-accent-supplier border-accent-supplier text-[#0049B7] dark:text-blue-400',
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
