'use client'

import { useAuth } from '@/lib/auth-context'
import { useSupabase } from '@/../../packages/lib/useSupabase'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
  const { user, profile } = useAuth()
  const supabase = useSupabase()
  const [authCheck, setAuthCheck] = useState<any>(null)
  const [rfqCheck, setRfqCheck] = useState<any>(null)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setAuthCheck(authUser)
    }
    checkAuth()
  }, [])

  const testRFQQuery = async () => {
    // First check auth
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser?.id)
      .single()
    
    // Then query RFQs
    const { data, error } = await supabase
      .from('rfqs')
      .select('*, buyer:buyer_id(id, org_name, role)')
      .order('created_at', { ascending: false })
    
    setRfqCheck({ 
      currentUserId: currentUser?.id,
      currentProfile: profileData,
      data, 
      error, 
      count: data?.length,
      ownedByCurrentUser: data?.filter(r => r.buyer_id === currentUser?.id).length,
      ownedByOthers: data?.filter(r => r.buyer_id !== currentUser?.id).length,
      rfqDetails: data?.map(r => ({
        id: r.id,
        title: r.title,
        buyer_id: r.buyer_id,
        matches_current_user: r.buyer_id === currentUser?.id,
        buyer_org: r.buyer?.org_name
      }))
    })
  }

  const checkRLSStatus = async () => {
    const { data, error } = await supabase.rpc('pg_table_is_visible', { 
      table_name: 'rfqs' 
    })
    console.log('RLS check:', { data, error })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug Info</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Auth Context (useAuth)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({ 
              user: user ? { id: user.id, email: user.email } : null,
              profile: profile ? { id: profile.id, role: profile.role, org_name: profile.org_name } : null
            }, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Direct Auth Check (supabase.auth.getUser)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {authCheck ? JSON.stringify({ 
              id: authCheck.id, 
              email: authCheck.email,
              user_metadata: authCheck.user_metadata,
              email_confirmed_at: authCheck.email_confirmed_at
            }, null, 2) : 'Loading...'}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RFQ Query Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testRFQQuery}>Test RFQ Query</Button>
          {rfqCheck && (
            <div>
              <p className="font-semibold mb-2">Results:</p>
              <ul className="space-y-1 mb-4">
                <li>Total RFQs returned: <strong>{rfqCheck.count}</strong></li>
                <li>Owned by you: <strong className="text-green-600">{rfqCheck.ownedByCurrentUser}</strong></li>
                <li>Owned by others: <strong className="text-red-600">{rfqCheck.ownedByOthers}</strong></li>
                <li>Your user ID: <code className="text-xs bg-gray-200 px-1">{rfqCheck.currentUserId}</code></li>
              </ul>
              {rfqCheck.ownedByOthers > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
                  <p className="text-red-800 font-semibold">❌ RLS IS NOT WORKING</p>
                  <p className="text-sm text-red-700 mt-1">You're seeing {rfqCheck.ownedByOthers} RFQs that don't belong to you!</p>
                </div>
              )}
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(rfqCheck, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual RLS Fix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">If RLS isn't working, you need to:</p>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Go to Supabase Dashboard → SQL Editor</li>
            <li>Copy the contents of <code className="bg-gray-200 px-1">infra/supabase/apply-rls-policies.sql</code></li>
            <li>Paste and run it in SQL Editor</li>
            <li>Refresh this page and test again</li>
          </ol>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm font-semibold">Quick verification:</p>
            <p className="text-xs mt-1">In Supabase → Authentication → Policies, you should see policies like:</p>
            <ul className="text-xs mt-2 space-y-1">
              <li>• "Buyers can view own RFQs" on <code>rfqs</code> table</li>
              <li>• "Users can view own profile" on <code>profiles</code> table</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Behavior</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>If you're a BUYER:</strong> You should only see RFQs where buyer_id matches your profile.id</p>
          <p><strong>If you're a SUPPLIER:</strong> You'll see ALL open RFQs (this is correct - suppliers browse all RFQs)</p>
          <p className="text-red-600"><strong>Problem:</strong> If you're a buyer seeing OTHER buyers' RFQs, then RLS is not working</p>
        </CardContent>
      </Card>
    </div>
  )
}
