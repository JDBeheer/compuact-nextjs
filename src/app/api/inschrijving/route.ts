import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { sendBevestigingsEmail, sendOfferteBevestiging, sendAdminNotificatie } from '@/lib/email'
import { verifyTurnstileToken } from '@/lib/turnstile'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, cursussen, klantgegevens, totaalprijs, turnstileToken } = body

    if (!cursussen?.length || !klantgegevens?.email) {
      return NextResponse.json({ error: 'Ongeldige gegevens' }, { status: 400 })
    }

    const tokenValid = await verifyTurnstileToken(turnstileToken)
    if (!tokenValid) {
      return NextResponse.json({ error: 'Beveiligingsverificatie mislukt.' }, { status: 403 })
    }

    const validType = type === 'offerte' ? 'offerte' : 'inschrijving'

    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('inschrijvingen')
      .insert({
        type: validType,
        cursussen,
        klantgegevens,
        totaalprijs,
        email_verzonden: false,
        status: 'nieuw',
      })
      .select()
      .single()

    if (error) throw error

    try {
      const emailPromises = [
        sendAdminNotificatie(validType, klantgegevens, cursussen, totaalprijs),
      ]

      if (validType === 'inschrijving') {
        emailPromises.push(sendBevestigingsEmail(klantgegevens, cursussen, totaalprijs))
      } else {
        emailPromises.push(sendOfferteBevestiging(klantgegevens, cursussen, totaalprijs))
      }

      await Promise.all(emailPromises)

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
