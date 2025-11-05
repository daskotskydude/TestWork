'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, User, Menu, LogOut, Settings, Building } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useNotifications } from '@/lib/notifications-context'
import { useState } from 'react'

interface TopNavProps {
  onMenuClick?: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, profile, signOut } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  const hasNotifications = notifications.length > 0
  const formatTimestamp = (value: string) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(value))
    } catch (error) {
      console.warn('Failed to format timestamp', error)
      return value
    }
  }

  const handleNotificationClick = async (id: string, link?: string) => {
    await markAsRead(id)
    setNotificationsOpen(false)
    if (link) {
      router.push(link)
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          {profile && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">PL</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">ProcureLink</span>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {profile ? (
            <>
              {/* Notifications Dropdown */}
              <DropdownMenu onOpenChange={setNotificationsOpen} open={notificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <DropdownMenuLabel className="px-0">Notifications</DropdownMenuLabel>
                    {hasNotifications && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => markAllAsRead()}
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {hasNotifications ? (
                      notifications.map(notification => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`flex flex-col items-start gap-1 whitespace-normal ${notification.read ? 'opacity-80' : ''}`}
                          onSelect={() => handleNotificationClick(notification.id, notification.link)}
                        >
                          <div className="flex w-full items-center justify-between text-sm font-medium">
                            <span>{notification.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        No new notifications
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{profile.org_name}</span>
                      <span className="text-xs text-muted-foreground capitalize">{profile.role}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile.org_name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Building className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/buyer-register">For Buyers</Link>
              </Button>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/supplier-register">For Suppliers</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
