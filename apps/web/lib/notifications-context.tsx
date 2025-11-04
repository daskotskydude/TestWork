'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'

interface Notification {
  id: string
  type: 'new_quote' | 'quote_accepted' | 'order_fulfilled' | 'new_rfq'
  title: string
  message: string
  read: boolean
  created_at: string
  link?: string
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refresh: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const supabase = useSupabase()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const loadNotifications = async () => {
    if (!user) return

    // For MVP: Generate mock notifications based on recent activity
    // In production: Fetch from a notifications table
    try {
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*, rfq:rfq_id(title)')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      const mockNotifications: Notification[] = quotes?.map((quote: any) => ({
        id: quote.id,
        type: 'quote_accepted' as const,
        title: quote.status === 'accepted' ? 'Quote Accepted!' : 'Quote Submitted',
        message: `Your quote for "${quote.rfq?.title || 'RFQ'}" ${quote.status === 'accepted' ? 'has been accepted' : 'was submitted'}`,
        read: false,
        created_at: quote.created_at,
        link: '/supplier/quotes'
      })) || []

      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const refresh = loadNotifications

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, refresh }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within NotificationsProvider')
  }
  return context
}
