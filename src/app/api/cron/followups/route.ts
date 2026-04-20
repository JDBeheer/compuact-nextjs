import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM_EMAIL = process.env.FROM_EMAIL || 'info@computertraining.nl'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.computertraining.nl'
const CRON_SECRET = process.env.CRON_SECRET || ''

const PRIMARY = '#1B6AB3'
const ACCENT = '#F49800'
const TEXT = '#18181b'
const TEXT_MUTED = '#71717a'
const BORDER = '#e4e4e7'
const BG = '#f4f4f5'

function emailTemplate(content: string, preheader?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:32px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BORDER};">
            <tr><td style="background-color:${PRIMARY};padding:0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:28px 36px;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="background-color:#ffffff;border-radius:6px;padding:4px 12px;"><span style="color:${PRIMARY};font-weight:800;font-size:18px;">CA</span></td>
                    <td style="padding-left:14px;"><span style="color:#ffffff;font-size:20px;font-weight:700;">Compu Act Opleidingen</span></td>
                  </tr></table>
                </td></tr>
                <tr><td style="height:4px;background-color:${ACCENT};"></td></tr>
              </table>
            </td></tr>
            <tr><td style="padding:36px;">${content}</td></tr>
            <tr><td style="background-color:${BG};padding:28px 36px;border-top:1px solid ${BORDER};">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td style="color:${TEXT_MUTED};font-size:13px;line-height:1.6;">
                  <p style="margin:0;font-weight:600;color:${TEXT};">Compu Act Opleidingen</p>
                  <p style="margin:4px 0 0;">Tel: <a href="tel:0235513409" style="color:${PRIMARY};text-decoration:none;">023-551 3409</a></p>
                </td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `
}

function cta(text: string, url: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr><td style="background-color:${ACCENT};border-radius:8px;text-align:center;padding:0;">
        <a href="${url}" style="display:block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">${text}</a>
      </td></tr>
    </table>
  `
}

function getEmailContent(stap: number, voornaam: string): { subject: string; html: string; preheader: string } {
  switch (stap) {
    case 1:
      // Dag 2: Heb je de studiegids al bekeken?
      return {
        subject: `${voornaam}, heb je de studiegids al bekeken?`,
        preheader: 'We helpen je graag bij het kiezen van de juiste cursus.',
        html: emailTemplate(`
          <h2 style="color:${TEXT};margin:0 0 8px;font-size:22px;">Heb je de studiegids al bekeken?</h2>
          <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.6;">
            Hoi ${voornaam}, een paar dagen geleden heb je onze studiegids gedownload. Heb je al een cursus gevonden die bij je past?
          </p>
          <p style="color:${TEXT};font-size:14px;line-height:1.6;">
            <strong>Wist je dat?</strong>
          </p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="padding:6px 10px 6px 0;color:${ACCENT};font-size:16px;">→</td><td style="padding:6px 0;font-size:14px;color:${TEXT};">Je met maximaal 10 deelnemers in een groep zit voor persoonlijke aandacht</td></tr>
            <tr><td style="padding:6px 10px 6px 0;color:${ACCENT};font-size:16px;">→</td><td style="padding:6px 0;font-size:14px;color:${TEXT};">Alle cursussen inclusief laptop, materiaal en certificaat zijn</td></tr>
            <tr><td style="padding:6px 10px 6px 0;color:${ACCENT};font-size:16px;">→</td><td style="padding:6px 0;font-size:14px;color:${TEXT};">Je ook een gratis offerte kunt aanvragen als je meerdere cursussen wilt volgen</td></tr>
          </table>
          ${cta('Bekijk ons cursusaanbod', `${SITE_URL}/cursussen`)}
          <p style="color:${TEXT_MUTED};font-size:14px;">
            Hulp nodig bij het kiezen? Bel ons op <a href="tel:0235513409" style="color:${PRIMARY};text-decoration:none;font-weight:600;">023-551 3409</a> — we denken graag met je mee.
          </p>
        `, 'We helpen je graag bij het kiezen van de juiste cursus.'),
      }

    case 2:
      // Dag 5: Populaire cursussen
      return {
        subject: `Onze populairste cursussen — ${voornaam}`,
        preheader: 'Excel, Word en Outlook zijn onze best beoordeelde trainingen.',
        html: emailTemplate(`
          <h2 style="color:${TEXT};margin:0 0 8px;font-size:22px;">Onze populairste cursussen</h2>
          <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.6;">
            Hoi ${voornaam}, dit zijn de cursussen die het vaakst worden gekozen door onze cursisten:
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
            <tr>
              <td style="background-color:#f0fdf4;border-radius:8px;padding:16px;border:1px solid #dcfce7;">
                <p style="margin:0 0 4px;font-weight:700;color:${TEXT};font-size:15px;">1. Excel Basis</p>
                <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">De ideale start voor iedereen die met Excel werkt. Leer formules, tabellen en grafieken.</p>
                <p style="margin:8px 0 0;"><a href="${SITE_URL}/cursussen/excel-basis" style="color:${PRIMARY};font-size:13px;font-weight:600;text-decoration:none;">Bekijk cursus →</a></p>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td style="background-color:#eff6ff;border-radius:8px;padding:16px;border:1px solid #dbeafe;">
                <p style="margin:0 0 4px;font-weight:700;color:${TEXT};font-size:15px;">2. Excel Gevorderd</p>
                <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">Draaitabellen, geavanceerde functies en data-analyse voor ervaren gebruikers.</p>
                <p style="margin:8px 0 0;"><a href="${SITE_URL}/cursussen/excel-gevorderd" style="color:${PRIMARY};font-size:13px;font-weight:600;text-decoration:none;">Bekijk cursus →</a></p>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td style="background-color:#fefce8;border-radius:8px;padding:16px;border:1px solid #fef9c3;">
                <p style="margin:0 0 4px;font-weight:700;color:${TEXT};font-size:15px;">3. Outlook en Time Management</p>
                <p style="margin:0;color:${TEXT_MUTED};font-size:13px;">Werk slimmer met je inbox, agenda en taken. Bespaar tot 30 minuten per dag.</p>
                <p style="margin:8px 0 0;"><a href="${SITE_URL}/cursussen/outlook-en-time-management" style="color:${PRIMARY};font-size:13px;font-weight:600;text-decoration:none;">Bekijk cursus →</a></p>
              </td>
            </tr>
          </table>

          ${cta('Alle cursussen bekijken', `${SITE_URL}/cursussen`)}
        `, 'Excel, Word en Outlook zijn onze best beoordeelde trainingen.'),
      }

    case 3:
      // Dag 10: Laatste tip + incompany
      return {
        subject: `Tip: bespaar met een incompany training — ${voornaam}`,
        preheader: 'Met 3+ deelnemers is incompany voordeliger dan individuele inschrijvingen.',
        html: emailTemplate(`
          <h2 style="color:${TEXT};margin:0 0 8px;font-size:22px;">Wist je dit al?</h2>
          <p style="color:${TEXT_MUTED};font-size:15px;line-height:1.6;">
            Hoi ${voornaam}, een laatste tip van ons:
          </p>

          <div style="background-color:${BG};border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid ${ACCENT};">
            <p style="margin:0 0 8px;font-weight:700;color:${TEXT};font-size:15px;">InCompany training: voordeliger bij 3+ deelnemers</p>
            <p style="margin:0;color:${TEXT_MUTED};font-size:14px;line-height:1.6;">
              Heb je meerdere collega's die dezelfde cursus willen volgen? Met een incompany training komen wij naar jullie toe — of geven we de training live online. Vanaf 3 deelnemers is dit vaak voordeliger dan individuele inschrijvingen.
            </p>
          </div>

          <p style="color:${TEXT};font-size:14px;line-height:1.6;"><strong>Voordelen van InCompany:</strong></p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="padding:6px 10px 6px 0;color:${ACCENT};font-size:16px;">✓</td><td style="padding:6px 0;font-size:14px;color:${TEXT};">Trainingsinhoud afgestemd op jullie praktijk</td></tr>
            <tr><td style="padding:6px 10px 6px 0;color:${ACCENT};font-size:16px;">✓</td><td style="padding:6px 0;font-size:14px;color:${TEXT};">Flexibele datum en locatie</td></tr>
            <tr><td style="padding:6px 10px 6px 0;color:${ACCENT};font-size:16px;">✓</td><td style="padding:6px 0;font-size:14px;color:${TEXT};">Voordeliger bij meerdere deelnemers</td></tr>
            <tr><td style="padding:6px 10px 6px 0;color:${ACCENT};font-size:16px;">✓</td><td style="padding:6px 0;font-size:14px;color:${TEXT};">Inclusief certificaat voor elke deelnemer</td></tr>
          </table>

          ${cta('Vraag een incompany offerte aan', `${SITE_URL}/incompany`)}

          <p style="color:${TEXT_MUTED};font-size:13px;margin-top:16px;">
            Dit was de laatste mail in deze reeks. We sturen je geen verdere e-mails tenzij je je inschrijft voor een cursus. Succes!
          </p>
        `, 'Met 3+ deelnemers is incompany voordeliger dan individuele inschrijvingen.'),
      }

    default:
      return { subject: '', html: '', preheader: '' }
  }
}

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel cron or manual trigger)
  const authHeader = req.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceRoleClient()

  // Get pending follow-ups where verzend_op <= now
  const { data: pending } = await supabase
    .from('studiegids_followups')
    .select('*')
    .eq('verzonden', false)
    .lte('verzend_op', new Date().toISOString())
    .order('verzend_op')
    .limit(50)

  if (!pending || pending.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  for (const followup of pending) {
    const { subject, html } = getEmailContent(followup.stap, followup.voornaam)
    if (!subject) continue

    try {
      await sgMail.send({
        to: followup.email,
        from: FROM_EMAIL,
        subject,
        html,
      })

      await supabase
        .from('studiegids_followups')
        .update({ verzonden: true, verzonden_op: new Date().toISOString() })
        .eq('id', followup.id)

      sent++
    } catch (err) {
      console.error(`Follow-up ${followup.id} failed:`, err)
    }
  }

  return NextResponse.json({ sent, total: pending.length })
}
