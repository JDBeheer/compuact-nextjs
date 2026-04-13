import { NextResponse } from 'next/server'
import { sendContactEmail, sendLeadNotificatie } from '@/lib/email'
import { verifyTurnstileToken } from '@/lib/turnstile'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { voornaam, achternaam, email, telefoon, onderwerp, bericht, turnstileToken } = body

    if (!email || !bericht) {
      return NextResponse.json({ error: 'Ongeldige gegevens' }, { status: 400 })
    }

    const tokenValid = await verifyTurnstileToken(turnstileToken)
    if (!tokenValid) {
      return NextResponse.json({ error: 'Beveiligingsverificatie mislukt. Probeer het opnieuw.' }, { status: 403 })
    }

    await sendContactEmail({ voornaam, achternaam, email, telefoon, onderwerp, bericht })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
