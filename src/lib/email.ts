import sgMail from '@sendgrid/mail'
import { CartItem, KlantGegevens } from '@/types'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@computertraining.nl'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@computertraining.nl'

function emailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="background-color:#16a34a;padding:24px 32px;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;">Compu Act Opleidingen</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="background-color:#f4f4f5;padding:24px 32px;text-align:center;color:#71717a;font-size:13px;">
                  <p style="margin:0 0 8px;">Compu Act Opleidingen</p>
                  <p style="margin:0 0 4px;">Vincent van Goghweg 85, 1506 JB Zaandam</p>
                  <p style="margin:0 0 4px;">Tel: 085 105 8919</p>
                  <p style="margin:0;">info@computertraining.nl</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function formatCursussenTabel(cursussen: CartItem[]): string {
  return `
    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
      <tr style="background-color:#f4f4f5;">
        <th style="text-align:left;border-bottom:2px solid #e4e4e7;padding:8px;">Cursus</th>
        <th style="text-align:left;border-bottom:2px solid #e4e4e7;padding:8px;">Locatie</th>
        <th style="text-align:left;border-bottom:2px solid #e4e4e7;padding:8px;">Datum</th>
        <th style="text-align:right;border-bottom:2px solid #e4e4e7;padding:8px;">Prijs</th>
      </tr>
      ${cursussen.map(c => `
        <tr>
          <td style="border-bottom:1px solid #e4e4e7;padding:8px;">${c.cursusTitel}</td>
          <td style="border-bottom:1px solid #e4e4e7;padding:8px;">${c.locatie}</td>
          <td style="border-bottom:1px solid #e4e4e7;padding:8px;">${c.datum}</td>
          <td style="text-align:right;border-bottom:1px solid #e4e4e7;padding:8px;">&euro;${c.prijs.toFixed(2)}</td>
        </tr>
      `).join('')}
    </table>
  `
}

export async function sendBevestigingsEmail(
  klant: KlantGegevens,
  cursussen: CartItem[],
  totaalprijs: number
) {
  const content = `
    <h2 style="color:#18181b;margin:0 0 16px;">Bevestiging van uw inschrijving</h2>
    <p>Beste ${klant.voornaam},</p>
    <p>Bedankt voor uw inschrijving bij Compu Act Opleidingen. Hieronder vindt u een overzicht van uw gekozen cursus(sen):</p>
    ${formatCursussenTabel(cursussen)}
    <p style="font-size:16px;"><strong>Totaalprijs: &euro;${totaalprijs.toFixed(2)}</strong> <span style="color:#71717a;font-size:13px;">(excl. 21% BTW &amp; &euro;15 administratiekosten)</span></p>
    <p>Wij nemen zo snel mogelijk contact met u op om uw inschrijving te bevestigen.</p>
    <p>Met vriendelijke groet,<br>Compu Act Opleidingen</p>
  `

  await sgMail.send({
    to: klant.email,
    from: FROM_EMAIL,
    subject: 'Bevestiging inschrijving - Compu Act Opleidingen',
    html: emailTemplate(content),
  })
}

export async function sendAdminNotificatie(
  type: 'inschrijving' | 'offerte',
  klant: KlantGegevens,
  cursussen: CartItem[],
  totaalprijs: number
) {
  const typeLabel = type === 'inschrijving' ? 'Nieuwe inschrijving' : 'Nieuwe offerte aanvraag'

  const extraVelden = type === 'offerte' ? `
    <p><strong>Aantal deelnemers:</strong> ${klant.aantal_deelnemers || '-'}</p>
    <p><strong>Gewenste periode:</strong> ${klant.gewenste_periode || '-'}</p>
    <p><strong>Locatie voorkeur:</strong> ${klant.locatie_voorkeur || '-'}</p>
  ` : ''

  const content = `
    <h2 style="color:#18181b;margin:0 0 16px;">${typeLabel}</h2>
    <h3>Klantgegevens</h3>
    <p><strong>Naam:</strong> ${klant.voornaam} ${klant.achternaam}</p>
    <p><strong>Email:</strong> ${klant.email}</p>
    <p><strong>Telefoon:</strong> ${klant.telefoon}</p>
    <p><strong>Bedrijf:</strong> ${klant.bedrijfsnaam || '-'}</p>
    <p><strong>Adres:</strong> ${klant.adres}, ${klant.postcode} ${klant.stad}</p>
    ${klant.opmerkingen ? `<p><strong>Opmerkingen:</strong> ${klant.opmerkingen}</p>` : ''}
    ${extraVelden}
    <h3>Cursussen</h3>
    ${formatCursussenTabel(cursussen)}
    <p style="font-size:16px;"><strong>Totaalprijs: &euro;${totaalprijs.toFixed(2)}</strong></p>
  `

  await sgMail.send({
    to: ADMIN_EMAIL,
    from: FROM_EMAIL,
    subject: `${typeLabel} - ${klant.voornaam} ${klant.achternaam}`,
    html: emailTemplate(content),
  })
}

export async function sendContactEmail(data: {
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  onderwerp: string
  bericht: string
}) {
  const content = `
    <h2 style="color:#18181b;margin:0 0 16px;">Nieuw contactformulier bericht</h2>
    <p><strong>Naam:</strong> ${data.voornaam} ${data.achternaam}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Telefoon:</strong> ${data.telefoon}</p>
    <p><strong>Onderwerp:</strong> ${data.onderwerp}</p>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0;">
    <p>${data.bericht.replace(/\n/g, '<br>')}</p>
  `

  await sgMail.send({
    to: ADMIN_EMAIL,
    from: FROM_EMAIL,
    replyTo: data.email,
    subject: `Contact: ${data.onderwerp}`,
    html: emailTemplate(content),
  })
}

export async function sendTestEmail(toEmail: string) {
  const content = `
    <h2 style="color:#18181b;margin:0 0 16px;">Test e-mail</h2>
    <p>Dit is een test e-mail van Compu Act Opleidingen.</p>
    <p>Als u deze e-mail ontvangt, werkt de e-mailconfiguratie correct.</p>
  `

  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Test e-mail - Compu Act Opleidingen',
    html: emailTemplate(content),
  })
}
