'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function BuyerAnalyticsPage() {
  return (
    <AppShell role="buyer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Procurement insights and spending analysis</p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Analytics Dashboard Coming Soon</h3>
            <Badge variant="warning" className="mb-4">⏳ Phase D Feature</Badge>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Advanced analytics and reporting will be available in a future phase. Track spending, 
              supplier performance, and procurement trends.
            </p>
            <Button asChild variant="outline">
              <Link href="/buyer/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planned Analytics</CardTitle>
            <CardDescription>Insights you'll get in future phases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Spending Analysis</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Total spend by category</li>
                  <li>• Monthly/quarterly trends</li>
                  <li>• Budget vs actual comparison</li>
                  <li>• Cost savings achieved</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Supplier Performance</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• On-time delivery rates</li>
                  <li>• Quote response times</li>
                  <li>• Quality ratings</li>
                  <li>• Price competitiveness</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Procurement Metrics</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• RFQ to order conversion</li>
                  <li>• Average lead times</li>
                  <li>• Order fulfillment rates</li>
                  <li>• Quote comparison stats</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Inventory Insights</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Stock turnover rates</li>
                  <li>• Low stock frequency</li>
                  <li>• Reorder patterns</li>
                  <li>• Carrying costs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
