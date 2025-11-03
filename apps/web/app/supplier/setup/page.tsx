'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react'
import { toast } from 'sonner'

const STEPS = ['Profile', 'Catalog']

export default function SupplierSetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStepParam = searchParams?.get('step') || 'profile'
  const currentStep = currentStepParam === 'catalog' ? 1 : 0

  const [profileData, setProfileData] = useState({
    businessName: '',
    address: '',
    phone: '',
    description: '',
    logo: null as File | null,
    license: null as File | null,
  })

  const [catalogFile, setCatalogFile] = useState<File | null>(null)

  const handleNext = () => {
    if (currentStep === 0) {
      router.push('/supplier/setup?step=catalog')
    } else {
      // Complete onboarding
      toast.success('Onboarding complete! Redirecting to dashboard...')
      setTimeout(() => router.push('/supplier/dashboard'), 1000)
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/supplier/setup?step=profile')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Supplier Onboarding</h1>
          <p className="text-muted-foreground">Complete your profile to start receiving RFQs</p>
          <Badge variant="warning" className="mt-2">⏳ Mock Only - Files not uploaded</Badge>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4">
          {STEPS.map((step, index) => (
            <div key={step} className="flex items-center">
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
                <div className={`w-16 h-0.5 mx-4 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep + 1}: {STEPS[currentStep]}</CardTitle>
            <CardDescription>
              {currentStep === 0 && 'Tell us about your business'}
              {currentStep === 1 && 'Upload your product catalog (CSV format)'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Profile */}
            {currentStep === 0 && (
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Business Name *</label>
                  <Input
                    required
                    placeholder="Best Foods Wholesale"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Business Address *</label>
                  <Textarea
                    required
                    placeholder="Street, City, Country"
                    rows={3}
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                  <Input
                    required
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Tell buyers about your business..."
                    rows={4}
                    value={profileData.description}
                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Logo</label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Click to upload logo</p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={(e) => setProfileData({ ...profileData, logo: e.target.files?.[0] || null })}
                      />
                      {profileData.logo && (
                        <p className="text-xs text-green-600 mt-2">✓ {profileData.logo.name}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Business License *</label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Click to upload</p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="cursor-pointer"
                        onChange={(e) => setProfileData({ ...profileData, license: e.target.files?.[0] || null })}
                      />
                      {profileData.license && (
                        <p className="text-xs text-green-600 mt-2">✓ {profileData.license.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Step 2: Catalog */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    CSV Format Requirements
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    Your CSV should have these columns:
                  </p>
                  <code className="text-xs bg-blue-100 dark:bg-blue-900 p-2 rounded block">
                    name, unit, price, stock, category, moq, sku
                  </code>
                </div>

                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Upload Product Catalog</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    CSV file with your product list
                  </p>
                  <Input
                    type="file"
                    accept=".csv"
                    className="cursor-pointer max-w-xs mx-auto"
                    onChange={(e) => setCatalogFile(e.target.files?.[0] || null)}
                  />
                  {catalogFile && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        ✓ {catalogFile.name} selected
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        (Mock: File not actually parsed yet - Phase C will add CSV processing)
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p><strong>Note:</strong> You can add/edit products later from your dashboard.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
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
            <Button onClick={handleNext}>
              <Check className="h-4 w-4 mr-2" />
              Complete Setup
            </Button>
          )}
        </div>

        {/* Mock Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Phase B Mock:</strong> Files are not actually uploaded. Completing setup will 
            take you to the supplier dashboard with mock data. File processing and storage will 
            be added in Phase C.
          </p>
        </div>
      </div>
    </div>
  )
}
