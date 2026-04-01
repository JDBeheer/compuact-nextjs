import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { sendBevestigingsEmail, sendAdminNotificatie } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, cursussen, klantgegevens, totaalprijs } = body

    if (!cursussen?.length || !klantgegevens?.email) {
      return NextResponse.json({ error: 'Ongeldige gegevens' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('inschrijvingen')
      .insert({
        type: type || 'inschrijving',
        cursussen,
        klantgegevens,
        totaalprijs,
        email_verzonden: false,
        status: 'nieuw',
      })
      .select()
      .single()

    if (error) throw error

    // Emails versturen
    try {
      await Promise.all([
        sendBevestigingsEmail(klantgegevens, cursussen, totaalprijs),
        sendAdminNotificatie('inschrijving', klantgegevens, cursussen, totaalprijs),
      ])

      await supabase
        .from('inschrijvingen')
        .update({ email_verzonden: true })
        .eq('id', data.id)
    } catch (emailError) {
      console.error('Email verzenden mislukt:', emailError)
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error('Inschrijving error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
