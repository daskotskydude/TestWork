'use client'

import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText } from 'lucide-react'
import { useMockStore } from '@/lib/mock-store'

export default function BuyerRFQsPage() {
  const { rfqs } = useMockStore()

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My RFQs</h1>
            <p className="text-muted-foreground">Manage your procurement requests</p>
          </div>
          <Button asChild>
            <Link href="/buyer/rfqs/new">
              <Plus className="h-4 w-4 mr-2" />
              New RFQ
            </Link>
          </Button>
        </div>

        {/* RFQs List */}
        <div className="space-y-3">
          {rfqs.map((rfq) => (
            <Link key={rfq.id} href={`/buyer/rfqs/${rfq.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{rfq.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rfq.description}
                      </p>
                    </div>
                    <Badge variant={rfq.status === 'open' ? 'success' : 'secondary'}>
                      {rfq.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>{rfq.items.length} items</span>
                    <span>Category: {rfq.category}</span>
                    {rfq.budget_max && (
                      <span>Budget: up to ${rfq.budget_max.toLocaleString()}</span>
                    )}
                    <span>Created {new Date(rfq.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {rfqs.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No RFQs yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first RFQ to start receiving quotes from suppliers
                </p>
                <Button asChild>
                  <Link href="/buyer/rfqs/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First RFQ
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  )
}
