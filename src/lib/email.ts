import sgMail from '@sendgrid/mail'
import { CartItemCheckout, KlantGegevens } from '@/types'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@computertraining.nl'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@computertraining.nl'
const LEADS_EMAIL = process.env.LEADS_EMAIL || ''

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
                <td style="background-color:#1B6AB3;padding:24px 32px;">
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
                  <p style="margin:0 0 4px;">Tel: 023-551 3409</p>
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

function formatCursussenTabel(cursussen: CartItemCheckout[]): string {
  return `
    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">
      <tr style="background-color:#f4f4f5;">
        <th style="text-align:left;border-bottom:2px solid #e4e4e7;padding:8px;">Cursus</th>
        <th style="text-align:left;border-bottom:2px solid #e4e4e7;padding:8px;">Locatie</th>
        <th style="text-align:left;border-bottom:2px solid #e4e4e7;padding:8px;">Datum</th>
        <th style="text-align:center;border-bottom:2px solid #e4e4e7;padding:8px;">Deelnemers</th>
        <th style="text-align:right;border-bottom:2px solid #e4e4e7;padding:8px;">Prijs</th>
      </tr>
      ${cursussen.map(c => {
        const aantal = c.aantalDeelnemers || 1
        const deelnemerNamen = c.deelnemers?.length
          ? c.deelnemers.map(d => `${d.voornaam} ${d.achternaam}`.trim()).filter(Boolean).join(', ')
          : ''
        return `
          <tr>
            <td style="border-bottom:1px solid #e4e4e7;padding:8px;">${c.cursusTitel}</td>
            <td style="border-bottom:1px solid #e4e4e7;padding:8px;">${c.locatie || '-'}</td>
            <td style="border-bottom:1px solid #e4e4e7;padding:8px;">${c.datum || '-'}</td>
            <td style="text-align:center;border-bottom:1px solid #e4e4e7;padding:8px;">${aantal}</td>
            <td style="text-align:right;border-bottom:1px solid #e4e4e7;padding:8px;">&euro;${(c.prijs * aantal).toFixed(2)}</td>
          </tr>
          ${deelnemerNamen ? `
          <tr>
            <td colspan="5" style="padding:4px 8px 8px;color:#71717a;font-size:12px;border-bottom:1px solid #e4e4e7;">
              Deelnemers: ${deelnemerNamen}
            </td>
          </tr>` : ''}
        `
      }).join('')}
    </table>
  `
}

export async function sendBevestigingsEmail(
  klant: KlantGegevens,
  cursussen: CartItemCheckout[],
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

export async function sendOfferteBevestiging(
  klant: KlantGegevens,
  cursussen: CartItemCheckout[],
  totaalprijs: number
) {
  const content = `
    <h2 style="color:#18181b;margin:0 0 16px;">Bevestiging offerte aanvraag</h2>
    <p>Beste ${klant.voornaam},</p>
    <p>Bedankt voor uw offerte aanvraag bij Compu Act Opleidingen. Wij hebben uw aanvraag ontvangen voor de volgende cursus(sen):</p>
    ${formatCursussenTabel(cursussen)}
    <p style="font-size:16px;"><strong>Indicatief totaal: &euro;${totaalprijs.toFixed(2)}</strong> <span style="color:#71717a;font-size:13px;">(excl. BTW)</span></p>
    <p>Wij stellen een passende offerte samen en nemen zo snel mogelijk contact met u op.</p>
    <p>Met vriendelijke groet,<br>Compu Act Opleidingen</p>
  `

  await sgMail.send({
    to: klant.email,
    from: FROM_EMAIL,
    subject: 'Bevestiging offerte aanvraag - Compu Act Opleidingen',
    html: emailTemplate(content),
  })
}

export async function sendAdminNotificatie(
  type: 'inschrijving' | 'offerte',
  klant: KlantGegevens,
  cursussen: CartItemCheckout[],
  totaalprijs: number
) {
  const typeLabel = type === 'inschrijving' ? 'Nieuwe inschrijving' : 'Nieuwe offerte aanvraag'

  const extraVelden = type === 'offerte' ? `
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

export async function sendInCompanyNotificatie(data: {
  klant: KlantGegevens
  cursusTitels: string[]
  aantalDeelnemers: number
  gewenstePeriode: string
  locatieVoorkeur: string
  opmerkingen: string
}) {
  const cursusLijst = data.cursusTitels.map(t => `<li>${t}</li>`).join('')

  // Admin email
  const adminContent = `
    <h2 style="color:#18181b;margin:0 0 16px;">Nieuwe InCompany aanvraag</h2>
    <h3>Klantgegevens</h3>
    <p><strong>Naam:</strong> ${data.klant.voornaam} ${data.klant.achternaam}</p>
    <p><strong>Email:</strong> ${data.klant.email}</p>
    <p><strong>Telefoon:</strong> ${data.klant.telefoon}</p>
    <p><strong>Bedrijf:</strong> ${data.klant.bedrijfsnaam || '-'}</p>
    <p><strong>Adres:</strong> ${data.klant.adres}, ${data.klant.postcode} ${data.klant.stad}</p>
    <h3>Training details</h3>
    <p><strong>Aantal deelnemers:</strong> ${data.aantalDeelnemers}</p>
    <p><strong>Gewenste periode:</strong> ${data.gewenstePeriode || '-'}</p>
    <p><strong>Locatie voorkeur:</strong> ${data.locatieVoorkeur || '-'}</p>
    <h3>Geselecteerde cursussen</h3>
    <ul>${cursusLijst}</ul>
    ${data.opmerkingen ? `<h3>Opmerkingen</h3><p>${data.opmerkingen}</p>` : ''}
  `

  const klantContent = `
    <h2 style="color:#18181b;margin:0 0 16px;">Bevestiging InCompany aanvraag</h2>
    <p>Beste ${data.klant.voornaam},</p>
    <p>Bedankt voor uw InCompany aanvraag bij Compu Act Opleidingen. Wij hebben uw aanvraag ontvangen voor de volgende cursus(sen):</p>
    <ul>${cursusLijst}</ul>
    <p>Wij stellen een passend voorstel samen en nemen zo snel mogelijk contact met u op om de details te bespreken.</p>
    <p>Met vriendelijke groet,<br>Compu Act Opleidingen</p>
  `

  await Promise.all([
    sgMail.send({
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `Nieuwe InCompany aanvraag - ${data.klant.bedrijfsnaam || data.klant.voornaam + ' ' + data.klant.achternaam}`,
      html: emailTemplate(adminContent),
    }),
    sgMail.send({
      to: data.klant.email,
      from: FROM_EMAIL,
      subject: 'Bevestiging InCompany aanvraag - Compu Act Opleidingen',
      html: emailTemplate(klantContent),
    }),
  ])
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

export async function sendLeadNotificatie(
  type: 'inschrijving' | 'offerte' | 'incompany' | 'contact',
  klant: { voornaam: string; achternaam: string; email: string; telefoon?: string; bedrijfsnaam?: string },
  details?: string
) {
  if (!LEADS_EMAIL) return

  const typeLabels: Record<string, string> = {
    inschrijving: 'Nieuwe inschrijving',
    offerte: 'Nieuwe offerte aanvraag',
    incompany: 'Nieuwe InCompany aanvraag',
    contact: 'Nieuw contactformulier',
  }

  const content = `
    <h2 style="color:#18181b;margin:0 0 16px;">🔔 ${typeLabels[type]}</h2>
    <table cellpadding="4" cellspacing="0" style="font-size:14px;">
      <tr><td style="color:#71717a;">Type</td><td><strong>${typeLabels[type]}</strong></td></tr>
      <tr><td style="color:#71717a;">Naam</td><td>${klant.voornaam} ${klant.achternaam}</td></tr>
      <tr><td style="color:#71717a;">Email</td><td>${klant.email}</td></tr>
      ${klant.telefoon ? `<tr><td style="color:#71717a;">Telefoon</td><td>${klant.telefoon}</td></tr>` : ''}
      ${klant.bedrijfsnaam ? `<tr><td style="color:#71717a;">Bedrijf</td><td>${klant.bedrijfsnaam}</td></tr>` : ''}
    </table>
    ${details ? `<hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0;"><p style="color:#71717a;font-size:13px;">${details}</p>` : ''}
  `

  await sgMail.send({
    to: LEADS_EMAIL,
    from: FROM_EMAIL,
    subject: `[Compu Act] ${typeLabels[type]} — ${klant.voornaam} ${klant.achternaam}`,
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
