import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireBeheerder } from '@/lib/auth'
import { userCreateSchema } from '@/lib/validation'

export async function GET(req: NextRequest) {
  const auth = await requireBeheerder(req)
  if (!auth.authenticated) return auth.response

  const admin = getAdminClient()
  const { data } = await admin.from('admin_users').select('*').order('created_at', { ascending: true })
  return NextResponse.json({ users: data || [] })
}

export async function POST(req: NextRequest) {
  const auth = await requireBeheerder(req)
  if (!auth.authenticated) return auth.response

  const body = await req.json()
  const parsed = userCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Ongeldige invoer' }, { status: 400 })
  }

  const admin = getAdminClient()

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: 'Bewerking mislukt' }, { status: 400 })
  }

  const { data, error } = await admin.from('admin_users').insert({
    auth_user_id: authUser.user.id,
    email: parsed.data.email,
    naam: parsed.data.naam || null,
    rol: parsed.data.rol || 'redacteur',
    actief: true,
  }).select().single()

  if (error) {
    await admin.auth.admin.deleteUser(authUser.user.id)
    return NextResponse.json({ error: 'Bewerking mislukt' }, { status: 400 })
  }

  return NextResponse.json(data)
}
