'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings as SettingsIcon } from 'lucide-react'
import Link from 'next/link'

export default function BuyerSettingsPage() {
  return (
    <AppShell role="buyer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <SettingsIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Settings Coming Soon</h3>
            <Badge variant="warning" className="mb-4">⏳ Phase C Feature</Badge>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Account settings and preferences will be available in Phase C with Supabase 
              authentication and user management.
            </p>
            <Button asChild variant="outline">
              <Link href="/buyer/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planned Settings</CardTitle>
            <CardDescription>Features coming in Phase C</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Profile Settings</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Business information</li>
                  <li>• Contact details</li>
                  <li>• Delivery addresses</li>
                  <li>• Business documents</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Settings</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Change password</li>
                  <li>• Email preferences</li>
                  <li>• Notification settings</li>
                  <li>• Two-factor authentication</li>
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
