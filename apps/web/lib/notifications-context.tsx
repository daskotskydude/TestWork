'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
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

type ProfileRole = 'buyer' | 'supplier'

const defaultPreferences: Record<ProfileRole, Record<string, boolean>> = {
  buyer: {
    emailNotifications: true,
    quoteAlerts: true,
    orderUpdates: true,
    inventoryAlerts: true,
    connectionRequests: true,
  },
  supplier: {
    emailNotifications: true,
    newRFQAlerts: true,
    orderUpdates: true,
    quoteAccepted: true,
    connectionRequests: true,
  },
}

const storageKeyByRole: Record<ProfileRole, string> = {
  buyer: 'buyer-notification-settings',
  supplier: 'supplier-notification-settings',
}

function readPreferences(role: ProfileRole | undefined) {
  if (!role) return null
  const base = defaultPreferences[role]
  if (typeof window === 'undefined') return base

  try {
    const stored = window.localStorage.getItem(storageKeyByRole[role])
    if (!stored) return base
    const parsed = JSON.parse(stored)
    return { ...base, ...parsed }
  } catch (error) {
    console.warn('Failed to parse notification preferences:', error)
    return base
  }
}

function isNotificationEnabled(
  notification: Notification,
  role: ProfileRole | undefined,
  preferences: Record<string, boolean> | null
) {
  if (!role || !preferences) return true

  switch (notification.type) {
    case 'new_quote':
      return role === 'buyer' ? preferences.quoteAlerts !== false : true
    case 'quote_accepted':
      return role === 'buyer'
        ? preferences.orderUpdates !== false
        : preferences.quoteAccepted !== false
    case 'order_fulfilled':
      return preferences.orderUpdates !== false
    case 'new_rfq':
      return role === 'supplier' ? preferences.newRFQAlerts !== false : true
    default:
      return true
  }
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
  const { user, profile } = useAuth()
  const supabase = useSupabase()
  const [notifications, setNotifications] = useState<Notification[]>([])

  const loadNotifications = useCallback(async () => {
    const role = profile?.role as ProfileRole | undefined

    if (!user || !role) {
      setNotifications([])
      return
    }

    const preferences = readPreferences(role)

    try {
      if (role === 'supplier') {
        const [quotesResponse, rfqsResponse, ordersResponse] = await Promise.all([
          supabase
            .from('quotes')
            .select('id, status, created_at, updated_at, rfq_id, rfq:rfq_id ( title )')
            .eq('supplier_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(5),
          supabase
            .from('rfqs')
            .select('id, title, created_at')
            .eq('status', 'open')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('orders')
            .select('id, status, created_at, updated_at, rfq:rfq_id ( title )')
            .eq('supplier_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(5),
        ])

        if (quotesResponse.error) throw quotesResponse.error
        if (rfqsResponse.error) throw rfqsResponse.error
        if (ordersResponse.error) throw ordersResponse.error

        const quoteRows = (quotesResponse.data ?? []) as any[]
        const quoteNotifications: Notification[] = quoteRows
          .filter(row => row.status === 'accepted')
          .map(row => {
            const rfqTitle = row.rfq?.title as string | undefined
            return {
              id: `quote-${row.id}-accepted`,
              type: 'quote_accepted' as const,
              title: 'Quote Accepted',
              message: `Buyer accepted your quote for "${rfqTitle || 'RFQ'}"`,
              read: false,
              created_at: row.updated_at || row.created_at,
              link: '/supplier/orders',
            }
          })

        const rfqRows = (rfqsResponse.data ?? []) as any[]
        const rfqNotifications: Notification[] = rfqRows.map(row => ({
          id: `rfq-${row.id}`,
          type: 'new_rfq',
          title: 'New RFQ Available',
          message: `New RFQ "${row.title}" is open for quotes.`,
          read: false,
          created_at: row.created_at,
          link: `/supplier/rfqs/${row.id}`,
        }))

        const orderRows = (ordersResponse.data ?? []) as any[]
        const orderNotifications: Notification[] = orderRows
          .filter(row => row.status === 'fulfilled')
          .map(row => {
            const rfqTitle = row.rfq?.title as string | undefined
            return {
              id: `order-${row.id}-fulfilled`,
              type: 'order_fulfilled' as const,
              title: 'Order Fulfilled',
              message: `Order for "${rfqTitle || 'RFQ'}" has been marked fulfilled.`,
              read: false,
              created_at: row.updated_at || row.created_at,
              link: `/supplier/orders/${row.id}`,
            }
          })

        const combined = [...quoteNotifications, ...rfqNotifications, ...orderNotifications]

        setNotifications(prev => {
          const readMap = new Map(prev.map(item => [item.id, item.read]))
          return combined
            .filter(notification => isNotificationEnabled(notification, role, preferences))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10)
            .map(notification => ({
              ...notification,
              read: readMap.get(notification.id) ?? notification.read,
            }))
        })
      } else {
        const [quotesResponse, ordersResponse] = await Promise.all([
          supabase
            .from('quotes')
            .select('id, status, created_at, updated_at, rfq_id, rfq:rfq_id ( id, title, buyer_id ), supplier:supplier_id ( org_name )')
            .eq('rfq.buyer_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(5),
          supabase
            .from('orders')
            .select('id, status, created_at, updated_at, rfq:rfq_id ( id, title )')
            .eq('buyer_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(5),
        ])

        if (quotesResponse.error) throw quotesResponse.error
        if (ordersResponse.error) throw ordersResponse.error

        const quoteRows = (quotesResponse.data ?? []) as any[]
        const quoteNotifications: Notification[] = quoteRows.map(row => {
          const rfqTitle = row.rfq?.title as string | undefined
          const supplierName = row.supplier?.org_name as string | undefined
          const rfqId = row.rfq?.id as string | undefined
          const status = row.status as string
          return {
            id: `quote-${row.id}-${status}`,
            type: status === 'accepted' ? 'quote_accepted' : 'new_quote',
            title: status === 'accepted' ? 'Quote Accepted' : 'New Quote Received',
            message:
              status === 'accepted'
                ? `You accepted the quote for "${rfqTitle || 'RFQ'}".`
                : `${supplierName || 'A supplier'} submitted a quote for "${rfqTitle || 'RFQ'}".`,
            read: false,
            created_at: row.updated_at || row.created_at,
            link: rfqId ? `/buyer/rfqs/${rfqId}` : '/buyer/rfqs',
          }
        })

        const orderRows = (ordersResponse.data ?? []) as any[]
        const orderNotifications: Notification[] = orderRows
          .filter(row => row.status === 'fulfilled')
          .map(row => {
            const rfqTitle = row.rfq?.title as string | undefined
            return {
              id: `order-${row.id}-fulfilled`,
              type: 'order_fulfilled' as const,
              title: 'Order Fulfilled',
              message: `Order for "${rfqTitle || 'RFQ'}" has been fulfilled.`,
              read: false,
              created_at: row.updated_at || row.created_at,
              link: `/buyer/orders/${row.id}`,
            }
          })

        const combined = [...quoteNotifications, ...orderNotifications]

        setNotifications(prev => {
          const readMap = new Map(prev.map(item => [item.id, item.read]))
          return combined
            .filter(notification => isNotificationEnabled(notification, role, preferences))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10)
            .map(notification => ({
              ...notification,
              read: readMap.get(notification.id) ?? notification.read,
            }))
        })
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }, [profile?.role, supabase, user])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = () => loadNotifications()
    window.addEventListener('procurelink:notification-preferences-updated', handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener('procurelink:notification-preferences-updated', handler)
      window.removeEventListener('storage', handler)
    }
  }, [loadNotifications])

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
