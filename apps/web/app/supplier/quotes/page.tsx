'use client'

import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { useState, useEffect } from 'react'

interface Quote {
  id: string
  rfq_id: string
  supplier_id: string
  total_price: number
  currency: string
  lead_time_days: number
  notes: string | null
  status: 'sent' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

interface RFQ {
  id: string
  title: string
  description: string
}

export default function SupplierQuotesPage() {
  const { user, profile } = useAuth()
  const supabase = useSupabase()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [rfqMap, setRfqMap] = useState<Record<string, RFQ>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuotes() {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('*')
          .eq('supplier_id', user.id)
          .order('created_at', { ascending: false })

        if (quotesError) throw quotesError

        const quotes = (quotesData || []) as Quote[]
        setQuotes(quotes)

        // Fetch associated RFQs
        const rfqIds = [...new Set(quotes.map(q => q.rfq_id))]
        if (rfqIds.length > 0) {
          const { data: rfqsData, error: rfqsError } = await supabase
            .from('rfqs')
            .select('id, title, description')
            .in('id', rfqIds)

          if (rfqsError) throw rfqsError

          const map: Record<string, RFQ> = {}
          ;(rfqsData || []).forEach((rfq: any) => {
            map[rfq.id] = rfq
          })
          setRfqMap(map)
        }
      } catch (error) {
        console.error('Failed to fetch quotes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [user, supabase])

  const myQuotes = quotes

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Quotes Sent</h1>
            <p className="text-muted-foreground">Track your submitted quotes and their status</p>
          </div>
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Loading quotes...</p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Quotes Sent</h1>
          <p className="text-muted-foreground">Track your submitted quotes and their status</p>
        </div>

        {/* Quotes List */}
        <div className="space-y-3">
          {myQuotes.map((quote) => {
            const rfq = rfqMap[quote.rfq_id]

            return (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">
                          {rfq?.title || 'RFQ Not Found'}
                        </CardTitle>
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
                      {rfq && (
                        <p className="text-sm text-muted-foreground mb-2">{rfq.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Submitted {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
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
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-semibold capitalize">{quote.status}</p>
                    </div>
                  </div>

                  {quote.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{quote.notes}</p>
                    </div>
                  )}

                  {quote.status === 'accepted' && (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-sm text-green-900 dark:text-green-100">
                        🎉 <strong>Congratulations!</strong> Your quote was accepted and an order has been created.
                      </p>
                    </div>
                  )}

                  {rfq && (
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/supplier/rfqs/${rfq.id}`}>View Original RFQ</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {myQuotes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Send className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Quotes Sent Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by submitting quotes to open RFQs
                </p>
                <Button asChild>
                  <Link href="/supplier/rfqs">Browse Open RFQs</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  )
}
