'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, FileText, Users, ShoppingCart } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">PL</span>
            </div>
            <span className="font-bold text-lg">ProcureLink</span>
          </Link>
          <nav className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/browse-suppliers">Browse Suppliers</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/buyer-register">For Buyers</Link>
            </Button>
            <Button asChild>
              <Link href="/supplier-register">For Suppliers</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h1 className="text-4xl font-bold mb-4">
            Simple, Efficient B2B Procurement
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            ProcureLink connects buyers and suppliers in a streamlined RFQ-to-Order workflow. 
            Whether you're procuring for your restaurant or supplying to businesses, we've got you covered.
          </p>
        </section>

        {/* For Buyers Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">For Buyers</h2>
            <p className="text-muted-foreground">Send RFQs and receive competitive quotes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle>1. Create RFQ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use our 4-step wizard to create detailed RFQs with items, quantities, and budget ranges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <CardTitle>2. Receive Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Suppliers review your RFQ and submit competitive quotes with pricing and lead times.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle>3. Accept & Order</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare quotes, accept the best offer, and convert it to a purchase order instantly.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link href="/buyer-register">
                Get Started as Buyer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* For Suppliers Section */}
        <section className="bg-muted/50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">For Suppliers</h2>
            <p className="text-muted-foreground">Respond to RFQs and grow your business</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <CardTitle>1. Complete Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Register and complete your business profile. Upload your catalog via CSV or add products manually.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                </div>
                <CardTitle>2. Browse RFQs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View open RFQs that match your products and business capabilities. Filter by category.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                </div>
                <CardTitle>3. Win Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submit competitive quotes. When buyers accept, orders are automatically created for fulfillment.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link href="/supplier-register">
                Join as Supplier
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Inventory Management</h3>
                <p className="text-sm text-muted-foreground">
                  Track stock levels, set reorder points, and get low-stock alerts automatically.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Multi-Step RFQ Wizard</h3>
                <p className="text-sm text-muted-foreground">
                  Create detailed RFQs with items, budgets, and specifications in 4 easy steps.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Quote Comparison</h3>
                <p className="text-sm text-muted-foreground">
                  Compare multiple supplier quotes side-by-side to make informed decisions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">CSV Catalog Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Suppliers can bulk-upload their product catalog via CSV for quick onboarding.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Order Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track order status, delivery timelines, and generate purchase orders.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Real-time Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when quotes arrive, orders are placed, or inventory runs low.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your procurement?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of buyers and suppliers already using ProcureLink to simplify B2B transactions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/buyer-register">Start as Buyer</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/supplier-register">Join as Supplier</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>ProcureLink · Built with Next.js, Supabase, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  )
}
