'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, DollarSign, Clock, Send } from 'lucide-react'
import { useMockStore, type Quote } from '@/lib/mock-store'
import { toast } from 'sonner'

export default function SupplierRFQDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getRFQ, addQuote, getQuotesForRFQ } = useMockStore()
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [quoteData, setQuoteData] = useState({
    total_price: 0,
    currency: 'USD',
    lead_time_days: 1,
    notes: '',
  })

  const rfq = getRFQ(params?.id as string)
  const existingQuotes = getQuotesForRFQ(params?.id as string)
  const hasMyQuote = existingQuotes.length > 0 // Mock: assume supplier has only one quote

  if (!rfq) {
    return (
      <AppShell role="supplier">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">RFQ Not Found</h2>
          <p className="text-muted-foreground mb-4">This RFQ doesn't exist or has been closed.</p>
          <Button asChild>
            <Link href="/supplier/rfqs">Back to RFQs</Link>
          </Button>
        </div>
      </AppShell>
    )
  }

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault()

    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      rfq_id: rfq.id,
      supplier_id: 'supplier-1',
      supplier_name: 'Gulf Foods Trading', // Mock
      total_price: quoteData.total_price,
      currency: quoteData.currency,
      lead_time_days: quoteData.lead_time_days,
      notes: quoteData.notes || undefined,
      status: 'sent',
      created_at: new Date().toISOString(),
    }

    addQuote(newQuote)
    toast.success('Quote submitted successfully!')
    setShowQuoteForm(false)
    router.push('/supplier/quotes')
  }

  return (
    <AppShell role="supplier">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/supplier/rfqs">
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
                    <p className="text-sm text-muted-foreground">Budget Range</p>
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
                  <p className="text-sm text-muted-foreground">Posted</p>
                  <p className="font-semibold">
                    {new Date(rfq.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Required */}
        <Card>
          <CardHeader>
            <CardTitle>Items Requested ({rfq.items.length})</CardTitle>
            <CardDescription>Products the buyer needs</CardDescription>
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
                  {rfq.items.map((item) => (
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

        {/* Submit Quote Section */}
        {hasMyQuote ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Quote</CardTitle>
              <CardDescription>You have already submitted a quote for this RFQ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Send className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Quote Submitted
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      The buyer will review your quote and may accept it to create an order.
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/supplier/quotes">View My Quotes</Link>
              </Button>
            </CardContent>
          </Card>
        ) : !showQuoteForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Quote</CardTitle>
              <CardDescription>Provide pricing and lead time for this RFQ</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowQuoteForm(true)}>
                <Send className="h-4 w-4 mr-2" />
                Submit Quote
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Submit Quote</CardTitle>
              <CardDescription>Fill in your pricing and delivery details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Total Price *</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={quoteData.total_price || ''}
                      onChange={(e) =>
                        setQuoteData({ ...quoteData, total_price: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Currency *</label>
                    <Input
                      required
                      placeholder="USD, EUR, QAR"
                      value={quoteData.currency}
                      onChange={(e) => setQuoteData({ ...quoteData, currency: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Lead Time (days) *</label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={quoteData.lead_time_days}
                    onChange={(e) =>
                      setQuoteData({ ...quoteData, lead_time_days: parseInt(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                  <Textarea
                    placeholder="Additional information about your quote..."
                    rows={4}
                    value={quoteData.notes}
                    onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Quote
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowQuoteForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
