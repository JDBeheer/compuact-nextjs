import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export const supabaseBrowser: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    if (!_client) {
      _client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ) as unknown as SupabaseClient
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_client as any)[prop]
  },
})
