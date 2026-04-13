import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { action, factorId, code } = await req.json()

  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } }
  )

  switch (action) {
    case 'enroll': {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
      })
    }

    case 'verify': {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
      if (challengeError) return NextResponse.json({ error: challengeError.message }, { status: 400 })

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code,
      })
      if (verifyError) return NextResponse.json({ error: verifyError.message }, { status: 400 })
      return NextResponse.json({ ok: true })
    }

    case 'unenroll': {
      const { error } = await supabase.auth.mfa.unenroll({ factorId })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ ok: true })
    }

    case 'list': {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ factors: data.totp || [] })
    }

    default:
      return NextResponse.json({ error: 'Onbekende actie' }, { status: 400 })
  }
}
