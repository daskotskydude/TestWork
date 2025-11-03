'use client'

import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Send } from 'lucide-react'
import { useMockStore } from '@/lib/mock-store'

export default function SupplierRFQsPage() {
  const { rfqs, quotes } = useMockStore()

  // Mock: show all open RFQs (in real app, would filter by supplier's capabilities/categories)
  const openRFQs = rfqs.filter((r) => r.status === 'open')

  const hasQuotedForRFQ = (rfqId: string) => {
    return quotes.some((q) => q.rfq_id === rfqId)
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
                        <span>{rfq.items.length} items</span>
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
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="font-medium mb-1">Items Requested:</p>
                      <div className="flex flex-wrap gap-2">
                        {rfq.items.slice(0, 3).map((item) => (
                          <Badge key={item.id} variant="outline">
                            {item.name} ({item.qty} {item.unit})
                          </Badge>
                        ))}
                        {rfq.items.length > 3 && (
                          <Badge variant="outline">+{rfq.items.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/supplier/rfqs/${rfq.id}`}>View Details</Link>
                      </Button>
                      {!alreadyQuoted && (
                        <Button asChild size="sm">
                          <Link href={`/supplier/rfqs/${rfq.id}`}>Submit Quote</Link>
                        </Button>
                      )}
                    </div>
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
