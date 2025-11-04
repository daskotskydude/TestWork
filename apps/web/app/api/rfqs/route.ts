import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getRateLimitHeaders, RATE_LIMITS } from '@/../../packages/lib/rate-limit'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/rfqs - List all open RFQs (public)
 */
export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  // Rate limit check
  const rateLimitResult = checkRateLimit(`public:${ip}`, RATE_LIMITS.PUBLIC)
  const headers = getRateLimitHeaders(rateLimitResult, RATE_LIMITS.PUBLIC.maxRequests)
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    )
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    const { data: rfqs, error } = await supabase
      .from('rfqs')
      .select('*, buyer:buyer_id(org_name)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ rfqs }, { headers })
  } catch (error: any) {
    console.error('GET /api/rfqs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RFQs' },
      { status: 500, headers }
    )
  }
}

/**
 * POST /api/rfqs - Create new RFQ (requires auth)
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
    const rateLimitResult = checkRateLimit(`rfq-create:${user.id}`, RATE_LIMITS.RFQ_CREATE)
    const headers = getRateLimitHeaders(rateLimitResult, RATE_LIMITS.RFQ_CREATE.maxRequests)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. You can create up to 20 RFQs per hour.' },
        { status: 429, headers }
      )
    }

    const body = await request.json()
    const { title, description, category, budget_min, budget_max, items } = body

    // Validation
    if (!title || !description || !category || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, items' },
        { status: 400, headers }
      )
    }

    // Create RFQ
    const { data: rfq, error: rfqError } = await supabase
      .from('rfqs')
      .insert({
        buyer_id: user.id,
        title,
        description,
        category,
        budget_min,
        budget_max,
        status: 'open'
      })
      .select()
      .single()

    if (rfqError) throw rfqError

    // Create RFQ items
    const rfqItems = items.map((item: any) => ({
      rfq_id: rfq.id,
      name: item.name,
      sku: item.sku,
      qty: item.qty,
      unit: item.unit,
      target_price: item.target_price
    }))

    const { error: itemsError } = await supabase
      .from('rfq_items')
      .insert(rfqItems)

    if (itemsError) throw itemsError

    return NextResponse.json({ rfq }, { status: 201, headers })
  } catch (error: any) {
    console.error('POST /api/rfqs error:', error)
    return NextResponse.json(
      { error: 'Failed to create RFQ' },
      { status: 500 }
    )
  }
}
