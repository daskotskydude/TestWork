'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function SupplierOrdersPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage accepted orders and deliveries</p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Orders Coming Soon</h3>
            <Badge variant="warning" className="mb-4">⏳ Phase C Feature</Badge>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Order management will be available in Phase C when Supabase is integrated. 
              You'll be able to view orders, update delivery status, and track payments.
            </p>
            <Button asChild variant="outline">
              <Link href="/supplier/quotes">View Your Quotes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
