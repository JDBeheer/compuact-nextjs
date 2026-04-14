import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createServiceRoleClient } from '@/lib/supabase/server'
import {
  sendBevestigingsEmail,
  sendOfferteBevestiging,
  sendAdminNotificatie,
  sendInCompanyAdmin,
  sendInCompanyKlant,
} from '@/lib/email'

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authenticated) return auth.response

  try {
    const { id, target } = await request.json()

    if (!id || !target || !['klant', 'admin'].includes(target)) {
      return NextResponse.json({ error: 'Ongeldige parameters' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()
    const { data: inzending, error } = await supabase
      .from('inschrijvingen')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !inzending) {
      return NextResponse.json({ error: 'Inzending niet gevonden' }, { status: 404 })
    }

    const { type, klantgegevens: klant, cursussen, totaalprijs } = inzending

    if (type === 'incompany') {
      const incompanyData = {
        klant,
        cursusTitels: cursussen.map((c: Record<string, unknown>) => String(c.cursusTitel)),
        aantalDeelnemers: cursussen.reduce((sum: number, c: Record<string, unknown>) => sum + (Number(c.aantalDeelnemers) || 1), 0),
        gewenstePeriode: klant.gewenste_periode || '',
        locatieVoorkeur: klant.locatie_voorkeur || '',
        opmerkingen: klant.opmerkingen || '',
      }
      if (target === 'admin') {
        await sendInCompanyAdmin(incompanyData)
      } else {
        await sendInCompanyKlant(incompanyData)
      }
    } else if (target === 'klant') {
      if (type === 'offerte') {
        await sendOfferteBevestiging(klant, cursussen, totaalprijs)
      } else {
        await sendBevestigingsEmail(klant, cursussen, totaalprijs)
      }
    } else {
      await sendAdminNotificatie(type === 'offerte' ? 'offerte' : 'inschrijving', klant, cursussen, totaalprijs)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend email error:', error)
    return NextResponse.json({ error: 'Verzenden mislukt' }, { status: 500 })
  }
}
