'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Settings as SettingsIcon, User, Building2, MapPin, Bell } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function BuyerSettingsPage() {
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
              Profile Information
            </CardTitle>
            <CardDescription>View and update your business profile</CardDescription>
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
                  <p className="font-medium">Quote Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when suppliers quote your RFQs</p>
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
                <h4 className="font-semibold mb-2">Procurement Settings</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Preferred suppliers</li>
                  <li>• Auto-approval rules</li>
                  <li>• Budget thresholds</li>
                  <li>• RFQ templates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Preferences</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Product categories</li>
                  <li>• Payment terms</li>
                  <li>• Inventory alerts</li>
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
