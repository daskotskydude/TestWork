'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Turnstile } from '@marsidev/react-turnstile'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Plus, Trash2, Check, Loader2, X, Users, Building2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { createRFQ } from '@/../../packages/lib/data'
import type { RFQItem } from '@/../../packages/lib/supabaseClient'
import { generateSKU } from '@/../../packages/lib/utils'
import { toast } from 'sonner'

const STEPS = ['Details', 'Items', 'Budget', 'Review']

export default function NewRFQPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const supabase = useSupabase()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [targetSupplierId, setTargetSupplierId] = useState<string | null>(null)
  const [targetSupplierName, setTargetSupplierName] = useState<string | null>(null)
  const [mySuppliers, setMySuppliers] = useState<any[]>([])
  const [showSupplierSelector, setShowSupplierSelector] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    items: [{ name: '', sku: '', qty: 1, unit: 'kg', target_price: 0 }] as Omit<RFQItem, 'id' | 'rfq_id' | 'created_at'>[],
    budget_min: 0,
    budget_max: 0,
  })

  // Load connected suppliers
  useEffect(() => {
    if (!user) return

    supabase
      .from('connections')
      .select('supplier:supplier_id(*)')
      .eq('buyer_id', user.id)
      .eq('status', 'accepted')
      .then(({ data }) => {
        if (data) {
          setMySuppliers(data.map(c => c.supplier).filter(Boolean))
        }
      })
  }, [user, supabase])

  // Check for supplier parameter in URL
  useEffect(() => {
    const supplierId = searchParams.get('supplier')
    if (supplierId) {
      setTargetSupplierId(supplierId)
      // Fetch supplier name
      supabase
        .from('profiles')
        .select('org_name')
        .eq('id', supplierId)
        .single()
        .then(({ data }) => {
          if (data) {
            setTargetSupplierName(data.org_name)
          }
        })
    }
  }, [searchParams, supabase])

  // Select supplier from dropdown
  function selectSupplier(supplier: any) {
    setTargetSupplierId(supplier.id)
    setTargetSupplierName(supplier.org_name)
    setShowSupplierSelector(false)
    toast.success(`Selected ${supplier.org_name}`)
  }

  // Clear supplier selection
  function clearSupplierSelection() {
    setTargetSupplierId(null)
    setTargetSupplierName(null)
    toast.info('RFQ will be sent to all suppliers')
  }


  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', sku: '', qty: 1, unit: 'kg', target_price: 0 }],
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...formData.items]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, items: updated })
  }

  const removeItem = (index: number) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) })
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to create an RFQ')
      return
    }

    if (!turnstileToken) {
      toast.error('Please complete the security check')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create RFQ with items in Supabase (already set to 'open' status)
      const { rfq } = await createRFQ(
        supabase,
        {
          buyer_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget_min: formData.budget_min || undefined,
          budget_max: formData.budget_max || undefined,
        },
        formData.items
      )

      // If targeting a specific supplier, create an invitation
      if (targetSupplierId) {
        const { error: inviteError } = await supabase
          .from('rfq_invitations')
          .insert({
            rfq_id: rfq.id,
            supplier_id: targetSupplierId,
          })

        if (inviteError) {
          console.error('Failed to create invitation:', inviteError)
          // Don't fail the whole RFQ creation, just warn
          toast.warning('RFQ created but failed to send invitation to supplier')
        } else {
          toast.success(`RFQ sent to ${targetSupplierName || 'selected supplier'}!`)
        }
      } else {
        toast.success('RFQ created and visible to all suppliers!')
      }

      router.push(`/buyer/rfqs/${rfq.id}`)
    } catch (error) {
      console.error('Failed to create RFQ:', error)
      toast.error('Failed to create RFQ. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Create New RFQ</h1>
          <p className="text-muted-foreground">4-step wizard to create a detailed procurement request</p>
          
          {/* Supplier Selector */}
          <div className="mt-4">
            {targetSupplierName ? (
              <div className="p-3 bg-accent-buyer/20 border border-[#0049B7]/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#0049B7] text-white">Direct RFQ</Badge>
                  <span className="text-sm">
                    Sending to: <strong>{targetSupplierName}</strong>
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearSupplierSelection}
                >
                  <X className="h-4 w-4 mr-1" />
                  Change to Broadcast
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSupplierSelector(!showSupplierSelector)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Select from My Suppliers ({mySuppliers.length})
                </Button>
                <span className="text-xs text-muted-foreground">
                  Or leave blank to send to all suppliers
                </span>
              </div>
            )}

            {/* Supplier Dropdown */}
            {showSupplierSelector && mySuppliers.length > 0 && (
              <Card className="mt-2">
                <CardContent className="p-3">
                  <p className="text-sm font-medium mb-2">Select a supplier:</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {mySuppliers.map((supplier) => (
                      <div
                        key={supplier.id}
                        className="flex items-center justify-between p-2 border rounded hover:bg-accent cursor-pointer"
                        onClick={() => selectSupplier(supplier)}
                      >
                        <div className="flex items-center gap-2">
                          {supplier.logo_url ? (
                            <img src={supplier.logo_url} alt={supplier.org_name} className="w-8 h-8 rounded" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-4 w-4" />
                            </div>
                          )}
                          <span className="text-sm font-medium">{supplier.org_name}</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step} className="flex-1 flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-sm font-medium">{step}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep + 1}: {STEPS[currentStep]}</CardTitle>
            <CardDescription>
              {currentStep === 0 && 'Provide basic information about your procurement request'}
              {currentStep === 1 && 'List the items you need to procure'}
              {currentStep === 2 && 'Set your budget range (optional)'}
              {currentStep === 3 && 'Review and submit your RFQ'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Details */}
            {currentStep === 0 && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">RFQ Title *</label>
                  <Input
                    required
                    placeholder="e.g., Q1 2024 Fresh Produce Supply"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description *</label>
                  <Textarea
                    required
                    placeholder="Detailed description of what you need..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <Input
                    required
                    placeholder="e.g., Food & Beverage, Produce, Meat"
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Step 2: Items */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Item {index + 1}</span>
                      {formData.items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Item Name *</label>
                        <Input
                          required
                          placeholder="e.g., Organic Tomatoes"
                          value={item.name}
                          onChange={(e) => {
                            const newName = e.target.value
                            updateItem(index, 'name', newName)
                            // Auto-generate SKU if name changes and SKU is empty
                            if (newName && !item.sku) {
                              updateItem(index, 'sku', generateSKU(newName))
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          SKU <span className="text-xs text-muted-foreground">(auto-generated, editable)</span>
                        </label>
                        <Input
                          placeholder="e.g., TOM-123456"
                          value={item.sku || ''}
                          onChange={(e) => updateItem(index, 'sku', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Quantity *</label>
                        <Input
                          required
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Unit *</label>
                        <Input
                          required
                          placeholder="kg, pcs, box"
                          value={item.unit}
                          onChange={(e) => updateItem(index, 'unit', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Target Price ($)</label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.target_price || 0}
                          onChange={(e) => updateItem(index, 'target_price', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Item
                </Button>
              </div>
            )}

            {/* Step 3: Budget */}
            {currentStep === 2 && (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Setting a budget range is optional but helps suppliers provide better quotes.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Minimum Budget ($)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.budget_min || ''}
                      onChange={(e) => updateFormData('budget_min', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Maximum Budget ($)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.budget_max || ''}
                      onChange={(e) => updateFormData('budget_max', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 4: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">RFQ Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Description:</strong> {formData.description}</p>
                    <p><strong>Category:</strong> {formData.category}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Items ({formData.items.length})</h3>
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="p-3 border rounded text-sm">
                        <p><strong>{item.name}</strong> {item.sku && `(${item.sku})`}</p>
                        <p className="text-muted-foreground">
                          Qty: {item.qty} {item.unit}
                          {item.target_price ? ` • Target: $${item.target_price}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {(formData.budget_min > 0 || formData.budget_max > 0) && (
                  <div>
                    <h3 className="font-semibold mb-2">Budget</h3>
                    <p className="text-sm">
                      {formData.budget_min > 0 && `Min: $${formData.budget_min.toLocaleString()}`}
                      {formData.budget_min > 0 && formData.budget_max > 0 && ' - '}
                      {formData.budget_max > 0 && `Max: $${formData.budget_max.toLocaleString()}`}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Security Check</h3>
                  <div className="flex justify-center py-4">
                    <Turnstile
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                      onSuccess={(token) => setTurnstileToken(token)}
                      onError={() => toast.error('Security verification failed. Please try again.')}
                      onExpire={() => setTurnstileToken('')}
                    />
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-900 dark:text-green-100">
                    ✅ Your RFQ is ready to be created! Click "Submit RFQ" to publish it.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || !turnstileToken}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Submit RFQ
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  )
}
