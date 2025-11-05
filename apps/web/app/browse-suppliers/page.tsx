'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Package, Building2, X, Mail, Phone, ExternalLink, UserPlus, Send } from 'lucide-react'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { useAuth } from '@/lib/auth-context'
import type { Profile, Product } from '@/../../packages/lib/supabaseClient'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface SupplierWithStats extends Profile {
  product_count: number
  products?: Product[]
}

export default function BrowseSuppliersPage() {
  const supabase = useSupabase()
  const { user, profile } = useAuth()
  const [suppliers, setSuppliers] = useState<SupplierWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierWithStats | null>(null)
  const [loadingProducts, setLoadingProducts] = useState(false)

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

  // Load products for selected supplier in modal
  const loadSupplierProducts = async (supplierId: string) => {
    setLoadingProducts(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('supplier_id', supplierId)
        .order('category')

      if (error) throw error

      // Update selected supplier with products
      if (selectedSupplier && selectedSupplier.id === supplierId) {
        setSelectedSupplier({ ...selectedSupplier, products: data || [] })
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoadingProducts(false)
    }
  }

  // Open supplier profile modal
  const handleViewProfile = (supplier: SupplierWithStats) => {
    setSelectedSupplier(supplier)
    if (!supplier.products) {
      loadSupplierProducts(supplier.id)
    }
  }

  // Add supplier to connections
  const handleAddSupplier = async () => {
    if (!user || !selectedSupplier) return

    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          buyer_id: user.id,
          supplier_id: selectedSupplier.id,
          status: 'pending',
        })

      if (error) throw error

      toast.success('Supplier connection request sent!')
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Already connected with this supplier')
      } else {
        console.error('Failed to add supplier:', error)
        toast.error('Failed to add supplier')
      }
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
                    
                    {/* Product Count */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>
                        {supplier.product_count > 0
                          ? `${supplier.product_count} product${supplier.product_count !== 1 ? 's' : ''}`
                          : 'Setting up catalog'}
                      </span>
                    </div>
                    
                    {/* View Profile Button */}
                    <div className="pt-2">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleViewProfile(supplier)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Supplier Profile Modal */}
        <Dialog open={!!selectedSupplier} onOpenChange={(open: boolean) => !open && setSelectedSupplier(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedSupplier && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    {selectedSupplier.logo_url ? (
                      <img
                        src={selectedSupplier.logo_url}
                        alt={`${selectedSupplier.org_name} logo`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-accent-buyer flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-[#0049B7]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <DialogTitle className="text-2xl">{selectedSupplier.org_name}</DialogTitle>
                      <DialogDescription className="mt-1">
                        {selectedSupplier.description || 'Professional B2B supplier'}
                      </DialogDescription>
                      <Badge className="mt-2 bg-accent-buyer text-[#0049B7] border-accent-buyer">
                        ✓ Verified Supplier
                      </Badge>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      {selectedSupplier.address && (
                        <div className="flex items-start gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{selectedSupplier.address}</span>
                        </div>
                      )}
                      {selectedSupplier.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedSupplier.email}</span>
                        </div>
                      )}
                      {selectedSupplier.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedSupplier.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Catalog */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">
                      Product Catalog ({selectedSupplier.product_count} items)
                    </h3>
                    {loadingProducts ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0049B7]"></div>
                      </div>
                    ) : selectedSupplier.products && selectedSupplier.products.length > 0 ? (
                      <div className="grid gap-3">
                        {selectedSupplier.products.map((product) => (
                          <Card key={product.id} className="bg-accent-buyer/20">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{product.name}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {product.category}
                                    {product.sku && ` • SKU: ${product.sku}`}
                                  </p>
                                  {product.description && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                      {product.description}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-lg font-bold text-[#0049B7]">
                                    ${product.price}/{product.unit}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    MOQ: {product.moq} {product.unit}
                                  </p>
                                  <Badge
                                    variant={Number(product.stock) > 0 ? 'default' : 'secondary'}
                                    className="mt-2"
                                  >
                                    {Number(product.stock) > 0
                                      ? `${product.stock} in stock`
                                      : 'Out of stock'}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No products available yet</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {user && profile?.role === 'buyer' && (
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          setSelectedSupplier(null)
                          window.location.href = `/buyer/rfqs/new?supplier=${selectedSupplier.id}`
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send RFQ to This Supplier
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleAddSupplier}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add to My Suppliers
                      </Button>
                    </div>
                  )}

                  {!user && (
                    <div className="pt-4 border-t text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        Register as a buyer to send RFQs and connect with suppliers
                      </p>
                      <Button asChild>
                        <Link href="/buyer-register">Register as Buyer</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

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
