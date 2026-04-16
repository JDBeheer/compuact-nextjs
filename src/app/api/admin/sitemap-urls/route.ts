import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.authenticated) return auth.response

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.computertraining.nl'

  try {
    const res = await fetch(`${siteUrl}/sitemap.xml`)
    const xml = await res.text()

    // Extract all <loc> URLs from sitemap
    const urls: string[] = []
    const locRegex = /<loc>([^<]+)<\/loc>/g
    let match
    while ((match = locRegex.exec(xml)) !== null) {
      // Convert full URL to path
      const url = match[1]
      const path = url.replace(siteUrl, '')
      if (path) urls.push(path)
    }

    return NextResponse.json({ urls, count: urls.length })
  } catch {
    return NextResponse.json({ error: 'Kon sitemap niet laden' }, { status: 500 })
  }
}
