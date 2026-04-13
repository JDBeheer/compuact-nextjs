import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed } = rateLimit(`404:${ip}`, 20, 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ success: false }, { status: 429 })
  }

  const { path, referrer, userAgent } = await request.json()

  if (!path || typeof path !== 'string' || path.length > 2000) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const supabase = getAdminClient()

  const { data: existing } = await supabase
    .from('error_logs')
    .select('id, count')
    .eq('path', path)
    .single()

  if (existing) {
    await supabase
      .from('error_logs')
      .update({ count: existing.count + 1, last_seen: new Date().toISOString() })
      .eq('id', existing.id)
  } else {
    await supabase.from('error_logs').insert({
      path,
      referrer: referrer || null,
      user_agent: userAgent || null,
    })
  }

  return NextResponse.json({ success: true })
}
