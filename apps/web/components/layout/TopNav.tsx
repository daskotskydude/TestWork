'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bell, User, Menu, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface TopNavProps {
  onMenuClick?: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Logo + Menu Button */}
        <div className="flex items-center gap-4">
          {profile && (
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
          {profile ? (
            <>
              {/* User info */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                <div className="text-right">
                  <p className="text-sm font-medium">{profile.org_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
                </div>
              </div>
              
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5" />
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
