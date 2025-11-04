'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Settings as SettingsIcon, User, Building2, MapPin, Bell, Save } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface NotificationSettings {
  emailNotifications: boolean
  quoteAlerts: boolean
  orderUpdates: boolean
  inventoryAlerts: boolean
  connectionRequests: boolean
}

export default function BuyerSettingsPage() {
  const { profile } = useAuth()
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    quoteAlerts: true,
    orderUpdates: true,
    inventoryAlerts: true,
    connectionRequests: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('buyer-notification-settings')
    if (saved) {
      try {
        setNotifications(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load notification settings:', e)
      }
    }
  }, [])

  const handleToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = () => {
    setIsSaving(true)
    // Save to localStorage
    localStorage.setItem('buyer-notification-settings', JSON.stringify(notifications))
    
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Notification preferences saved successfully')
    }, 500)
  }

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
            <p className="text-xs text-muted-foreground mt-2">
              Profile editing can be enabled in your Supabase dashboard
            </p>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => handleToggle('emailNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="quoteAlerts" className="font-medium">Quote Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when suppliers quote your RFQs</p>
                </div>
                <Switch
                  id="quoteAlerts"
                  checked={notifications.quoteAlerts}
                  onCheckedChange={() => handleToggle('quoteAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="orderUpdates" className="font-medium">Order Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive order status updates</p>
                </div>
                <Switch
                  id="orderUpdates"
                  checked={notifications.orderUpdates}
                  onCheckedChange={() => handleToggle('orderUpdates')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inventoryAlerts" className="font-medium">Inventory Alerts</Label>
                  <p className="text-sm text-muted-foreground">Low stock warnings and reminders</p>
                </div>
                <Switch
                  id="inventoryAlerts"
                  checked={notifications.inventoryAlerts}
                  onCheckedChange={() => handleToggle('inventoryAlerts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="connectionRequests" className="font-medium">Connection Requests</Label>
                  <p className="text-sm text-muted-foreground">Supplier connection requests and approvals</p>
                </div>
                <Switch
                  id="connectionRequests"
                  checked={notifications.connectionRequests}
                  onCheckedChange={() => handleToggle('connectionRequests')}
                />
              </div>

              <div className="pt-4 border-t">
                <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings - Future */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Additional configuration options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Account Security</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Change password</li>
                  <li>• Two-factor authentication</li>
                  <li>• Session management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Procurement Preferences</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Preferred suppliers</li>
                  <li>• Auto-approval rules</li>
                  <li>• Budget thresholds</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
