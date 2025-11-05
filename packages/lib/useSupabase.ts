/**
 * Client-side Supabase Hook
 * 
 * Use this hook in Client Components to get a Supabase client.
 * The client automatically syncs auth state with the server.
 */

'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useMemo } from 'react';

export function useSupabase() {
  return useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              // This is client-side only, so we can use document.cookie
              if (typeof document === 'undefined') return undefined;
              const value = `; ${document.cookie}`;
              const parts = value.split(`; ${name}=`);
              if (parts.length === 2) return parts.pop()?.split(';').shift();
            },
            set(name: string, value: string, options: any) {
              if (typeof document === 'undefined') return;
              let cookie = `${name}=${value}`;
              if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
              if (options?.path) cookie += `; path=${options.path}`;
              if (options?.domain) cookie += `; domain=${options.domain}`;
              if (options?.secure) cookie += '; secure';
              if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
              document.cookie = cookie;
            },
            remove(name: string, options: any) {
              if (typeof document === 'undefined') return;
              document.cookie = `${name}=; path=${options?.path || '/'}; max-age=0`;
            },
          },
        }
      ),
    []
  );
}
