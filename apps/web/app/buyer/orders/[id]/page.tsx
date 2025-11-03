'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Printer, Package, DollarSign, Clock, User } from 'lucide-react'
import { useMockStore } from '@/lib/mock-store'

export default function OrderDetailPage() {
  const params = useParams()
  const { getOrder, getRFQ } = useMockStore()

  const order = getOrder(params?.id as string)
  const rfq = order ? getRFQ(order.rfq_id) : null

  if (!order) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">This order doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/buyer/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </AppShell>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="print:hidden">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/buyer/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Purchase Order</h1>
              <p className="text-muted-foreground">PO #{order.po_number}</p>
            </div>
            <div className="flex gap-2">
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
              <Button onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print PO
              </Button>
            </div>
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Purchase Order</h1>
              <p className="text-lg">PO #{order.po_number}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg">{order.buyer_name}</p>
              <p className="text-sm text-gray-600">Buyer</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-semibold">{order.supplier_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
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
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Details from the accepted quote</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Buyer Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Organization:</span>
                    <span className="ml-2 font-medium">{order.buyer_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Order Date:</span>
                    <span className="ml-2 font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">PO Number:</span>
                    <span className="ml-2 font-medium">{order.po_number}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Supplier Information</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <span className="ml-2 font-medium">{order.supplier_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quote ID:</span>
                    <span className="ml-2 font-medium">{order.quote_id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">RFQ ID:</span>
                    <span className="ml-2 font-medium">{order.rfq_id}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items from RFQ */}
        {rfq && (
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Products from RFQ: {rfq.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Item Name</th>
                      <th className="pb-3 font-medium">SKU</th>
                      <th className="pb-3 font-medium">Quantity</th>
                      <th className="pb-3 font-medium">Unit</th>
                      <th className="pb-3 font-medium text-right">Target Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rfq.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 font-medium">{item.name}</td>
                        <td className="py-3 text-sm text-muted-foreground">{item.sku || '-'}</td>
                        <td className="py-3">{item.qty}</td>
                        <td className="py-3">{item.unit}</td>
                        <td className="py-3 text-right">
                          {item.target_price ? `$${item.target_price}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td colSpan={4} className="py-3 text-right font-semibold">
                        Total Amount:
                      </td>
                      <td className="py-3 text-right font-semibold text-lg">
                        {order.currency} {order.total_price.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment & Delivery Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="warning">⏳ Coming in Phase C</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Payment terms and methods will be configured in Phase C when Supabase is integrated.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Expected Delivery:</span>
                  <span className="ml-2 font-medium">
                    {new Date(
                      new Date(order.created_at).getTime() + order.lead_time_days * 86400000
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Lead Time:</span>
                  <span className="ml-2 font-medium">{order.lead_time_days} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            .print\\:hidden {
              display: none !important;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}</style>
      </div>
    </AppShell>
  )
}
