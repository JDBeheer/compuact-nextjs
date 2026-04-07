import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { pagina } = await request.json()

    if (!pagina || typeof pagina !== 'string') {
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
