'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, Search, Check, X, Loader2, Trash2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { listConnections, deleteConnection } from '@/../../packages/lib/data'
import { toast } from 'sonner'

export default function BuyerConnectionsPage() {
  const { user } = useAuth()
  const supabase = useSupabase()
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [availableSuppliers, setAvailableSuppliers] = useState<any[]>([])

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
              Connected Suppliers ({acceptedConnections.length})
            </CardTitle>
            <CardDescription>Suppliers you have an active relationship with</CardDescription>
          </CardHeader>
          <CardContent>
            {acceptedConnections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No connected suppliers yet</p>
                <p className="text-sm">Add suppliers to start building relationships</p>
              </div>
            ) : (
              <div className="space-y-3">
                {acceptedConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{connection.supplier?.org_name}</p>
                        <Badge variant="success">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{connection.supplier?.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Connected {new Date(connection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConnection(connection.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
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
      </div>
    </AppShell>
  )
}
