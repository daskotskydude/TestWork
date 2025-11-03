'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { TopNav } from './TopNav'
import { SideNav } from './SideNav'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { profile } = useAuth()
  const [sideNavOpen, setSideNavOpen] = useState(true)
  const role = profile?.role || null

  return (
    <div className="min-h-screen bg-background">
      <TopNav 
        onMenuClick={() => setSideNavOpen(!sideNavOpen)}
      />
      
      <div className="flex">
        {role && <SideNav role={role} isOpen={sideNavOpen} />}
        
        <main
          className={cn(
            'flex-1 transition-all duration-300',
            role && sideNavOpen ? 'ml-64' : 'ml-0'
          )}
        >
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
