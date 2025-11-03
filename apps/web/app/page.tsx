'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Users, Package, TrendingUp, Check } from 'lucide-react'

export default function HomePage() {
  const pages = [
    { name: 'Authentication & Login', href: '/login', status: 'complete' },
    { name: 'Buyer Registration', href: '/buyer-register', status: 'complete' },
    { name: 'Supplier Registration', href: '/supplier-register', status: 'complete' },
    { name: 'Buyer Dashboard (Live Data)', href: '/buyer/dashboard', status: 'complete' },
    { name: 'Supplier Dashboard (Live Data)', href: '/supplier/dashboard', status: 'complete' },
    { name: 'Create RFQ → Supabase', href: '/buyer/rfqs/new', status: 'complete' },
    { name: 'RFQ List (Live)', href: '/buyer/rfqs', status: 'complete' },
    { name: 'Inventory Management (CRUD)', href: '/buyer/inventory', status: 'complete' },
    { name: 'Product Catalog (CRUD)', href: '/supplier/catalog', status: 'complete' },
    { name: 'Supplier RFQ Inbox', href: '/supplier/rfqs', status: 'complete' },
    { name: 'Quote Submission', href: '/supplier/rfqs', status: 'in-progress' },
    { name: 'RFQ Detail Pages', href: '#', status: 'in-progress' },
    { name: 'Order Management', href: '#', status: 'coming-soon' },
    { name: 'Payments/Escrow', href: '#', status: 'planned' },
  ]

  const statusConfig = {
    complete: { label: '✅ Complete', variant: 'success' as const },
    'in-progress': { label: '🟡 In Progress', variant: 'warning' as const },
    'coming-soon': { label: '⏳ Coming Soon', variant: 'secondary' as const },
    planned: { label: '📋 Planned', variant: 'outline' as const },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ProcureLink
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            One platform to request, quote, order, and track stock
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-8">
            ✅ Now with live authentication & database integration!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg">
              <Link href="/login">Login / Try Demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/browse-suppliers">Browse Suppliers</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Create RFQs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Multi-step wizard for detailed procurement requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle className="text-lg">Receive Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Suppliers respond with competitive pricing and lead times
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Package className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Track Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Convert quotes to orders with full status tracking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle className="text-lg">Manage Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Low-stock alerts and seamless reorder workflows
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Build Status Panel */}
      <section className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>� Build Status</CardTitle>
            <CardDescription>
              Current development phase: <strong>Phase C Complete - Supabase Integration & Auth</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pages.map((page) => (
                <div
                  key={page.name}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {page.status === 'complete' && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    <span className="font-medium">{page.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusConfig[page.status as keyof typeof statusConfig].variant}>
                      {statusConfig[page.status as keyof typeof statusConfig].label}
                    </Badge>
                    {page.href !== '#' && (
                      <Button asChild size="sm" variant="ghost">
                        <Link href={page.href}>View →</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-900 dark:text-green-100 mb-2">
                <strong>✅ Phase C Complete:</strong> Full Supabase integration with authentication and live data!
              </p>
              <ul className="text-xs text-green-800 dark:text-green-200 space-y-1 ml-4">
                <li>• Authentication with email/password (Supabase Auth)</li>
                <li>• Real-time data fetching from PostgreSQL database</li>
                <li>• Row-Level Security (RLS) policies enforced</li>
                <li>• CRUD operations for RFQs, Inventory, and Products</li>
                <li>• Route protection with middleware</li>
                <li>• Role-based dashboards (Buyer/Supplier)</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>🧪 Test Accounts:</strong>
              </p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  <div className="font-semibold text-blue-600">Buyer Account</div>
                  <div>Email: buyer@test.dev</div>
                  <div>Password: test123</div>
                </div>
                <div className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  <div className="font-semibold text-purple-600">Supplier Account</div>
                  <div>Email: supplier@test.dev</div>
                  <div>Password: test123</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p className="text-sm">
          ProcureLink · Built with Next.js, Supabase, and Tailwind CSS
        </p>
        <p className="text-xs mt-2">
          Phase C Complete: Live Authentication & Data · Database: PostgreSQL with RLS · 
          <Link href="/login" className="underline ml-1">Try It Now</Link>
        </p>
      </footer>
    </div>
  )
}
