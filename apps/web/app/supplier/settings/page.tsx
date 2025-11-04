'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Settings as SettingsIcon, User, Building2, Bell } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function SupplierSettingsPage() {
  const { profile } = useAuth()

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Supplier Profile
            </CardTitle>
            <CardDescription>View and update your business information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Business Name</Label>
              <Input value={profile?.org_name || ''} disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={profile?.email || ''} disabled />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={profile?.phone || 'Not set'} disabled />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea value={profile?.address || 'Not set'} disabled rows={2} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={profile?.description || 'Not set'} disabled rows={3} />
            </div>
            <Badge variant="outline" className="mt-2">
              Profile editing coming in Phase 2
            </Badge>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Manage your notification settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Badge variant="outline">Coming in Phase 2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New RFQ Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified of new RFQ opportunities</p>
                </div>
                <Badge variant="outline">Coming in Phase 2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order Updates</p>
                  <p className="text-sm text-muted-foreground">Receive order status updates</p>
                </div>
                <Badge variant="outline">Coming in Phase 2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Features */}
        <Card>
          <CardHeader>
            <CardTitle>Phase 2 Features</CardTitle>
            <CardDescription>Additional settings coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Account Management</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Change password</li>
                  <li>• Two-factor authentication</li>
                  <li>• Session management</li>
                  <li>• Account deletion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Settings</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Payment methods</li>
                  <li>• Tax information</li>
                  <li>• Delivery zones</li>
                  <li>• Operating hours</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preferences</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• RFQ categories</li>
                  <li>• Auto-response rules</li>
                  <li>• Quote templates</li>
                  <li>• Language & timezone</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
