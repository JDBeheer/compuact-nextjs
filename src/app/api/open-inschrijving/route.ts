import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@computertraining.nl'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@computertraining.nl'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cursus, type, methode, locaties, maand, voornaam, achternaam, email, telefoon, opmerkingen } = body

    if (!email || !voornaam || !cursus) {
      return NextResponse.json({ error: 'Ongeldige gegevens' }, { status: 400 })
    }

    const typeLabel = type === 'offerte' ? 'Offerte-aanvraag' : 'Inschrijving'

    // Email to admin
    await sgMail.send({
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `${typeLabel}: ${cursus} - ${voornaam} ${achternaam}`,
      html: `
        <h2>${typeLabel} voor ${cursus}</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Cursus</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${cursus}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${typeLabel}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Lesmethode</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${methode}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Locatie(s)</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${(locaties || []).join(', ')}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Gewenste maand</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${maand}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Naam</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${voornaam} ${achternaam}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">E-mail</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefoon</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${telefoon}">${telefoon}</a></td></tr>
          ${opmerkingen ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Opmerkingen</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${opmerkingen}</td></tr>` : ''}
        </table>
      `,
    })

    // Confirmation email to user
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: `Bevestiging: ${typeLabel} ${cursus} - Compu Act Opleidingen`,
      html: `
        <h2>Bedankt voor je ${type === 'offerte' ? 'offerte-aanvraag' : 'inschrijving'}!</h2>
        <p>Beste ${voornaam},</p>
        <p>We hebben je ${type === 'offerte' ? 'offerte-aanvraag' : 'inschrijving'} voor de cursus <strong>${cursus}</strong> ontvangen.</p>
        <p>We nemen zo snel mogelijk contact met je op met passende cursusdata.</p>
        <p><strong>Jouw keuze:</strong></p>
        <ul>
          <li>Lesmethode: ${methode}</li>
          ${locaties?.length ? `<li>Locatie(s): ${locaties.join(', ')}</li>` : ''}
          <li>Gewenste maand: ${maand}</li>
        </ul>
        <p>Heb je in de tussentijd vragen? Bel ons gerust op <strong>023-551 3409</strong>.</p>
        <p>Met vriendelijke groet,<br>Compu Act Opleidingen</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Open inschrijving error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
