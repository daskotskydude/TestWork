'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { User, Save } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function BuyerProfileSettingsPage() {
  const { profile, refreshProfile } = useAuth()
  const [profileForm, setProfileForm] = useState({
    phone: '',
    address: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setProfileForm({
        phone: profile.phone || '',
        address: profile.address || '',
      })
    }
  }, [profile])

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
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your business profile information</p>
        </div>

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
      </div>
    </AppShell>
  )
}
