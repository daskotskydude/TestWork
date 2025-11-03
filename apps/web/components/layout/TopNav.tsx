'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bell, User, Menu } from 'lucide-react'

interface TopNavProps {
  onMenuClick?: () => void
  userRole?: 'buyer' | 'supplier' | null
}

export function TopNav({ onMenuClick, userRole = null }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Logo + Menu Button */}
        <div className="flex items-center gap-4">
          {userRole && (
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">PL</span>
            </div>
            <span className="font-bold text-lg">ProcureLink</span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {userRole ? (
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/buyer-register">For Buyers</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/supplier-register">For Suppliers</Link>
              </Button>
              <Button asChild>
                <Link href="/preview">Component Gallery</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
