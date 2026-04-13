import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function generateCode(): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const code = (array[0] % 900000) + 100000
  return code.toString()
}

function codeEmailTemplate(code: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
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
                  <h2 style="color:#18181b;margin:0 0 8px;">Verificatiecode</h2>
                  <p style="color:#71717a;font-size:15px;">Gebruik onderstaande code om in te loggen bij het Compu Act CMS.</p>
                  <div style="background:#f4f4f5;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                    <span style="font-size:36px;font-weight:700;letter-spacing:10px;color:#18181b;font-family:monospace;">${code}</span>
                  </div>
                  <p style="color:#a1a1aa;font-size:13px;">Deze code is 10 minuten geldig. Als u niet heeft geprobeerd in te loggen, kunt u dit bericht negeren.</p>
                </td>
              </tr>
              <tr>
                <td style="background-color:#f4f4f5;padding:24px 32px;text-align:center;color:#71717a;font-size:13px;">
                  <p style="margin:0;">Compu Act Opleidingen</p>
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

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const { allowed } = rateLimit(ip, 10, 15 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 })
  }

  const { action, email, code } = await req.json()
  const admin = getAdmin()

  switch (action) {
    case 'send': {
      if (!email) {
        return NextResponse.json({ error: 'Email vereist' }, { status: 400 })
      }

      const { data: adminUser } = await admin
        .from('admin_users')
        .select('auth_user_id, email_2fa_enabled')
        .eq('email', email)
        .eq('actief', true)
        .single()

      if (!adminUser || !adminUser.email_2fa_enabled) {
        return NextResponse.json({ error: 'Email 2FA niet ingeschakeld' }, { status: 400 })
      }

      await admin
        .from('email_2fa_codes')
        .update({ used: true })
        .eq('auth_user_id', adminUser.auth_user_id)
        .eq('used', false)

      const newCode = generateCode()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

      const { error: insertError } = await admin
        .from('email_2fa_codes')
        .insert({
          auth_user_id: adminUser.auth_user_id,
          code: newCode,
          expires_at: expiresAt,
        })

      if (insertError) {
        return NextResponse.json({ error: 'Kon code niet opslaan' }, { status: 500 })
      }

      const apiKey = process.env.SENDGRID_API_KEY
      if (!apiKey) {
        return NextResponse.json({ error: 'E-mail niet geconfigureerd' }, { status: 500 })
      }

      sgMail.setApiKey(apiKey)

      try {
        await sgMail.send({
          to: email,
          from: process.env.FROM_EMAIL || 'info@computertraining.nl',
          subject: 'Uw verificatiecode voor Compu Act CMS',
          html: codeEmailTemplate(newCode),
        })
      } catch {
        return NextResponse.json({ error: 'Kon e-mail niet versturen' }, { status: 500 })
      }

      return NextResponse.json({ ok: true })
    }

    case 'verify': {
      const { allowed: verifyAllowed } = rateLimit(`verify:${ip}`, 10, 10 * 60 * 1000)
      if (!verifyAllowed) {
        return NextResponse.json({ error: 'Te veel verzoeken' }, { status: 429 })
      }

      if (!email || !code) {
        return NextResponse.json({ error: 'Email en code vereist' }, { status: 400 })
      }

      const { data: adminUser } = await admin
        .from('admin_users')
        .select('auth_user_id')
        .eq('email', email)
        .eq('actief', true)
        .single()

      if (!adminUser) {
        return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 })
      }

      const { data: codeRecord } = await admin
        .from('email_2fa_codes')
        .select('id, expires_at')
        .eq('auth_user_id', adminUser.auth_user_id)
        .eq('code', code)
        .eq('used', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!codeRecord) {
        return NextResponse.json({ error: 'Ongeldige code' }, { status: 400 })
      }

      if (new Date(codeRecord.expires_at) < new Date()) {
        return NextResponse.json({ error: 'Code is verlopen' }, { status: 400 })
      }

      await admin
        .from('email_2fa_codes')
        .update({ used: true })
        .eq('id', codeRecord.id)

      return NextResponse.json({ ok: true })
    }

    case 'check': {
      if (!email) {
        return NextResponse.json({ error: 'Email vereist' }, { status: 400 })
      }

      const { data: adminUser } = await admin
        .from('admin_users')
        .select('email_2fa_enabled')
        .eq('email', email)
        .eq('actief', true)
        .single()

      return NextResponse.json({
        enabled: adminUser?.email_2fa_enabled ?? false,
      })
    }

    case 'toggle': {
      const authHeader = req.headers.get('authorization')
      if (!authHeader) {
        return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
      }

      const userClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: authHeader } } }
      )

      const { data: session } = await userClient.auth.getUser()
      if (!session.user) {
        return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
      }

      const { data: current } = await admin
        .from('admin_users')
        .select('email_2fa_enabled')
        .eq('auth_user_id', session.user.id)
        .single()

      const newValue = !(current?.email_2fa_enabled ?? false)

      const { error: updateError } = await admin
        .from('admin_users')
        .update({ email_2fa_enabled: newValue })
        .eq('auth_user_id', session.user.id)

      if (updateError) {
        return NextResponse.json({ error: 'Bewerking mislukt' }, { status: 500 })
      }

      return NextResponse.json({ enabled: newValue })
    }

    default:
      return NextResponse.json({ error: 'Onbekende actie' }, { status: 400 })
  }
}
