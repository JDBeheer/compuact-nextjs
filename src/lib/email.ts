import sgMail from '@sendgrid/mail'
import { CartItemCheckout, KlantGegevens } from '@/types'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@computertraining.nl'
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || 'info@computertraining.nl').split(',').map(e => e.trim()).filter(Boolean)
const LEADS_EMAIL = process.env.LEADS_EMAIL || ''

const PRIMARY = '#1B6AB3'
const ACCENT = '#F49800'
const TEXT = '#18181b'
const TEXT_MUTED = '#71717a'
const BORDER = '#e4e4e7'
const BG = '#f4f4f5'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function emailTemplate(content: string, options?: { preheader?: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      ${options?.preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${options.preheader}</div>` : ''}
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:32px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BORDER};">
              <!-- Header -->
              <tr>
                <td style="background-color:${PRIMARY};padding:0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:28px 36px;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background-color:#ffffff;border-radius:6px;padding:4px 12px;">
                              <span style="color:${PRIMARY};font-weight:800;font-size:18px;font-family:Arial,sans-serif;">CA</span>
                            </td>
                            <td style="padding-left:14px;">
                              <span style="color:#ffffff;font-size:20px;font-weight:700;">Compu Act Opleidingen</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="height:4px;background-color:${ACCENT};"></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding:36px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color:${BG};padding:28px 36px;border-top:1px solid ${BORDER};">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:${TEXT_MUTED};font-size:13px;line-height:1.6;">
                        <p style="margin:0;font-weight:600;color:${TEXT};">Compu Act Opleidingen</p>
                        <p style="margin:4px 0 0;">Vincent van Goghweg 85, 1506 JB Zaandam</p>
                        <p style="margin:2px 0 0;">Tel: <a href="tel:0235513409" style="color:${PRIMARY};text-decoration:none;">023-551 3409</a></p>
                        <p style="margin:2px 0 0;"><a href="mailto:info@computertraining.nl" style="color:${PRIMARY};text-decoration:none;">info@computertraining.nl</a></p>
                      </td>
                      <td style="text-align:right;vertical-align:top;">
                        <a href="https://www.computertraining.nl" style="color:${PRIMARY};font-size:13px;text-decoration:none;">computertraining.nl</a>
                      </td>
                    </tr>
                  </table>
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
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:20px 0;border-radius:8px;overflow:hidden;border:1px solid ${BORDER};">
      <tr style="background-color:${PRIMARY};">
        <th style="text-align:left;padding:10px 14px;color:#ffffff;font-size:13px;font-weight:600;">Cursus</th>
        <th style="text-align:left;padding:10px 14px;color:#ffffff;font-size:13px;font-weight:600;">Locatie</th>
        <th style="text-align:left;padding:10px 14px;color:#ffffff;font-size:13px;font-weight:600;">Datum</th>
        <th style="text-align:center;padding:10px 14px;color:#ffffff;font-size:13px;font-weight:600;">Aantal</th>
        <th style="text-align:right;padding:10px 14px;color:#ffffff;font-size:13px;font-weight:600;">Prijs</th>
      </tr>
      ${cursussen.map((c, i) => {
        const aantal = c.aantalDeelnemers || 1
        const deelnemerNamen = c.deelnemers?.length
          ? c.deelnemers.map(d => `${d.voornaam} ${d.achternaam}`.trim()).filter(Boolean).join(', ')
          : ''
        const rowBg = i % 2 === 0 ? '#ffffff' : '#fafafa'
        return `
          <tr style="background-color:${rowBg};">
            <td style="border-bottom:1px solid ${BORDER};padding:10px 14px;font-size:14px;font-weight:600;color:${TEXT};">${escapeHtml(c.cursusTitel)}</td>
            <td style="border-bottom:1px solid ${BORDER};padding:10px 14px;font-size:14px;color:${TEXT_MUTED};">${escapeHtml(c.locatie || '-')}</td>
            <td style="border-bottom:1px solid ${BORDER};padding:10px 14px;font-size:14px;color:${TEXT_MUTED};">${escapeHtml(c.datum || '-')}</td>
            <td style="text-align:center;border-bottom:1px solid ${BORDER};padding:10px 14px;font-size:14px;color:${TEXT};">${aantal}</td>
            <td style="text-align:right;border-bottom:1px solid ${BORDER};padding:10px 14px;font-size:14px;font-weight:600;color:${TEXT};">&euro;${(c.prijs * aantal).toFixed(2)}</td>
          </tr>
          ${deelnemerNamen ? `
          <tr style="background-color:${rowBg};">
            <td colspan="5" style="padding:2px 14px 10px;color:${TEXT_MUTED};font-size:12px;border-bottom:1px solid ${BORDER};">
              Deelnemers: ${escapeHtml(deelnemerNamen)}
            </td>
          </tr>` : ''}
        `
      }).join('')}
    </table>
  `
}

const ADMIN_FEE = 15
const BTW_PERCENTAGE = 21

function totaalBox(totaalprijs: number, options?: { showAdminFee?: boolean; note?: string }): string {
  const showFee = options?.showAdminFee ?? false
  const note = options?.note
  const displayTotal = showFee ? totaalprijs + ADMIN_FEE : totaalprijs

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        <td style="background-color:${BG};border-radius:8px;padding:16px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${showFee ? `
            <tr>
              <td style="font-size:13px;color:${TEXT_MUTED};padding-bottom:6px;">Subtotaal</td>
              <td style="text-align:right;font-size:13px;color:${TEXT_MUTED};padding-bottom:6px;">&euro;${totaalprijs.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:${TEXT_MUTED};padding-bottom:6px;">Administratiekosten</td>
              <td style="text-align:right;font-size:13px;color:${TEXT_MUTED};padding-bottom:6px;">&euro;${ADMIN_FEE.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="border-top:1px solid ${BORDER};padding-top:8px;"></td>
            </tr>
            ` : ''}
            <tr>
              <td style="font-size:14px;color:${TEXT_MUTED};">Totaal excl. ${BTW_PERCENTAGE}% BTW</td>
              <td style="text-align:right;font-size:22px;font-weight:800;color:${TEXT};">&euro;${displayTotal.toFixed(2)}</td>
            </tr>
            ${note ? `<tr><td colspan="2" style="font-size:12px;color:${TEXT_MUTED};padding-top:4px;">${note}</td></tr>` : ''}
          </table>
        </td>
      </tr>
    </table>
  `
}

function infoRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 0;color:${TEXT_MUTED};font-size:14px;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:14px;color:${TEXT};font-weight:500;">${escapeHtml(value)}</td>
    </tr>
  `
}

function sectionTitle(title: string): string {
  return `<h3 style="color:${PRIMARY};font-size:15px;font-weight:700;margin:28px 0 12px;padding-bottom:8px;border-bottom:2px solid ${BG};">${title}</h3>`
}

function badge(text: string, color: string): string {
  return `<span style="display:inline-block;background-color:${color};color:#ffffff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:0.3px;">${text}</span>`
}

// ── Klant bevestiging: Inschrijving ──

export async function sendBevestigingsEmail(
  klant: KlantGegevens,
  cursussen: CartItemCheckout[],
  totaalprijs: number
) {
  const content = `
    ${badge('INSCHRIJVING ONTVANGEN', '#16a34a')}
    <h2 style="color:${TEXT};margin:20px 0 8px;font-size:22px;">Bedankt voor je inschrijving!</h2>
    <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.6;margin:0 0 4px;">
      Hoi ${escapeHtml(klant.voornaam)}, leuk dat je je hebt ingeschreven bij Compu Act Opleidingen. Hieronder een overzicht van je cursus(sen).
    </p>

    ${formatCursussenTabel(cursussen)}
    ${totaalBox(totaalprijs, { showAdminFee: true })}

    ${sectionTitle('Wat kun je verwachten?')}
    <table cellpadding="0" cellspacing="0" style="margin:0;">
      <tr>
        <td style="padding:8px 12px 8px 0;vertical-align:top;color:${ACCENT};font-size:18px;">1.</td>
        <td style="padding:8px 0;font-size:14px;color:${TEXT};">We nemen binnen 1 werkdag contact met je op om je inschrijving te bevestigen.</td>
      </tr>
      <tr>
        <td style="padding:8px 12px 8px 0;vertical-align:top;color:${ACCENT};font-size:18px;">2.</td>
        <td style="padding:8px 0;font-size:14px;color:${TEXT};">Je ontvangt een factuur en praktische informatie over de locatie en het programma.</td>
      </tr>
      <tr>
        <td style="padding:8px 12px 8px 0;vertical-align:top;color:${ACCENT};font-size:18px;">3.</td>
        <td style="padding:8px 0;font-size:14px;color:${TEXT};">Op de cursusdag nemen wij een laptop, cursusmateriaal en certificaat mee. Jij hoeft alleen jezelf mee te nemen!</td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
      <tr>
        <td style="background-color:${PRIMARY};border-radius:8px;text-align:center;padding:0;">
          <a href="https://www.computertraining.nl/cursussen" style="display:block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">Bekijk alle cursussen</a>
        </td>
      </tr>
    </table>

    <p style="color:${TEXT_MUTED};font-size:14px;margin:24px 0 0;">
      Vragen? Bel <a href="tel:0235513409" style="color:${PRIMARY};text-decoration:none;font-weight:600;">023-551 3409</a> of mail
      <a href="mailto:info@computertraining.nl" style="color:${PRIMARY};text-decoration:none;font-weight:600;">info@computertraining.nl</a>
    </p>
  `

  await sgMail.send({
    to: klant.email,
    from: FROM_EMAIL,
    subject: `Bevestiging inschrijving — ${cursussen.map(c => c.cursusTitel).join(', ')}`,
    html: emailTemplate(content, { preheader: `Bedankt voor je inschrijving voor ${cursussen[0]?.cursusTitel || 'je cursus'}!` }),
  })
}

// ── Klant bevestiging: Offerte ──

export async function sendOfferteBevestiging(
  klant: KlantGegevens,
  cursussen: CartItemCheckout[],
  totaalprijs: number
) {
  const content = `
    ${badge('OFFERTE AANVRAAG ONTVANGEN', PRIMARY)}
    <h2 style="color:${TEXT};margin:20px 0 8px;font-size:22px;">Bedankt voor je offerte aanvraag!</h2>
    <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.6;margin:0 0 4px;">
      Hoi ${escapeHtml(klant.voornaam)}, we hebben je aanvraag ontvangen voor de volgende cursus(sen):
    </p>

    ${formatCursussenTabel(cursussen)}
    ${totaalBox(totaalprijs, { showAdminFee: true, note: 'Indicatief totaal' })}

    <p style="color:${TEXT};font-size:14px;line-height:1.6;">
      We stellen een passende offerte samen en nemen binnen 1 werkdag contact met je op.
    </p>

    <p style="color:${TEXT_MUTED};font-size:14px;margin:24px 0 0;">
      Vragen? Bel <a href="tel:0235513409" style="color:${PRIMARY};text-decoration:none;font-weight:600;">023-551 3409</a> of mail
      <a href="mailto:info@computertraining.nl" style="color:${PRIMARY};text-decoration:none;font-weight:600;">info@computertraining.nl</a>
    </p>
  `

  await sgMail.send({
    to: klant.email,
    from: FROM_EMAIL,
    subject: `Offerte aanvraag ontvangen — ${cursussen.map(c => c.cursusTitel).join(', ')}`,
    html: emailTemplate(content, { preheader: `We stellen je offerte samen voor ${cursussen[0]?.cursusTitel || 'je cursus'}.` }),
  })
}

// ── Admin notificatie ──

export async function sendAdminNotificatie(
  type: 'inschrijving' | 'offerte',
  klant: KlantGegevens,
  cursussen: CartItemCheckout[],
  totaalprijs: number
) {
  const isInschrijving = type === 'inschrijving'
  const typeLabel = isInschrijving ? 'Nieuwe inschrijving' : 'Nieuwe offerte aanvraag'
  const badgeColor = isInschrijving ? '#16a34a' : PRIMARY

  const content = `
    ${badge(typeLabel.toUpperCase(), badgeColor)}
    <h2 style="color:${TEXT};margin:20px 0 8px;font-size:22px;">${typeLabel}</h2>

    ${sectionTitle('Klantgegevens')}
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      ${infoRow('Naam', `${klant.voornaam} ${klant.achternaam}`)}
      ${infoRow('Email', klant.email)}
      ${infoRow('Telefoon', klant.telefoon)}
      ${infoRow('Bedrijf', klant.bedrijfsnaam || '-')}
      ${infoRow('Adres', `${klant.adres}, ${klant.postcode} ${klant.stad}`)}
      ${klant.opmerkingen ? infoRow('Opmerkingen', klant.opmerkingen) : ''}
      ${type === 'offerte' ? infoRow('Periode', klant.gewenste_periode || '-') : ''}
      ${type === 'offerte' ? infoRow('Locatie voorkeur', klant.locatie_voorkeur || '-') : ''}
    </table>

    ${sectionTitle('Cursussen')}
    ${formatCursussenTabel(cursussen)}
    ${totaalBox(totaalprijs)}
  `

  await sgMail.send({
    to: ADMIN_EMAILS,
    from: FROM_EMAIL,
    subject: `${isInschrijving ? '🟢' : '🔵'} ${typeLabel} — ${klant.voornaam} ${klant.achternaam} — €${totaalprijs.toFixed(0)}`,
    html: emailTemplate(content),
  })
}

// ── InCompany notificatie ──

type InCompanyData = {
  klant: KlantGegevens
  cursusTitels: string[]
  aantalDeelnemers: number
  gewenstePeriode: string
  locatieVoorkeur: string
  opmerkingen: string
}

export async function sendInCompanyAdmin(data: InCompanyData) {
  const cursusLijst = data.cursusTitels.map(t =>
    `<li style="padding:4px 0;font-size:14px;color:${TEXT};">${escapeHtml(t)}</li>`
  ).join('')

  const adminContent = `
    ${badge('INCOMPANY AANVRAAG', ACCENT)}
    <h2 style="color:${TEXT};margin:20px 0 8px;font-size:22px;">Nieuwe InCompany aanvraag</h2>

    ${sectionTitle('Klantgegevens')}
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      ${infoRow('Naam', `${data.klant.voornaam} ${data.klant.achternaam}`)}
      ${infoRow('Email', data.klant.email)}
      ${infoRow('Telefoon', data.klant.telefoon)}
      ${infoRow('Bedrijf', data.klant.bedrijfsnaam || '-')}
      ${infoRow('Adres', `${data.klant.adres}, ${data.klant.postcode} ${data.klant.stad}`)}
    </table>

    ${sectionTitle('Training details')}
    <table cellpadding="0" cellspacing="0" style="width:100%;">
      ${infoRow('Deelnemers', String(data.aantalDeelnemers))}
      ${infoRow('Periode', data.gewenstePeriode || '-')}
      ${infoRow('Locatie', data.locatieVoorkeur || '-')}
    </table>

    ${sectionTitle('Geselecteerde cursussen')}
    <ul style="margin:0;padding-left:20px;">${cursusLijst}</ul>
    ${data.opmerkingen ? `${sectionTitle('Opmerkingen')}<p style="font-size:14px;color:${TEXT};line-height:1.6;">${escapeHtml(data.opmerkingen)}</p>` : ''}
  `

  await sgMail.send({
    to: ADMIN_EMAILS,
    from: FROM_EMAIL,
    subject: `🟠 InCompany aanvraag — ${data.klant.bedrijfsnaam || data.klant.voornaam + ' ' + data.klant.achternaam} — ${data.aantalDeelnemers} deelnemers`,
    html: emailTemplate(adminContent),
  })
}

export async function sendInCompanyKlant(data: InCompanyData) {
  const cursusLijst = data.cursusTitels.map(t =>
    `<li style="padding:4px 0;font-size:14px;color:${TEXT};">${escapeHtml(t)}</li>`
  ).join('')

  const klantContent = `
    ${badge('INCOMPANY AANVRAAG ONTVANGEN', PRIMARY)}
    <h2 style="color:${TEXT};margin:20px 0 8px;font-size:22px;">Bedankt voor je InCompany aanvraag!</h2>
    <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.6;">
      Hoi ${escapeHtml(data.klant.voornaam)}, we hebben je aanvraag ontvangen voor de volgende cursus(sen):
    </p>

    <ul style="margin:16px 0;padding-left:20px;">${cursusLijst}</ul>

    <div style="background-color:${BG};border-radius:8px;padding:16px 20px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:${TEXT};line-height:1.6;">
        We stellen een passend voorstel samen en nemen binnen 1 werkdag contact met je op om de details te bespreken.
      </p>
    </div>

    <p style="color:${TEXT_MUTED};font-size:14px;margin:24px 0 0;">
      Vragen? Bel <a href="tel:0235513409" style="color:${PRIMARY};text-decoration:none;font-weight:600;">023-551 3409</a> of mail
      <a href="mailto:info@computertraining.nl" style="color:${PRIMARY};text-decoration:none;font-weight:600;">info@computertraining.nl</a>
    </p>
  `

  await sgMail.send({
    to: data.klant.email,
    from: FROM_EMAIL,
    subject: 'Bevestiging InCompany aanvraag — Compu Act Opleidingen',
    html: emailTemplate(klantContent, { preheader: 'We stellen een passend voorstel samen voor je InCompany training.' }),
  })
}

export async function sendInCompanyNotificatie(data: InCompanyData) {
  await Promise.all([
    sendInCompanyAdmin(data),
    sendInCompanyKlant(data),
  ])
}

// ── Contact formulier ──

export async function sendContactEmail(data: {
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  onderwerp: string
  bericht: string
}) {
  const content = `
    ${badge('NIEUW BERICHT', TEXT_MUTED)}
    <h2 style="color:${TEXT};margin:20px 0 8px;font-size:22px;">Contactformulier</h2>

    <table cellpadding="0" cellspacing="0" style="width:100%;">
      ${infoRow('Naam', `${data.voornaam} ${data.achternaam}`)}
      ${infoRow('Email', data.email)}
      ${infoRow('Telefoon', data.telefoon)}
      ${infoRow('Onderwerp', data.onderwerp)}
    </table>

    ${sectionTitle('Bericht')}
    <div style="background-color:${BG};border-radius:8px;padding:16px 20px;margin:8px 0;">
      <p style="font-size:14px;color:${TEXT};line-height:1.7;margin:0;">${escapeHtml(data.bericht).replace(/\n/g, '<br>')}</p>
    </div>
  `

  await sgMail.send({
    to: ADMIN_EMAILS,
    from: FROM_EMAIL,
    replyTo: data.email,
    subject: `Contact: ${data.onderwerp} — ${data.voornaam} ${data.achternaam}`,
    html: emailTemplate(content),
  })
}

// ── Lead notificatie (Jacht Digital) ──

export async function sendLeadNotificatie(
  type: 'inschrijving' | 'offerte' | 'incompany' | 'contact',
  klant: { voornaam: string; achternaam: string; email: string; telefoon?: string; bedrijfsnaam?: string },
  details?: string
) {
  if (!LEADS_EMAIL) return

  const typeLabels: Record<string, { label: string; color: string }> = {
    inschrijving: { label: 'Nieuwe inschrijving', color: '#16a34a' },
    offerte: { label: 'Nieuwe offerte aanvraag', color: PRIMARY },
    incompany: { label: 'Nieuwe InCompany aanvraag', color: ACCENT },
    contact: { label: 'Nieuw contactformulier', color: TEXT_MUTED },
  }

  const cfg = typeLabels[type]

  const content = `
    ${badge(cfg.label.toUpperCase(), cfg.color)}
    <h2 style="color:${TEXT};margin:20px 0 12px;font-size:20px;">${cfg.label}</h2>

    <table cellpadding="0" cellspacing="0" style="width:100%;">
      ${infoRow('Naam', `${klant.voornaam} ${klant.achternaam}`)}
      ${infoRow('Email', klant.email)}
      ${klant.telefoon ? infoRow('Telefoon', klant.telefoon) : ''}
      ${klant.bedrijfsnaam ? infoRow('Bedrijf', klant.bedrijfsnaam) : ''}
    </table>
    ${details ? `<div style="background-color:${BG};border-radius:8px;padding:12px 16px;margin:16px 0;font-size:13px;color:${TEXT_MUTED};">${escapeHtml(details)}</div>` : ''}
  `

  await sgMail.send({
    to: LEADS_EMAIL,
    from: FROM_EMAIL,
    subject: `[Compu Act] ${cfg.label} — ${klant.voornaam} ${klant.achternaam}`,
    html: emailTemplate(content),
  })
}

// ── Test e-mail ──

export async function sendTestEmail(toEmail: string) {
  const content = `
    <h2 style="color:${TEXT};margin:0 0 8px;font-size:22px;">Test e-mail</h2>
    <p style="color:${TEXT_MUTED};font-size:15px;">Dit is een test e-mail van Compu Act Opleidingen.</p>
    <p style="color:${TEXT_MUTED};font-size:15px;">Als je deze e-mail ontvangt, werkt de e-mailconfiguratie correct.</p>
  `

  await sgMail.send({
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Test e-mail — Compu Act Opleidingen',
    html: emailTemplate(content),
  })
}
