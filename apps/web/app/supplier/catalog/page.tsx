'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'
import Link from 'next/link'

export default function SupplierCatalogPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <p className="text-muted-foreground">Manage your products and pricing</p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Catalog Management Coming Soon</h3>
            <Badge variant="warning" className="mb-4">⏳ Phase C Feature</Badge>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Product catalog management will be available in Phase C. You'll be able to add, 
              edit, and organize your products, set pricing, manage stock levels, and upload 
              product images.
            </p>
            <div className="space-x-2">
              <Button asChild variant="outline">
                <Link href="/supplier/dashboard">Back to Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/supplier/rfqs">Browse RFQs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planned Features</CardTitle>
            <CardDescription>What you'll be able to do with catalog management</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Upload product catalog via CSV file</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Add/edit products individually with rich details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Set pricing, MOQ (Minimum Order Quantity), and stock levels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Upload product images and specifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Organize products by categories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Make products visible to specific buyer types</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
