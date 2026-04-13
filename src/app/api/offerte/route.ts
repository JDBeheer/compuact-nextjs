import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { sendAdminNotificatie, sendLeadNotificatie } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cursussen, klantgegevens, totaalprijs } = body

    if (!klantgegevens?.email) {
      return NextResponse.json({ error: 'Ongeldige gegevens' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('inschrijvingen')
      .insert({
        type: 'offerte',
        cursussen: cursussen || [],
        klantgegevens,
        totaalprijs: totaalprijs || 0,
        email_verzonden: false,
        status: 'nieuw',
      })
      .select()
      .single()

    if (error) throw error

    try {
      const cursusNamen = (cursussen || []).map((c: { cursusTitel: string }) => c.cursusTitel).join(', ')
      await Promise.all([
        sendAdminNotificatie('offerte', klantgegevens, cursussen || [], totaalprijs || 0),
        sendLeadNotificatie('offerte', klantgegevens, cursusNamen ? `Cursussen: ${cursusNamen} — Totaal: €${(totaalprijs || 0).toFixed(2)}` : undefined),
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
    console.error('Offerte error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
