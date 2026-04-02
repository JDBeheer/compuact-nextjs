import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { verifyTurnstileToken } from '@/lib/turnstile'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@computertraining.nl'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@computertraining.nl'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.computertraining.nl'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { voornaam, achternaam, email, telefoon, bedrijfsnaam, type, turnstileToken } = body

    if (!email || !voornaam) {
      return NextResponse.json({ error: 'Vul minimaal je naam en e-mail in' }, { status: 400 })
    }

    // Store lead in Supabase
    const supabase = createServiceRoleClient()
    await supabase.from('inschrijvingen').insert({
      type: 'studiegids' as string,
      cursussen: [{ type: `Studiegids ${type}` }],
      klantgegevens: { voornaam, achternaam, email, telefoon, bedrijfsnaam },
      totaalprijs: 0,
      status: 'verwerkt',
      email_verzonden: true,
    })

    // Send studiegids email to user
    const downloadUrl = `${SITE_URL}/documents/CompuAct_StudieGids_2025-2026.pdf`

    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: 'Je studiegids van Compu Act Opleidingen',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                <tr><td style="background-color:#1B6AB3;padding:24px 32px;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;">Compu Act Opleidingen</h1>
                </td></tr>
                <tr><td style="padding:32px;">
                  <h2 style="color:#18181b;margin:0 0 16px;">Je studiegids staat klaar!</h2>
                  <p>Beste ${voornaam},</p>
                  <p>Bedankt voor je interesse in Compu Act Opleidingen. Hieronder kun je onze studiegids 2025-2026 downloaden.</p>
                  <p style="margin:24px 0;text-align:center;">
                    <a href="${downloadUrl}" style="background-color:#F49800;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                      Download Studiegids (PDF)
                    </a>
                  </p>
                  <p style="color:#71717a;font-size:14px;">In de studiegids vind je:</p>
                  <ul style="color:#71717a;font-size:14px;">
                    <li>Ons complete cursusaanbod (26 trainingen)</li>
                    <li>Alle prijzen en lesvormen</li>
                    <li>Onze trainingslocaties</li>
                    <li>Tips voor het kiezen van de juiste cursus</li>
                  </ul>
                  <p>Heb je vragen of wil je advies? Neem gerust contact met ons op via <strong>023-551 3409</strong> of mail naar <strong>info@computertraining.nl</strong>.</p>
                  <p>Met vriendelijke groet,<br>Compu Act Opleidingen</p>
                </td></tr>
                <tr><td style="background-color:#f4f4f5;padding:24px 32px;text-align:center;color:#71717a;font-size:13px;">
                  <p style="margin:0 0 4px;">Compu Act Opleidingen | 023-551 3409</p>
                  <p style="margin:0;">Vincent van Goghweg 85, 1506 JB Zaandam</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    })

    // Notify admin
    await sgMail.send({
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `Studiegids download - ${voornaam} ${achternaam}`,
      html: `
        <h2>Nieuwe studiegids download</h2>
        <p><strong>Naam:</strong> ${voornaam} ${achternaam}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefoon:</strong> ${telefoon || '-'}</p>
        <p><strong>Bedrijf:</strong> ${bedrijfsnaam || '-'}</p>
        <p><strong>Type:</strong> ${type}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Studiegids error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
