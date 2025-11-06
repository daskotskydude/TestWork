'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Search, Check, X, Loader2, Trash2, Send, History, Mail, Phone, Building2, Package, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { listConnections, deleteConnection } from '@/../../packages/lib/data'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function BuyerConnectionsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = useSupabase()
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [availableSuppliers, setAvailableSuppliers] = useState<any[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)
  const [supplierHistory, setSupplierHistory] = useState<{rfqs: any[], orders: any[]} | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    loadConnections()
  }, [user])

  async function loadConnections() {
    if (!user) return

    try {
      const data = await listConnections(supabase, user.id)
      setConnections(data)
    } catch (error) {
      console.error('Failed to load connections:', error)
      toast.error('Failed to load connections')
    } finally {
      setLoading(false)
    }
  }

  async function searchSuppliers() {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term')
      return
    }

    try {
      // Search all profiles with role='supplier'
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'supplier')
        .ilike('org_name', `%${searchTerm}%`)

      if (error) throw error
      setAvailableSuppliers(data || [])
      setShowAddForm(true)
    } catch (error) {
      console.error('Failed to search suppliers:', error)
      toast.error('Failed to search suppliers')
    }
  }

  async function sendConnectionRequest(supplierId: string) {
    if (!user) return

    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          buyer_id: user.id,
          supplier_id: supplierId,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Connection request sent!')
      setShowAddForm(false)
      setSearchTerm('')
      await loadConnections()
    } catch (error: any) {
      console.error('Failed to send connection request:', error)
      if (error.code === '23505') {
        toast.error('Connection already exists')
      } else {
        toast.error('Failed to send connection request')
      }
    }
  }

  async function handleDeleteConnection(connectionId: string) {
    if (!confirm('Remove this connection?')) return

    try {
      await deleteConnection(supabase, connectionId)
      toast.success('Connection removed')
      await loadConnections()
    } catch (error) {
      console.error('Failed to delete connection:', error)
      toast.error('Failed to remove connection')
    }
  }

  // Load RFQ and Order history with a supplier
  async function viewSupplierHistory(supplier: any) {
    setSelectedSupplier(supplier)
    setLoadingHistory(true)

    try {
      // Get all RFQs sent to this supplier (via invitations)
      const { data: invitations } = await supabase
        .from('rfq_invitations')
        .select('rfq_id')
        .eq('supplier_id', supplier.id)

      const rfqIds = invitations?.map(i => i.rfq_id) || []

      // Fetch RFQ details
      const { data: rfqs } = await supabase
        .from('rfqs')
        .select('*')
        .in('id', rfqIds)
        .order('created_at', { ascending: false })

      // Get orders with this supplier
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          *,
          quotes:quote_id (
            *,
            rfqs:rfq_id (title)
          )
        `)
        .eq('supplier_id', supplier.id)
        .order('created_at', { ascending: false })

      setSupplierHistory({
        rfqs: rfqs || [],
        orders: orders || []
      })
    } catch (error) {
      console.error('Failed to load supplier history:', error)
      toast.error('Failed to load history')
    } finally {
      setLoadingHistory(false)
    }
  }

  // Send new RFQ to specific supplier
  function sendRFQToSupplier(supplierId: string) {
    router.push(`/buyer/rfqs/new?supplier=${supplierId}`)
  }

  const acceptedConnections = connections.filter(c => c.status === 'accepted')
  const pendingConnections = connections.filter(c => c.status === 'pending')

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Suppliers</h1>
            <p className="text-muted-foreground">
              Connect with suppliers for ongoing business relationships
            </p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{acceptedConnections.length}</div>
              <p className="text-xs text-muted-foreground">Connected Suppliers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{pendingConnections.length}</div>
              <p className="text-xs text-muted-foreground">Pending Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{connections.length}</div>
              <p className="text-xs text-muted-foreground">Total Connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Connection Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Find Suppliers</CardTitle>
              <CardDescription>Search for suppliers to connect with</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search by supplier name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchSuppliers()}
                />
                <Button onClick={searchSuppliers}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {availableSuppliers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium mb-2">Search Results:</p>
                  {availableSuppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{supplier.org_name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.email}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => sendConnectionRequest(supplier.id)}
                        disabled={connections.some(c => c.supplier_id === supplier.id)}
                      >
                        {connections.some(c => c.supplier_id === supplier.id) ? (
                          'Already Connected'
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Connected Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Users className="h-5 w-5 inline mr-2" />
              My Suppliers ({acceptedConnections.length})
            </CardTitle>
            <CardDescription>Manage your supplier relationships and communication</CardDescription>
          </CardHeader>
          <CardContent>
            {acceptedConnections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No connected suppliers yet</p>
                <p className="text-sm">Add suppliers to start building relationships</p>
              </div>
            ) : (
              <div className="space-y-4">
                {acceptedConnections.map((connection) => (
                  <Card key={connection.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          {connection.supplier?.logo_url ? (
                            <img
                              src={connection.supplier.logo_url}
                              alt={connection.supplier.org_name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-lg">{connection.supplier?.org_name}</p>
                              <Badge className="bg-green-500 text-white">
                                <Check className="h-3 w-3 mr-1" />
                                Connected
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              {connection.supplier?.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {connection.supplier.email}
                                </div>
                              )}
                              {connection.supplier?.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {connection.supplier.phone}
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Connected since {new Date(connection.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                        <Button
                          size="sm"
                          onClick={() => sendRFQToSupplier(connection.supplier.id)}
                          className="flex-1"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send New RFQ
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewSupplierHistory(connection.supplier)}
                        >
                          <History className="h-4 w-4 mr-2" />
                          View History
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.location.href = `mailto:${connection.supplier?.email}`}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteConnection(connection.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        {pendingConnections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests ({pendingConnections.length})</CardTitle>
              <CardDescription>Awaiting supplier response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{connection.supplier?.org_name}</p>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{connection.supplier?.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested {new Date(connection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConnection(connection.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supplier History Modal */}
        <Dialog open={!!selectedSupplier} onOpenChange={(open: boolean) => !open && setSelectedSupplier(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedSupplier && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    {selectedSupplier.logo_url ? (
                      <img
                        src={selectedSupplier.logo_url}
                        alt={selectedSupplier.org_name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <DialogTitle className="text-2xl">{selectedSupplier.org_name}</DialogTitle>
                      <DialogDescription className="mt-1">
                        Complete history of RFQs and orders with this supplier
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {loadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : supplierHistory ? (
                  <div className="space-y-6 mt-6">
                    {/* RFQs Section */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        RFQs Sent ({supplierHistory.rfqs.length})
                      </h3>
                      {supplierHistory.rfqs.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No RFQs sent to this supplier yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {supplierHistory.rfqs.map((rfq) => (
                            <Card key={rfq.id} className="hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => router.push(`/buyer/rfqs/${rfq.id}`)}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium">{rfq.title}</p>
                                    <p className="text-sm text-muted-foreground">{rfq.category}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Created {new Date(rfq.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge variant={rfq.status === 'open' ? 'default' : 'secondary'}>
                                    {rfq.status}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                      <Button
                        className="w-full mt-3"
                        onClick={() => {
                          setSelectedSupplier(null)
                          sendRFQToSupplier(selectedSupplier.id)
                        }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send New RFQ to {selectedSupplier.org_name}
                      </Button>
                    </div>

                    {/* Orders Section */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Orders Placed ({supplierHistory.orders.length})
                      </h3>
                      {supplierHistory.orders.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          No orders placed with this supplier yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {supplierHistory.orders.map((order) => (
                            <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => router.push(`/buyer/orders/${order.id}`)}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {order.quotes?.rfqs?.title || 'N/A'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Placed {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <Badge>{order.status}</Badge>
                                    <p className="text-sm font-medium mt-1">
                                      ${Number(order.total_amount).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
