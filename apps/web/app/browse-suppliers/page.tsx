'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Star, Package, Building2, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { useAuth } from '@/lib/auth-context'
import type { Profile, Product } from '@/../../packages/lib/supabaseClient'

interface SupplierWithStats extends Profile {
  product_count: number
  products?: Product[]
  showProducts?: boolean
}

export default function BrowseSuppliersPage() {
  const supabase = useSupabase()
  const { user, profile } = useAuth()
  const [suppliers, setSuppliers] = useState<SupplierWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadSuppliers() {
      try {
        // Fetch supplier profiles with product counts
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'supplier')
          .order('created_at', { ascending: false })

        if (profilesError) throw profilesError

        // Get product counts for each supplier
        const suppliersWithStats = await Promise.all(
          (profiles || []).map(async (profile) => {
            const { count } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('supplier_id', profile.id)

            return {
              ...profile,
              product_count: count || 0,
            }
          })
        )

        setSuppliers(suppliersWithStats)
      } catch (error) {
        console.error('Failed to load suppliers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSuppliers()
  }, [supabase])

  // Load products for a specific supplier
  const loadSupplierProducts = async (supplierId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('category')
        .limit(5) // Show first 5 products

      if (error) throw error

      // Update the supplier in the list with their products
      setSuppliers(prev =>
        prev.map(s =>
          s.id === supplierId
            ? { ...s, products: data || [], showProducts: true }
            : s
        )
      )
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  // Toggle product visibility for a supplier
  const toggleProducts = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId)
    
    if (!supplier) return

    if (supplier.showProducts) {
      // Hide products
      setSuppliers(prev =>
        prev.map(s =>
          s.id === supplierId ? { ...s, showProducts: false } : s
        )
      )
    } else if (supplier.products && supplier.products.length > 0) {
      // Already loaded, just show
      setSuppliers(prev =>
        prev.map(s =>
          s.id === supplierId ? { ...s, showProducts: true } : s
        )
      )
    } else {
      // Load products first time
      loadSupplierProducts(supplierId)
    }
  }

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      supplier.org_name?.toLowerCase().includes(query) ||
      supplier.description?.toLowerCase().includes(query)
    )
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already reactive via filteredSuppliers
  }

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
          <nav className="flex gap-4 items-center">
            <Button asChild variant="ghost">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
            
            {!user ? (
              <>
                <Button asChild variant="ghost">
                  <Link href="/buyer-register">For Buyers</Link>
                </Button>
                <Button asChild>
                  <Link href="/supplier-register">For Suppliers</Link>
                </Button>
              </>
            ) : profile?.role === 'buyer' ? (
              <Button asChild>
                <Link href="/buyer/dashboard">My Dashboard</Link>
              </Button>
            ) : profile?.role === 'supplier' ? (
              <Button asChild>
                <Link href="/supplier/dashboard">My Dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
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
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by supplier name or description..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </section>

        {/* Info Card - Only show for non-authenticated users */}
        {!user && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Supplier Directory</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse verified suppliers and connect with the right partners for your business. 
                  Register as a buyer to send RFQs and receive quotes.
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
        )}

        {/* Welcome message for logged-in users */}
        {user && profile && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-accent-buyer border-accent-buyer">
              <CardContent className="text-center py-6">
                <h3 className="text-lg font-semibold mb-2">
                  Welcome, {profile.org_name}!
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profile.role === 'buyer'
                    ? 'Click "Send RFQ" on any supplier to start a procurement request.'
                    : 'Viewing supplier directory. Switch to your dashboard to manage your profile.'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Supplier Listings */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {loading ? 'Loading Suppliers...' : 'Available Suppliers'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Try a different search term or clear your filters.'
                    : 'No suppliers have registered yet. Be the first to join!'}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      {supplier.logo_url ? (
                        <img
                          src={supplier.logo_url}
                          alt={`${supplier.org_name} logo`}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-accent-buyer flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-[#0049B7] dark:text-blue-400" />
                        </div>
                      )}
                      <Badge className="bg-accent-buyer text-[#0049B7] dark:text-blue-400 border-accent-buyer">
                        ✓ Verified
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{supplier.org_name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {supplier.description || 'Professional B2B supplier'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {supplier.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{supplier.address}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">📞</span>
                        <span>{supplier.phone}</span>
                      </div>
                    )}
                    
                    {/* Product Count with Toggle */}
                    {supplier.product_count > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => toggleProducts(supplier.id)}
                      >
                        <span className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {supplier.product_count} product{supplier.product_count !== 1 ? 's' : ''}
                        </span>
                        {supplier.showProducts ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}

                    {/* Product List Showcase */}
                    {supplier.showProducts && supplier.products && supplier.products.length > 0 && (
                      <div className="border-t pt-3 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">Product Catalog</p>
                        {supplier.products.map((product) => (
                          <div key={product.id} className="flex items-start justify-between text-xs bg-accent-buyer/30 p-2 rounded">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-muted-foreground">{product.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[#0049B7]">${product.price}/{product.unit}</p>
                              <p className="text-muted-foreground">MOQ: {product.moq}</p>
                            </div>
                          </div>
                        ))}
                        {supplier.product_count > 5 && (
                          <p className="text-xs text-center text-muted-foreground italic">
                            +{supplier.product_count - 5} more product{supplier.product_count - 5 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    )}

                    {supplier.product_count === 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>Setting up catalog</span>
                      </div>
                    )}
                    
                    {/* Dynamic action button based on auth state */}
                    <div className="pt-2">
                      {!user ? (
                        <Button className="w-full" variant="outline" asChild>
                          <Link href="/buyer-register">Connect (Register Required)</Link>
                        </Button>
                      ) : profile?.role === 'buyer' ? (
                        <Button className="w-full" asChild>
                          <Link href={`/buyer/rfqs/new?supplier=${supplier.id}`}>
                            Send RFQ
                          </Link>
                        </Button>
                      ) : profile?.role === 'supplier' ? (
                        <Button className="w-full" variant="outline" disabled>
                          Supplier Profile
                        </Button>
                      ) : (
                        <Button className="w-full" variant="outline" asChild>
                          <Link href="/buyer-register">Get Started</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-50 via-blue-100/50 to-blue-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 rounded-xl p-12 text-center border border-[#0049B7]/20 dark:border-blue-800/30">
          <h2 className="text-3xl font-bold mb-4">Ready to connect with suppliers?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign up as a buyer to send RFQs and receive quotes, or join as a supplier to showcase your products.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-[#0049B7] hover:bg-[#003a94] dark:bg-[#0049B7] dark:hover:bg-[#005cd9]">
              <Link href="/buyer-register">
                Get Started as Buyer
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#0049B7] text-[#0049B7] hover:bg-blue-50 dark:hover:bg-blue-950/30">
              <Link href="/supplier-register">
                Join as Supplier
              </Link>
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
