import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed } = rateLimit(`phone:${ip}`, 10, 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 })
  }

  try {
    const { pagina } = await request.json()

    if (!pagina || typeof pagina !== 'string' || pagina.length > 500) {
      return NextResponse.json({ error: 'Pagina is verplicht' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .from('telefoon_kliks')
      .insert({ pagina })

    if (error) {
      console.error('Telefoon klik opslaan mislukt:', error)
      return NextResponse.json({ error: 'Opslaan mislukt' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
