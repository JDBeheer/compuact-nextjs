import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const supabase = getAdminClient()
  const { data } = await supabase
    .from('error_logs')
    .select('*')
    .order('last_seen', { ascending: false })
    .limit(500)

  const clustered = new Map<string, { id: string; ids: string[]; path: string; referrer: string | null; count: number; first_seen: string; last_seen: string; resolved: boolean }>()

  for (const log of data || []) {
    const existing = clustered.get(log.path)
    if (existing) {
      existing.count += log.count || 1
      existing.ids.push(log.id)
      if (log.resolved) existing.resolved = true
      if (log.last_seen > existing.last_seen) {
        existing.last_seen = log.last_seen
        if (log.referrer) existing.referrer = log.referrer
      }
      if (log.first_seen < existing.first_seen) {
        existing.first_seen = log.first_seen
      }
    } else {
      clustered.set(log.path, {
        id: log.id,
        ids: [log.id],
        path: log.path,
        referrer: log.referrer,
        count: log.count || 1,
        first_seen: log.first_seen,
        last_seen: log.last_seen,
        resolved: !!log.resolved,
      })
    }
  }

  const logs = Array.from(clustered.values())
    .sort((a, b) => b.last_seen.localeCompare(a.last_seen))

  return NextResponse.json({ logs })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const { path, resolved } = await req.json()
  if (!path || typeof resolved !== 'boolean') {
    return NextResponse.json({ error: 'path en resolved (boolean) zijn verplicht' }, { status: 400 })
  }

  const supabase = getAdminClient()
  await supabase.from('error_logs').update({ resolved }).eq('path', path)

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const { id, ids, path } = await req.json()
  const supabase = getAdminClient()

  if (ids && Array.isArray(ids)) {
    await supabase.from('error_logs').delete().in('id', ids)
  } else if (path) {
    await supabase.from('error_logs').delete().eq('path', path)
  } else if (id) {
    await supabase.from('error_logs').delete().eq('id', id)
  }

  return NextResponse.json({ ok: true })
}
