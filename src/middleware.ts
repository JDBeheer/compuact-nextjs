import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip static files and Next.js internals
  if (
    path.startsWith('/_next') ||
    path.startsWith('/images') ||
    path.startsWith('/documents') ||
    path.includes('.')
  ) {
    return NextResponse.next()
  }

  // Skip API routes (they handle their own auth)
  if (path.startsWith('/api')) {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return NextResponse.next()

  // Protect admin routes (except login page)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const response = NextResponse.next({
      request: { headers: request.headers },
    })

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          }
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return response
  }

  // Check redirects table for non-admin routes
  const supabase = createClient(supabaseUrl, supabaseKey)

  const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path

  const { data } = await supabase
    .from('redirects')
    .select('to_path, status_code')
    .eq('from_path', normalizedPath)
    .eq('actief', true)
    .single()

  if (data) {
    if (!data.to_path.startsWith('/') || data.to_path.startsWith('//')) {
      return NextResponse.next()
    }
    const url = request.nextUrl.clone()
    url.pathname = data.to_path
    return NextResponse.redirect(url, data.status_code || 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
