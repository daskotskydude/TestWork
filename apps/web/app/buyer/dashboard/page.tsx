'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Package, ShoppingCart, TrendingUp, Plus } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { listRFQs, listOrders, listInventory } from '@/../../packages/lib/data'
import type { RFQ, Order, InventoryItem } from '@/../../packages/lib/supabaseClient'

export default function BuyerDashboardPage() {
  const { user } = useAuth()
  const supabase = useSupabase()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        const [rfqsData, ordersData, inventoryData] = await Promise.all([
          listRFQs(supabase),
          listOrders(supabase),
          listInventory(supabase, user.id),
        ])

        setRfqs(rfqsData)
        setOrders(ordersData)
        setInventory(inventoryData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, supabase])

  const stats = [
    {
      title: 'Active RFQs',
      value: rfqs.filter((r) => r.status === 'open').length,
      icon: FileText,
      color: 'text-blue-600',
      href: '/buyer/rfqs',
    },
    {
      title: 'Total Orders',
      value: orders.filter((o) => o.status === 'created').length,
      icon: ShoppingCart,
      color: 'text-orange-600',
      href: '/buyer/orders',
    },
    {
      title: 'Inventory Items',
      value: inventory.length,
      icon: Package,
      color: 'text-purple-600',
      href: '/buyer/inventory',
    },
    {
      title: 'Low Stock Alerts',
      value: inventory.filter((i) => i.qty <= i.reorder_level).length,
      icon: TrendingUp,
      color: 'text-red-600',
      href: '/buyer/inventory',
    },
  ]

  const recentRFQs = rfqs.slice(0, 3)

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
          </div>
          <Button asChild>
            <Link href="/buyer/rfqs/new">
              <Plus className="h-4 w-4 mr-2" />
              New RFQ
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <Icon className={`h-10 w-10 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent RFQs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent RFQs</CardTitle>
                <CardDescription>Your latest procurement requests</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/buyer/rfqs">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRFQs.map((rfq) => (
                <Link
                  key={rfq.id}
                  href={`/buyer/rfqs/${rfq.id}`}
                  className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{rfq.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {rfq.category} • Created {new Date(rfq.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={rfq.status === 'open' ? 'success' : 'secondary'}>
                      {rfq.status}
                    </Badge>
                  </div>
                </Link>
              ))}
              {recentRFQs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No RFQs yet. Create your first one to get started!</p>
                  <Button asChild className="mt-4" size="sm">
                    <Link href="/buyer/rfqs/new">Create RFQ</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mock Data Notice */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>📍 Phase B:</strong> All data shown is mock/local data. Your changes are 
            saved in browser localStorage. Phase C will add Supabase for real persistence.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
