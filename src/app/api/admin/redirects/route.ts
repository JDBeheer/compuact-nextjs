import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const supabase = getAdminClient()
  const { data } = await supabase
    .from('redirects')
    .select('*')
    .order('created_at', { ascending: false })

  return NextResponse.json({ redirects: data || [] })
}

function normalizePath(path: string): string {
  let p = path.trim()
  // Strip domain if someone pastes a full URL
  try {
    const url = new URL(p)
    p = url.pathname
  } catch {
    // Not a full URL, that's fine
  }
  // Ensure leading slash
  if (!p.startsWith('/')) p = '/' + p
  // Strip trailing slash (except root)
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const body = await req.json()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from('redirects').insert({
    from_path: normalizePath(body.from_path),
    to_path: normalizePath(body.to_path),
    status_code: body.status_code || 301,
    actief: body.actief ?? true,
  }).select().single()

  if (error) return NextResponse.json({ error: 'Bewerking mislukt' }, { status: 400 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const { id, ...updates } = await req.json()
  const supabase = getAdminClient()
  await supabase.from('redirects').update(updates).eq('id', id)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const { id } = await req.json()
  const supabase = getAdminClient()
  await supabase.from('redirects').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
