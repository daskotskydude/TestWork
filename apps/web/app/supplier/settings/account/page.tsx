'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings as SettingsIcon, Building2, Bell } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function SupplierAccountSettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account security and preferences</p>
        </div>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Password change coming soon')}>
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('2FA setup coming soon')}>
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-muted-foreground">Manage logged-in devices</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Session management coming soon')}>
                View
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Business Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Configuration
            </CardTitle>
            <CardDescription>Configure your business settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Payment Methods</p>
                <p className="text-sm text-muted-foreground">Bank accounts and payment preferences</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Payment setup coming soon')}>
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Tax Information</p>
                <p className="text-sm text-muted-foreground">VAT/GST registration and certificates</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Tax setup coming soon')}>
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Delivery Zones</p>
                <p className="text-sm text-muted-foreground">Areas where you can deliver products</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Delivery zones coming soon')}>
                Set Zones
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Buyer Connections</p>
                <p className="text-sm text-muted-foreground">Manage your buyer relationships</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/supplier/connections">
                  Manage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Data & Privacy
            </CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all your quotes, orders, and products</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Data export coming soon')}>
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground text-red-600">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => toast.error('Account deletion requires admin approval')}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
