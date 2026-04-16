import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { pingIndexNow } from '@/lib/indexnow'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const { urls } = await req.json()

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'URLs zijn verplicht' }, { status: 400 })
  }

  const result = await pingIndexNow(urls)
  return NextResponse.json(result)
}
