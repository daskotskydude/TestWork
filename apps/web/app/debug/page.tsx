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
    const { data, error } = await supabase
      .from('rfqs')
      .select('*, buyer:buyer_id(org_name, role)')
      .order('created_at', { ascending: false })
    
    setRfqCheck({ data, error, count: data?.length })
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
              <p className="font-semibold mb-2">Results: {rfqCheck.count} RFQs found</p>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(rfqCheck, null, 2)}
              </pre>
            </div>
          )}
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
