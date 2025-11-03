'use client'

import { useState } from 'react'
import { TopNav } from './TopNav'
import { SideNav } from './SideNav'

interface AppShellProps {
  children: React.ReactNode
  role?: 'buyer' | 'supplier' | null
}

export function AppShell({ children, role = null }: AppShellProps) {
  const [sideNavOpen, setSideNavOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <TopNav 
        userRole={role} 
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
