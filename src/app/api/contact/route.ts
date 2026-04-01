import { NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { voornaam, achternaam, email, telefoon, onderwerp, bericht } = body

    if (!email || !bericht) {
      return NextResponse.json({ error: 'Ongeldige gegevens' }, { status: 400 })
    }

    await sendContactEmail({ voornaam, achternaam, email, telefoon, onderwerp, bericht })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
