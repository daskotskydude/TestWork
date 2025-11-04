'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, DollarSign, Package, Users } from 'lucide-react'
import Link from 'next/link'

export default function BuyerAnalyticsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Procurement insights and spending analysis</p>
        </div>

        {/* Quick Stats Preview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spend</p>
                  <h3 className="text-2xl font-bold">$0</h3>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orders Placed</p>
                  <h3 className="text-2xl font-bold">0</h3>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Suppliers</p>
                  <h3 className="text-2xl font-bold">0</h3>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Lead Time</p>
                  <h3 className="text-2xl font-bold">0 days</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Advanced Analytics
            </CardTitle>
            <CardDescription>Detailed charts and insights coming in Phase 2</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              Charts, graphs, and trend analysis will be available once you have order history
            </p>
            <Badge variant="outline">Enhanced analytics in Phase 2</Badge>
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
