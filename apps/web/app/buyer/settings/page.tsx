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
  const { profile, refreshProfile } = useAuth()
  const { supabase } = { supabase: useAuth().user ? require('@/../../packages/lib/useSupabase').useSupabase() : null }
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    quoteAlerts: true,
    orderUpdates: true,
    inventoryAlerts: true,
    connectionRequests: true,
  })
  const [profileForm, setProfileForm] = useState({
    phone: '',
    address: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load settings from localStorage and initialize profile form
  useEffect(() => {
    const saved = localStorage.getItem('buyer-notification-settings')
    if (saved) {
      try {
        setNotifications(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load notification settings:', e)
      }
    }

    if (profile) {
      setProfileForm({
        phone: profile.phone || '',
        address: profile.address || '',
      })
    }
  }, [profile])

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
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('procurelink:notification-preferences-updated'))
    }
    
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Notification preferences saved successfully')
    }, 500)
  }

  const handleProfileUpdate = async () => {
    if (!profile?.id) return
    
    setIsSaving(true)
    try {
      const supabase = require('@/../../packages/lib/useSupabase').useSupabase()
      const { error } = await supabase()
        .from('profiles')
        .update({
          phone: profileForm.phone || null,
          address: profileForm.address || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error

      await refreshProfile()
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (profile) {
      setProfileForm({
        phone: profile.phone || '',
        address: profile.address || '',
      })
    }
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>View and update your business profile</CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
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
              <Input 
                value={isEditing ? profileForm.phone : (profile?.phone || 'Not set')} 
                disabled={!isEditing}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea 
                value={isEditing ? profileForm.address : (profile?.address || 'Not set')} 
                disabled={!isEditing}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                rows={2}
                placeholder="Enter business address"
              />
            </div>
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Button onClick={handleProfileUpdate} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            )}
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

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Additional configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Security */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                Account Security
              </h4>
              <div className="space-y-3">
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
              </div>
            </div>

            {/* Procurement Preferences */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Procurement Preferences
              </h4>
              <div className="space-y-3">
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
              </div>
            </div>

            {/* Data & Privacy */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Data & Privacy
              </h4>
              <div className="space-y-3">
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
