import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getRateLimitHeaders, RATE_LIMITS } from '@/../../packages/lib/rate-limit'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * POST /api/quotes - Submit a quote (requires auth)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: request.headers.get('Authorization') || ''
        }
      }
    })

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limit by user ID
    const rateLimitResult = checkRateLimit(`quote-create:${user.id}`, RATE_LIMITS.QUOTE_CREATE)
    const headers = getRateLimitHeaders(rateLimitResult, RATE_LIMITS.QUOTE_CREATE.maxRequests)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can submit up to 50 quotes per hour.' },
        { status: 429, headers }
      )
    }

    const body = await request.json()
    const { rfq_id, total_price, currency, lead_time_days, notes } = body

    // Validation
    if (!rfq_id || !total_price || !currency || !lead_time_days) {
      return NextResponse.json(
        { error: 'Missing required fields: rfq_id, total_price, currency, lead_time_days' },
        { status: 400, headers }
      )
    }

    // Create quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        rfq_id,
        supplier_id: user.id,
        total_price,
        currency,
        lead_time_days,
        notes,
        status: 'sent'
      })
      .select()
      .single()

    if (quoteError) throw quoteError

    return NextResponse.json({ quote }, { status: 201, headers })
  } catch (error: any) {
    console.error('POST /api/quotes error:', error)
    
    // Handle RLS policy violations
    if (error.code === '42501') {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to submit a quote for this RFQ' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}
