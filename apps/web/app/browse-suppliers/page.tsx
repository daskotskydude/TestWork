'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Star, Package } from 'lucide-react'

export default function BrowseSuppliersPage() {
  const mockSuppliers = [
    {
      id: '1',
      name: 'Gulf Foods Trading',
      category: 'Food & Beverage',
      location: 'Doha, Qatar',
      rating: 4.8,
      products: 150,
      verified: true,
    },
    {
      id: '2',
      name: 'Fresh Produce Direct',
      category: 'Fruits & Vegetables',
      location: 'Dubai, UAE',
      rating: 4.9,
      products: 85,
      verified: true,
    },
    {
      id: '3',
      name: 'Premium Meats Supply',
      category: 'Meat & Poultry',
      location: 'Abu Dhabi, UAE',
      rating: 4.7,
      products: 60,
      verified: true,
    },
  ]

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
              <Link href="/how-it-works">How It Works</Link>
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

      <main className="container py-12 space-y-8">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">Browse Suppliers</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover verified suppliers across multiple categories. Connect with the right partners for your business.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by supplier name, category, or product..."
                  className="pl-10"
                />
              </div>
              <Button>Search</Button>
            </div>
          </div>
        </section>

        {/* Info Card */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Supplier Directory</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse verified suppliers and connect with the right partners for your business. 
                Full search and filtering capabilities available for registered buyers.
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <Link href="/buyer-register">Register as Buyer</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Supplier Listings */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Suppliers</h2>
            <p className="text-sm text-muted-foreground">{mockSuppliers.length} suppliers (preview)</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    {supplier.verified && (
                      <Badge variant="success">✓ Verified</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <CardDescription>{supplier.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{supplier.rating}</span>
                    <span className="text-muted-foreground">rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{supplier.products} products</span>
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/buyer-register">Connect (Register Required)</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Filters Preview */}
        <section className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Planned Filter Options</CardTitle>
              <CardDescription>Features coming in Phase C</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">By Category</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Food & Beverage</li>
                    <li>• Fruits & Vegetables</li>
                    <li>• Meat & Poultry</li>
                    <li>• Dairy Products</li>
                    <li>• Dry Goods</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">By Location</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Qatar</li>
                    <li>• UAE</li>
                    <li>• Saudi Arabia</li>
                    <li>• Kuwait</li>
                    <li>• Bahrain</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">By Rating</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• 5 stars</li>
                    <li>• 4+ stars</li>
                    <li>• 3+ stars</li>
                    <li>• Verified only</li>
                    <li>• All suppliers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to connect with suppliers?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign up as a buyer to send RFQs and receive quotes from verified suppliers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/buyer-register">Get Started as Buyer</Link>
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
