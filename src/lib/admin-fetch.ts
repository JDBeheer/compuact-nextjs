import { supabaseBrowser } from '@/lib/supabase-browser'

export async function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  const { data } = await supabaseBrowser.auth.getSession()
  const token = data.session?.access_token

  const headers = new Headers(options?.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  if (!headers.has('Content-Type') && options?.body) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(url, { ...options, headers, credentials: 'same-origin' })
}
