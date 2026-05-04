import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireBeheerder } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = await requireBeheerder(req)
  if (!auth.authenticated) return auth.response

  const body = await req.json()
  const admin = getAdminClient()

  const { data, error } = await admin.from('admin_users').update({
    naam: body.naam || null,
    rol: body.rol,
    actief: body.actief,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select().single()

  if (error) {
    return NextResponse.json({ error: 'Bewerking mislukt' }, { status: 400 })
  }

  if (body.actief === false && data.auth_user_id) {
    await admin.auth.admin.updateUserById(data.auth_user_id, {
      ban_duration: '876600h',
    })
  } else if (body.actief === true && data.auth_user_id) {
    await admin.auth.admin.updateUserById(data.auth_user_id, {
      ban_duration: 'none',
    })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = await requireBeheerder(req)
  if (!auth.authenticated) return auth.response

  const body = await req.json()
  const admin = getAdminClient()

  const { data: user } = await admin.from('admin_users').select('auth_user_id').eq('id', id).single()
  if (!user?.auth_user_id) return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 })

  const { error } = await admin.auth.admin.updateUserById(user.auth_user_id, { password: body.password })
  if (error) return NextResponse.json({ error: 'Wachtwoord bijwerken mislukt' }, { status: 400 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const auth = await requireBeheerder(req)
  if (!auth.authenticated) return auth.response

  const admin = getAdminClient()

  const { data: user } = await admin.from('admin_users').select('auth_user_id').eq('id', id).single()

  const { error } = await admin.from('admin_users').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: 'Bewerking mislukt' }, { status: 400 })
  }

  if (user?.auth_user_id) {
    await admin.auth.admin.deleteUser(user.auth_user_id)
  }

  return NextResponse.json({ ok: true })
}
