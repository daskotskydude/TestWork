'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Package, Search, Loader2, Eye } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { listOrders } from '@/../../packages/lib/data'
import type { Order } from '@/../../packages/lib/supabaseClient'
import { toast } from 'sonner'

export default function BuyerOrdersPage() {
  const { user } = useAuth()
  const supabase = useSupabase()
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'created' | 'fulfilled' | 'cancelled'>('all')

  useEffect(() => {
    loadOrders()
  }, [user])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  async function loadOrders() {
    if (!user) return

    try {
      const data = await listOrders(supabase)
      setOrders(data)
    } catch (error) {
      console.error('Failed to load orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  function filterOrders() {
    let filtered = orders

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Filter by search term (PO number or supplier name)
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.supplier?.org_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredOrders(filtered)
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">View and manage your purchase orders</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'created').length}</div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{orders.filter(o => o.status === 'fulfilled').length}</div>
              <p className="text-xs text-muted-foreground">Fulfilled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {orders.reduce((sum, o) => sum + Number(o.total_price), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total Spent (USD)</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by PO number or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'created' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('created')}
                  size="sm"
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'fulfilled' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('fulfilled')}
                  size="sm"
                >
                  Fulfilled
                </Button>
                <Button
                  variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('cancelled')}
                  size="sm"
                >
                  Cancelled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>Your purchase orders from suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">
                  {orders.length === 0 
                    ? "You haven't placed any orders yet." 
                    : "No orders match your filters."}
                </p>
                {orders.length === 0 && (
                  <Button asChild>
                    <Link href="/buyer/rfqs/new">Create Your First RFQ</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">PO Number</th>
                      <th className="pb-3 font-medium">Supplier</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-accent/50">
                        <td className="py-3 font-medium">{order.po_number}</td>
                        <td className="py-3">{order.supplier?.org_name || 'Unknown'}</td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          {order.currency} {Number(order.total_price).toLocaleString()}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              order.status === 'fulfilled'
                                ? 'success'
                                : order.status === 'cancelled'
                                ? 'error'
                                : 'secondary'
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/buyer/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
