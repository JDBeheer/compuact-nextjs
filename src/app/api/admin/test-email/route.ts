import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { sendTestEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.authenticated) return auth.response

  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is verplicht' }, { status: 400 })
    }

    await sendTestEmail(email)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({ error: 'Verzenden mislukt' }, { status: 500 })
  }
}
