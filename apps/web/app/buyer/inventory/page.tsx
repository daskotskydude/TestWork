'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Package, AlertTriangle, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { listInventory, upsertInventory } from '@/../../packages/lib/data'
import type { InventoryItem } from '@/../../packages/lib/supabaseClient'
import { toast } from 'sonner'

export default function BuyerInventoryPage() {
  const { user } = useAuth()
  const supabase = useSupabase()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    qty: 0,
    unit: 'kg',
    reorder_level: 0,
  })

  useEffect(() => {
    loadInventory()
  }, [user])

  async function loadInventory() {
    if (!user) return

    try {
      const data = await listInventory(supabase, user.id)
      setInventory(data)
    } catch (error) {
      console.error('Failed to load inventory:', error)
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', sku: '', qty: 0, unit: 'kg', reorder_level: 0 })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      sku: item.sku || '',
      qty: item.qty,
      unit: item.unit,
      reorder_level: item.reorder_level,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    try {
      const itemData = {
        ...formData,
        buyer_id: user.id,
        ...(editingId && { id: editingId }),
      }

      await upsertInventory(supabase, itemData)
      
      if (editingId) {
        toast.success('Item updated successfully')
      } else {
        toast.success('Item added to inventory')
      }
      
      resetForm()
      await loadInventory()
    } catch (error) {
      console.error('Failed to save inventory item:', error)
      toast.error('Failed to save item')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inventory item?')) return

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Item deleted')
      await loadInventory()
    } catch (error) {
      console.error('Failed to delete item:', error)
      toast.error('Failed to delete item')
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    )
  }

  const lowStockItems = inventory.filter((i) => i.qty <= i.reorder_level)

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">Manage your stock levels and reorder points</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancel' : 'Add Item'}
          </Button>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Low Stock Alert
                </h3>
                <p className="text-sm text-red-800 dark:text-red-200">
                  {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} need reordering:
                  {' '}
                  {lowStockItems.map((i) => i.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit' : 'Add'} Inventory Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Item Name *</label>
                    <Input
                      required
                      placeholder="e.g., Cooking Oil 10L"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">SKU (optional)</label>
                    <Input
                      placeholder="e.g., OIL-10L"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quantity *</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      value={formData.qty}
                      onChange={(e) => setFormData({ ...formData, qty: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Unit *</label>
                    <Input
                      required
                      placeholder="kg, pcs, box"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Reorder Level *</label>
                    <Input
                      required
                      type="number"
                      min="0"
                      value={formData.reorder_level}
                      onChange={(e) => setFormData({ ...formData, reorder_level: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingId ? 'Update' : 'Add'} Item</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Items ({inventory.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {inventory.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No inventory items</h3>
                <p className="text-muted-foreground mb-4">
                  Add items to track your stock levels
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Item</th>
                      <th className="pb-3 font-medium">SKU</th>
                      <th className="pb-3 font-medium">Quantity</th>
                      <th className="pb-3 font-medium">Unit</th>
                      <th className="pb-3 font-medium">Reorder Level</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-accent/50">
                        <td className="py-3 font-medium">{item.name}</td>
                        <td className="py-3 text-sm text-muted-foreground">{item.sku || '-'}</td>
                        <td className="py-3">{item.qty}</td>
                        <td className="py-3">{item.unit}</td>
                        <td className="py-3">{item.reorder_level}</td>
                        <td className="py-3">
                          {item.qty <= item.reorder_level ? (
                            <Badge variant="error">Low Stock</Badge>
                          ) : (
                            <Badge variant="success">In Stock</Badge>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
