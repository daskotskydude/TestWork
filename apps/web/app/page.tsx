'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, ShoppingCart, Package, TrendingUp, BarChart3, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">PL</span>
            </div>
            <span className="text-xl font-bold">ProcureLink</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/browse-suppliers">Browse Suppliers</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/buyer-register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
            ✅ Now Live - Start Procuring Today!
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Streamline Your B2B <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Procurement Process
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect buyers with suppliers. Request quotes, compare prices, place orders, and track deliveries—all in one platform.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg" className="text-lg px-8 h-12">
              <Link href="/buyer-register">Register as Buyer</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 h-12">
              <Link href="/supplier-register">Register as Supplier</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Free to start · No credit card required · 2-minute setup
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need for B2B Procurement</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From RFQ creation to order fulfillment, manage your entire procurement workflow in one place
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
            <CardHeader>
              <FileText className="w-12 h-12 text-blue-600 mb-3" />
              <CardTitle className="text-lg">Create RFQs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Multi-step wizard for detailed procurement requests with line items and specifications
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-200 dark:hover:border-green-800 transition-colors">
            <CardHeader>
              <Users className="w-12 h-12 text-green-600 mb-3" />
              <CardTitle className="text-lg">Compare Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Receive competitive quotes from multiple suppliers and compare pricing side-by-side
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
            <CardHeader>
              <ShoppingCart className="w-12 h-12 text-purple-600 mb-3" />
              <CardTitle className="text-lg">Place Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Convert quotes to purchase orders with automatic PO number generation
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
            <CardHeader>
              <Package className="w-12 h-12 text-orange-600 mb-3" />
              <CardTitle className="text-lg">Track Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time inventory management with low-stock alerts and reorder workflows
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose ProcureLink */}
      <section className="container mx-auto px-4 py-16 bg-white dark:bg-gray-900">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose ProcureLink?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Lightning Fast Setup</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get started in minutes. No complex configuration or long onboarding process.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Enterprise-Grade Security</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Row-level security, rate limiting, and bot protection keep your data safe.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Real-Time Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Track spending, supplier performance, and procurement efficiency in real-time.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Cost Savings</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Compare quotes from multiple suppliers to get the best prices every time.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-8">
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active RFQs</span>
                  <span className="text-2xl font-bold text-blue-600">12</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Quotes Received</span>
                  <span className="text-2xl font-bold text-green-600">28</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Orders Placed</span>
                  <span className="text-2xl font-bold text-purple-600">8</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of buyers and suppliers streamlining their procurement process. Sign up today and experience the future of B2B commerce.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 h-12">
              <Link href="/buyer-register">Start as Buyer</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 h-12 bg-white/10 border-white text-white hover:bg-white/20">
              <Link href="/supplier-register">Start as Supplier</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm mb-2">
            ProcureLink · Built with Next.js, Supabase, and Tailwind CSS
          </p>
          <p className="text-xs">
            Secure · Fast · Reliable · Enterprise-Ready
          </p>
        </div>
      </footer>
    </div>
  )
}
