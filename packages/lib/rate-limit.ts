/**
 * Rate Limiting Middleware for Next.js API Routes
 * Uses in-memory store for MVP (consider Redis for production)
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 60 seconds
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}, 60000)

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Max requests per interval
}

/**
 * Rate limit middleware
 * Returns true if request is allowed, false if rate limit exceeded
 */
export function checkRateLimit(
  identifier: string, // IP address or user ID
  config: RateLimitConfig = { interval: 60000, maxRequests: 10 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const key = `ratelimit:${identifier}`
  
  let entry = rateLimitStore.get(key)
  
  // Create new entry if doesn't exist or expired
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + config.interval
    }
    rateLimitStore.set(key, entry)
  }
  
  // Increment count
  entry.count++
  
  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)
  
  return {
    allowed,
    remaining,
    resetAt: entry.resetAt
  }
}

/**
 * Get rate limit headers for API responses
 */
export function getRateLimitHeaders(result: ReturnType<typeof checkRateLimit>, limit: number) {
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetAt).toISOString()
  }
}

/**
 * Preset rate limit configs
 */
export const RATE_LIMITS = {
  // Authentication endpoints
  AUTH: { interval: 3600000, maxRequests: 5 }, // 5 per hour
  
  // RFQ creation
  RFQ_CREATE: { interval: 3600000, maxRequests: 20 }, // 20 per hour
  
  // Quote submission
  QUOTE_CREATE: { interval: 3600000, maxRequests: 50 }, // 50 per hour
  
  // General API endpoints
  API_DEFAULT: { interval: 60000, maxRequests: 60 }, // 60 per minute
  
  // Public browsing
  PUBLIC: { interval: 60000, maxRequests: 100 } // 100 per minute
}
