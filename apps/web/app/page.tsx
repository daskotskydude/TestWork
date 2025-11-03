'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Users, Package, TrendingUp, Check } from 'lucide-react'

export default function HomePage() {
  const pages = [
    { name: 'Component Gallery', href: '/preview', status: 'complete' },
    { name: 'How It Works', href: '/how-it-works', status: 'complete' },
    { name: 'Browse Suppliers', href: '/browse-suppliers', status: 'complete' },
    { name: 'Buyer Dashboard', href: '/buyer/dashboard', status: 'complete' },
    { name: 'Buyer RFQ Wizard', href: '/buyer/rfqs/new', status: 'complete' },
    { name: 'Buyer Inventory', href: '/buyer/inventory', status: 'complete' },
    { name: 'Supplier Dashboard', href: '/supplier/dashboard', status: 'complete' },
    { name: 'Supplier Onboarding', href: '/supplier/setup', status: 'complete' },
    { name: 'Quote Submission', href: '/supplier/rfqs', status: 'complete' },
    { name: 'Auth (Supabase)', href: '#', status: 'coming-soon' },
    { name: 'Live Data Wiring', href: '#', status: 'coming-soon' },
    { name: 'Payments/Escrow', href: '#', status: 'planned' },
  ]

  const statusConfig = {
    complete: { label: '✅ Complete (UI-only)', variant: 'success' as const },
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
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            One platform to request, quote, order, and track stock
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/preview">View Component Gallery</Link>
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
            <CardTitle>📊 Build Status</CardTitle>
            <CardDescription>
              Current development phase: <strong>Phase B - UI Scaffold (Mock Data)</strong>
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

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>📍 You are here:</strong> All UI screens are built with mock data. 
                Phase C will wire Supabase for live authentication and data persistence.
              </p>
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
          Phase B: UI Scaffold (Mock Data) · See <Link href="/preview" className="underline">Component Gallery</Link>
        </p>
      </footer>
    </div>
  )
}
