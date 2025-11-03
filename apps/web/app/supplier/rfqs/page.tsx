'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Send, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { listRFQs, listQuotesBySupplier } from '@/../../packages/lib/data'
import type { RFQ, Quote } from '@/../../packages/lib/supabaseClient'

export default function SupplierRFQsPage() {
  const { user } = useAuth()
  const supabase = useSupabase()
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        const [rfqsData, quotesData] = await Promise.all([
          listRFQs(supabase),
          listQuotesBySupplier(supabase, user.id),
        ])

        setRfqs(rfqsData.filter(r => r.status === 'open'))
        setQuotes(quotesData)
      } catch (error) {
        console.error('Failed to load RFQs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, supabase])

  const openRFQs = rfqs

  const hasQuotedForRFQ = (rfqId: string) => {
    return quotes.some((q) => q.rfq_id === rfqId)
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
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
          <h1 className="text-3xl font-bold">RFQs Inbox</h1>
          <p className="text-muted-foreground">Available procurement opportunities</p>
        </div>

        {/* RFQs List */}
        <div className="space-y-3">
          {openRFQs.map((rfq) => {
            const alreadyQuoted = hasQuotedForRFQ(rfq.id)
            
            return (
              <Card key={rfq.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{rfq.title}</CardTitle>
                        {alreadyQuoted && (
                          <Badge variant="success">
                            <Send className="h-3 w-3 mr-1" />
                            Quote Sent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {rfq.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Category: {rfq.category}</span>
                        {rfq.budget_max && (
                          <span>Budget: up to ${rfq.budget_max.toLocaleString()}</span>
                        )}
                        <span>Posted {new Date(rfq.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/supplier/rfqs/${rfq.id}`}>View Details</Link>
                    </Button>
                    {!alreadyQuoted && (
                      <Button asChild size="sm">
                        <Link href={`/supplier/rfqs/${rfq.id}`}>Submit Quote</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {openRFQs.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Open RFQs</h3>
                <p className="text-muted-foreground">
                  There are no open procurement requests at the moment. Check back later!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  )
}
