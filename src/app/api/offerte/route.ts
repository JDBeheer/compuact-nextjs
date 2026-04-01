import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { sendAdminNotificatie } from '@/lib/email'

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
      await sendAdminNotificatie('offerte', klantgegevens, cursussen || [], totaalprijs || 0)

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
