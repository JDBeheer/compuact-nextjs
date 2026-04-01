import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { sendInCompanyNotificatie } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cursusIds, cursusTitels, klantgegevens, aantalDeelnemers, gewenstePeriode, locatieVoorkeur, opmerkingen } = body

    if (!cursusIds?.length || !klantgegevens?.email) {
      return NextResponse.json({ error: 'Ongeldige gegevens' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('inschrijvingen')
      .insert({
        type: 'incompany',
        cursussen: cursusTitels.map((titel: string, i: number) => ({
          cursusTitel: titel,
          cursusId: cursusIds[i],
        })),
        klantgegevens: {
          ...klantgegevens,
          gewenste_periode: gewenstePeriode,
          locatie_voorkeur: locatieVoorkeur,
        },
        totaalprijs: 0,
        email_verzonden: false,
        status: 'nieuw',
      })
      .select()
      .single()

    if (error) throw error

    try {
      await sendInCompanyNotificatie({
        klant: klantgegevens,
        cursusTitels,
        aantalDeelnemers,
        gewenstePeriode,
        locatieVoorkeur,
        opmerkingen,
      })

      await supabase
        .from('inschrijvingen')
        .update({ email_verzonden: true })
        .eq('id', data.id)
    } catch (emailError) {
      console.error('Email verzenden mislukt:', emailError)
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error('InCompany error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
