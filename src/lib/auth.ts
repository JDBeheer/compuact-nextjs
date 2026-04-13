import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { getAdminClient } from '@/lib/supabase'

interface AuthResult {
  authenticated: true
  userId: string
  email: string
  rol: 'beheerder' | 'redacteur'
}

interface AuthError {
  authenticated: false
  response: NextResponse
}

export async function requireAdmin(req: NextRequest): Promise<AuthResult | AuthError> {
  const authHeader = req.headers.get('authorization')

  let userData

  if (authHeader?.startsWith('Bearer ')) {
    const accessToken = authHeader.slice(7)
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
    )
    const { data, error } = await userClient.auth.getUser()
    if (!error && data.user) {
      userData = data
    }
  }

  if (!userData) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll() {},
        },
      }
    )
    const { data, error } = await supabase.auth.getUser()
    if (!error && data.user) {
      userData = data
    }
  }

  if (!userData?.user) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 }),
    }
  }

  const admin = getAdminClient()
  const { data: adminUser, error: adminError } = await admin
    .from('admin_users')
    .select('rol')
    .eq('auth_user_id', userData.user.id)
    .eq('actief', true)
    .maybeSingle()

  if (adminError || !adminUser) {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'Geen toegang' }, { status: 403 }),
    }
  }

  return {
    authenticated: true,
    userId: userData.user.id,
    email: userData.user.email || '',
    rol: adminUser.rol as 'beheerder' | 'redacteur',
  }
}

export async function requireBeheerder(req: NextRequest): Promise<AuthResult | AuthError> {
  const result = await requireAdmin(req)
  if (!result.authenticated) return result

  if (result.rol !== 'beheerder') {
    return {
      authenticated: false,
      response: NextResponse.json({ error: 'Alleen voor beheerders' }, { status: 403 }),
    }
  }

  return result
}
