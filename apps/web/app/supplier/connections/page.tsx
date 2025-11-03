'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Check, X, Loader2, Trash2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { listConnections, updateConnectionStatus, deleteConnection } from '@/../../packages/lib/data'
import { toast } from 'sonner'

export default function SupplierConnectionsPage() {
  const { user } = useAuth()
  const supabase = useSupabase()
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  async function handleAcceptConnection(connectionId: string) {
    try {
      await updateConnectionStatus(supabase, connectionId, 'accepted')
      toast.success('Connection accepted!')
      await loadConnections()
    } catch (error) {
      console.error('Failed to accept connection:', error)
      toast.error('Failed to accept connection')
    }
  }

  async function handleRejectConnection(connectionId: string) {
    try {
      await updateConnectionStatus(supabase, connectionId, 'rejected')
      toast.success('Connection rejected')
      await loadConnections()
    } catch (error) {
      console.error('Failed to reject connection:', error)
      toast.error('Failed to reject connection')
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
        <div>
          <h1 className="text-3xl font-bold">My Buyers</h1>
          <p className="text-muted-foreground">
            Manage connections with your buyers
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{acceptedConnections.length}</div>
              <p className="text-xs text-muted-foreground">Connected Buyers</p>
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

        {/* Pending Connection Requests */}
        {pendingConnections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Connection Requests ({pendingConnections.length})</CardTitle>
              <CardDescription>Buyers want to connect with you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingConnections.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{connection.buyer?.org_name}</p>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{connection.buyer?.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested {new Date(connection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptConnection(connection.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectConnection(connection.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connected Buyers */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Users className="h-5 w-5 inline mr-2" />
              Connected Buyers ({acceptedConnections.length})
            </CardTitle>
            <CardDescription>Buyers you have an active relationship with</CardDescription>
          </CardHeader>
          <CardContent>
            {acceptedConnections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No connected buyers yet</p>
                <p className="text-sm">Buyers will send you connection requests</p>
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
                        <p className="font-medium">{connection.buyer?.org_name}</p>
                        <Badge variant="success">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{connection.buyer?.email}</p>
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
      </div>
    </AppShell>
  )
}
