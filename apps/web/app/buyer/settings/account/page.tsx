'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings as SettingsIcon, Building2, MapPin } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function BuyerAccountSettingsPage() {
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

        {/* Procurement Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Procurement Preferences
            </CardTitle>
            <CardDescription>Configure your procurement settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Preferred Suppliers</p>
                <p className="text-sm text-muted-foreground">Manage your trusted supplier list</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/buyer/connections">
                  Manage
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Auto-Approval Rules</p>
                <p className="text-sm text-muted-foreground">Set criteria for automatic quote acceptance</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Auto-approval rules coming soon')}>
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Budget Thresholds</p>
                <p className="text-sm text-muted-foreground">Define spending limits and alerts</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.info('Budget thresholds coming soon')}>
                Set Limits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Data & Privacy
            </CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all your RFQs, orders, and inventory</p>
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
