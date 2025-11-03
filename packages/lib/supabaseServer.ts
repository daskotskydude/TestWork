/**
 * Server-side Supabase Client Utilities
 * 
 * These utilities create Supabase clients for different contexts:
 * - Server Components: Read-only access with user context
 * - Server Actions: Mutating operations with user context
 * - Route Handlers: API routes with user context
 * 
 * All clients enforce RLS policies based on the authenticated user.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Create a Supabase client for Server Components
 * Use this in: page.tsx, layout.tsx (Server Components)
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

/**
 * Create a Supabase client for Server Actions
 * Use this in: Server Actions (functions with 'use server')
 */
export function createServerActionClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

/**
 * Create a Supabase client for Route Handlers
 * Use this in API route files
 */
export function createRouteHandlerClient(request: Request, response: Response) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.headers.get('cookie');
          if (!cookie) return undefined;
          
          const match = cookie.match(new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`));
          return match ? match[2] : undefined;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.headers.append(
            'Set-Cookie',
            `${name}=${value}; ${Object.entries(options)
              .map(([k, v]) => `${k}=${v}`)
              .join('; ')}`
          );
        },
        remove(name: string, options: CookieOptions) {
          response.headers.append(
            'Set-Cookie',
            `${name}=; Max-Age=0; ${Object.entries(options)
              .map(([k, v]) => `${k}=${v}`)
              .join('; ')}`
          );
        },
      },
    }
  );
}

/**
 * Get the current authenticated user from a Supabase client
 * Returns null if not authenticated
 */
export async function getCurrentUser(supabase: ReturnType<typeof createServerSupabaseClient>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

/**
 * Require authentication - throws if not authenticated
 * Use this to guard server actions/routes
 */
export async function requireAuth(supabase: ReturnType<typeof createServerSupabaseClient>) {
  const user = await getCurrentUser(supabase);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}
