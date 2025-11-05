'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Send, ShoppingCart, Package } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { listRFQs, listProducts, listQuotesBySupplier, listOrders } from '@/../../packages/lib/data'
import type { RFQ, Product, Quote, Order } from '@/../../packages/lib/supabaseClient'
import { RoleIndicator } from '@/components/theme/RoleIndicator'

export default function SupplierDashboardPage() {
  const { user, profile } = useAuth()
  const supabase = useSupabase()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user || !profile?.role) return

      try {
        const [rfqsData, productsData, quotesData, ordersData] = await Promise.all([
          listRFQs(supabase, { role: profile?.role }),
          listProducts(supabase, user.id),
          listQuotesBySupplier(supabase, user.id),
          listOrders(supabase),
        ])

        setRfqs(rfqsData.filter(r => r.status === 'open'))
        setProducts(productsData)
        setQuotes(quotesData)
        setOrders(ordersData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, profile?.role, supabase])

  const openRFQs = rfqs
  const myQuotes = quotes

  const stats = [
    {
      title: 'Open RFQs',
      value: openRFQs.length,
      subtitle: 'opportunities',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      href: '/supplier/rfqs',
    },
    {
      title: 'Quotes Sent',
      value: myQuotes.length,
      subtitle: `${myQuotes.filter(q => q.status === 'accepted').length} accepted`,
      icon: Send,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      href: '/supplier/quotes',
    },
    {
      title: 'Active Orders',
      value: orders.filter(o => o.status === 'created').length,
      subtitle: `${orders.filter(o => o.status === 'fulfilled').length} fulfilled`,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      href: '/supplier/orders',
    },
    {
      title: 'Catalog Items',
      value: products.length,
      subtitle: `${products.filter(p => Number(p.stock) > 0).length} in stock`,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      href: '/supplier/catalog',
    },
  ]

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
            <RoleIndicator role="supplier" />
          </div>
          <p className="text-muted-foreground">Manage RFQs, quotes, and orders</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        {stat.subtitle && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.subtitle}
                          </p>
                        )}
                      </div>
                      <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Open RFQs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Open RFQs</CardTitle>
                <CardDescription>Opportunities to submit quotes</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/supplier/rfqs">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {openRFQs.slice(0, 3).map((rfq) => (
                <div
                  key={rfq.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{rfq.title}</p>
                    <Badge variant="success">Open</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rfq.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {rfq.category}
                    </span>
                    <Button asChild size="sm">
                      <Link href={`/supplier/rfqs/${rfq.id}`}>Submit Quote</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {openRFQs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No open RFQs at the moment. Check back later!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Quotes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Quotes</CardTitle>
                <CardDescription>Quotes you've submitted</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/supplier/quotes">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {myQuotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Send className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No quotes submitted yet. Start by responding to open RFQs!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myQuotes.slice(0, 3).map((quote) => {
                  const rfq = rfqs.find((r) => r.id === quote.rfq_id)
                  return (
                    <div key={quote.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{rfq?.title || 'RFQ'}</p>
                        <Badge
                          variant={
                            quote.status === 'accepted'
                              ? 'success'
                              : quote.status === 'rejected'
                              ? 'error'
                              : 'secondary'
                          }
                        >
                          {quote.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total: {quote.currency} {quote.total_price.toLocaleString()} • 
                        Lead time: {quote.lead_time_days} days
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
