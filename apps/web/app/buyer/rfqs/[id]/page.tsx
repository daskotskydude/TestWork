'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Package, DollarSign, Clock, Check, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { getRFQ, getRFQItems, listQuotes, createOrder, updateQuoteStatus, updateRFQStatus } from '@/../../packages/lib/data'
import type { RFQ, RFQItem, Quote } from '@/../../packages/lib/supabaseClient'
import { toast } from 'sonner'

export default function RFQDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = useSupabase()
  const [rfq, setRfq] = useState<RFQ | null>(null)
  const [rfqItems, setRfqItems] = useState<RFQItem[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [quoteData, setQuoteData] = useState({
    total_price: 0,
    currency: 'USD',
    lead_time_days: 0,
    notes: '',
  })

  useEffect(() => {
    async function loadRFQData() {
      if (!user || !params?.id) return

      try {
        const [rfqData, itemsData, quotesData] = await Promise.all([
          getRFQ(supabase, params.id as string),
          getRFQItems(supabase, params.id as string),
          listQuotes(supabase, params.id as string),
        ])

        setRfq(rfqData)
        setRfqItems(itemsData)
        setQuotes(quotesData)
      } catch (error) {
        console.error('Failed to load RFQ:', error)
        toast.error('Failed to load RFQ details')
      } finally {
        setLoading(false)
      }
    }

    loadRFQData()
  }, [user, params?.id, supabase])

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    )
  }

  if (!rfq) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">RFQ Not Found</h2>
          <p className="text-muted-foreground mb-4">This RFQ doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/buyer/rfqs">Back to RFQs</Link>
          </Button>
        </div>
      </AppShell>
    )
  }

  const handleAcceptQuote = async (quoteId: string) => {
    if (!user || !rfq) return

    try {
      const quote = quotes.find(q => q.id === quoteId)
      if (!quote) return

      // Create the order
      const order = await createOrder(supabase, {
        rfq_id: rfq.id,
        quote_id: quoteId,
        buyer_id: user.id,
        supplier_id: quote.supplier_id,
        total_price: quote.total_price,
        currency: quote.currency,
        lead_time_days: quote.lead_time_days,
      })

      // Update quote status to accepted
      await updateQuoteStatus(supabase, quoteId, 'accepted')

      // Close the RFQ
      await updateRFQStatus(supabase, rfq.id, 'closed')

      toast.success('Quote accepted! Order created.')
      router.push(`/buyer/orders/${order.id}`)
    } catch (error) {
      console.error('Failed to accept quote:', error)
      toast.error('Failed to accept quote. Please try again.')
    }
  }

  const handleRejectQuote = async (quoteId: string) => {
    if (!user) return

    try {
      await updateQuoteStatus(supabase, quoteId, 'rejected')
      
      // Update local state
      setQuotes(quotes.map(q => 
        q.id === quoteId ? { ...q, status: 'rejected' as const } : q
      ))
      
      toast.success('Quote rejected')
    } catch (error) {
      console.error('Failed to reject quote:', error)
      toast.error('Failed to reject quote. Please try again.')
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/buyer/rfqs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to RFQs
            </Link>
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{rfq.title}</h1>
              <p className="text-muted-foreground">{rfq.description}</p>
            </div>
            <Badge variant={rfq.status === 'open' ? 'success' : 'secondary'}>
              {rfq.status}
            </Badge>
          </div>
        </div>

        {/* RFQ Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{rfq.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {rfq.budget_max && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">
                      ${rfq.budget_min?.toLocaleString()} - ${rfq.budget_max.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold">
                    {new Date(rfq.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items ({rfqItems.length})</CardTitle>
            <CardDescription>Products requested in this RFQ</CardDescription>
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
                    <th className="pb-3 font-medium">Target Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 font-medium">{item.name}</td>
                      <td className="py-3 text-sm text-muted-foreground">{item.sku || '-'}</td>
                      <td className="py-3">{item.qty}</td>
                      <td className="py-3">{item.unit}</td>
                      <td className="py-3">
                        {item.target_price ? `$${item.target_price}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quotes Received */}
        <Card>
          <CardHeader>
            <CardTitle>Quotes Received ({quotes.length})</CardTitle>
            <CardDescription>
              {quotes.length === 0
                ? 'No quotes yet. Suppliers will submit their quotes soon.'
                : 'Review and accept a quote to create an order'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Waiting for supplier quotes...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">Supplier Quote</h4>
                        <p className="text-sm text-muted-foreground">
                          Submitted {new Date(quote.created_at).toLocaleDateString()}
                        </p>
                      </div>
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

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="font-semibold text-lg">
                          {quote.currency} {quote.total_price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lead Time</p>
                        <p className="font-semibold">{quote.lead_time_days} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Currency</p>
                        <p className="font-semibold">{quote.currency}</p>
                      </div>
                    </div>

                    {quote.notes && (
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm">{quote.notes}</p>
                      </div>
                    )}

                    {quote.status === 'sent' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptQuote(quote.id)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept Quote
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRejectQuote(quote.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
