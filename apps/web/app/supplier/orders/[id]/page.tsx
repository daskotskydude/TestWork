'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, DollarSign, Clock, User, CheckCircle, Loader2, Truck } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { getOrder, updateOrderStatus } from '@/../../packages/lib/data'
import type { Order } from '@/../../packages/lib/supabaseClient'
import { toast } from 'sonner'

export default function SupplierOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = useSupabase()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadOrder()
  }, [params?.id, user])

  async function loadOrder() {
    if (!params?.id || !user) return

    try {
      const orderId = params.id as string
      const orderData = await getOrder(supabase, orderId)
      setOrder(orderData)
    } catch (error) {
      console.error('Failed to load order:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(newStatus: 'created' | 'fulfilled' | 'cancelled') {
    if (!order || !user) return

    setUpdating(true)
    try {
      await updateOrderStatus(supabase, order.id, newStatus)
      setOrder({ ...order, status: newStatus })
      toast.success(`Order marked as ${newStatus}`)
    } catch (error) {
      console.error('Failed to update order status:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
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

  if (!order) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">This order doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/supplier/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </AppShell>
    )
  }

  // Extract nested data
  const buyer = (order as any).buyer || { org_name: 'Unknown Buyer' }
  const supplier = (order as any).supplier || { org_name: 'Unknown Supplier' }
  const rfq = (order as any).rfq || null

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/supplier/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order Details</h1>
              <p className="text-muted-foreground">PO #{order.po_number}</p>
            </div>
            <div className="flex gap-2 items-center">
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
              {order.status === 'created' && (
                <Button 
                  onClick={() => handleUpdateStatus('fulfilled')}
                  disabled={updating}
                  size="sm"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Fulfilled
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Buyer</p>
                  <p className="font-semibold">{buyer.org_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Order Value</p>
                  <p className="font-semibold">
                    {order.currency} {order.total_price.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Lead Time</p>
                  <p className="font-semibold">{order.lead_time_days} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{order.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Purchase order details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Buyer Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Organization:</span>
                    <span className="ml-2 font-medium">{buyer.org_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-2 font-medium">{buyer.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Order Date:</span>
                    <span className="ml-2 font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Order Details</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">PO Number:</span>
                    <span className="ml-2 font-medium">{order.po_number}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quote ID:</span>
                    <span className="ml-2 font-medium">{order.quote_id.substring(0, 8)}...</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">RFQ:</span>
                    <span className="ml-2 font-medium">{rfq?.title || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              {rfq ? `From RFQ: ${rfq.title}` : 'Order details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rfq && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">RFQ Details</h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    <strong>Category:</strong> {rfq.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Description:</strong> {rfq.description}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Order Value</p>
                  <p className="text-2xl font-bold">
                    {order.currency} {order.total_price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Delivery Timeline</p>
                  <p className="text-lg font-semibold">{order.lead_time_days} days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {order.status === 'created' && (
          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
              <CardDescription>Manage order fulfillment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleUpdateStatus('fulfilled')}
                  disabled={updating}
                  className="flex-1"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4 mr-2" />
                      Mark as Fulfilled & Shipped
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={updating}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel Order
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Mark as fulfilled when the order has been prepared and shipped to the buyer.
              </p>
            </CardContent>
          </Card>
        )}

        {order.status === 'fulfilled' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Order Fulfilled</p>
                  <p className="text-sm text-green-700">
                    This order has been marked as fulfilled and shipped.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
