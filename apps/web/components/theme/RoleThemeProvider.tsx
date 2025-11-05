'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

/**
 * RoleThemeProvider - Applies role-based theme via data-role attribute
 * 
 * Automatically detects user role and applies corresponding color scheme:
 * - Buyers get blue theme (trust & reliability)
 * - Suppliers get green theme (growth & commerce)
 * 
 * Works with CSS custom properties defined in globals.css
 */
export function RoleThemeProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()

  useEffect(() => {
    // Apply role-based theme to document element
    if (profile?.role) {
      document.documentElement.setAttribute('data-role', profile.role)
    } else {
      document.documentElement.removeAttribute('data-role')
    }

    // Cleanup on unmount
    return () => {
      document.documentElement.removeAttribute('data-role')
    }
  }, [profile?.role])

  return <>{children}</>
}
