import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Compu Act Opleidingen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const categoryConfig: Record<string, { label: string; color: string }> = {
  excel: { label: 'Excel', color: '#059669' },
  word: { label: 'Word', color: '#2563eb' },
  outlook: { label: 'Outlook', color: '#0284c7' },
  powerpoint: { label: 'PowerPoint', color: '#dc2626' },
  'power-bi': { label: 'Power BI', color: '#eab308' },
  'office-365': { label: 'Office 365', color: '#7c3aed' },
  ai: { label: 'AI', color: '#8b5cf6' },
  project: { label: 'Project', color: '#0d9488' },
  visio: { label: 'Visio', color: '#2563eb' },
  vba: { label: 'VBA', color: '#059669' },
}

export default async function Image({ params }: { params: { slug: string } }) {
  const slug = params.slug

  // Check if it's a category
  const cat = categoryConfig[slug]
  if (cat) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#1B6AB3', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ display: 'flex', height: 8, backgroundColor: cat.color, width: '100%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '60px 80px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ display: 'flex', backgroundColor: '#ffffff', color: '#1B6AB3', fontWeight: 800, fontSize: 28, padding: '6px 14px', borderRadius: 8 }}>CA</div>
              <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 600, opacity: 0.9 }}>Compu Act Opleidingen</span>
            </div>
            <h1 style={{ color: '#ffffff', fontSize: 64, fontWeight: 800, lineHeight: 1.1, margin: 0 }}>{cat.label}</h1>
            <h2 style={{ color: '#F49800', fontSize: 40, fontWeight: 700, margin: '8px 0 0' }}>Cursussen</h2>
            <p style={{ color: '#ffffff', fontSize: 22, opacity: 0.8, marginTop: 24 }}>Klassikaal op 17 locaties of live online</p>
          </div>
          <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.15)', padding: '16px 80px' }}>
            <span style={{ color: '#ffffff', fontSize: 18, opacity: 0.7 }}>www.computertraining.nl</span>
          </div>
        </div>
      ),
      { ...size }
    )
  }

  // Course detail — fetch title from database
  let title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/cursussen?slug=eq.${slug}&select=titel,categorie:categorieen(naam)`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      )
      const data = await res.json()
      if (data?.[0]?.titel) title = data[0].titel
    }
  } catch {
    // Use fallback title
  }

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#1B6AB3', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ display: 'flex', height: 8, backgroundColor: '#F49800', width: '100%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '60px 80px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ display: 'flex', backgroundColor: '#ffffff', color: '#1B6AB3', fontWeight: 800, fontSize: 28, padding: '6px 14px', borderRadius: 8 }}>CA</div>
            <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 600, opacity: 0.9 }}>Compu Act Opleidingen</span>
          </div>
          <h1 style={{ color: '#ffffff', fontSize: 52, fontWeight: 800, lineHeight: 1.15, margin: 0 }}>{title}</h1>
          <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 8 }}>
              <span style={{ color: '#ffffff', fontSize: 16 }}>Klassikaal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 8 }}>
              <span style={{ color: '#ffffff', fontSize: 16 }}>Live Online</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 8 }}>
              <span style={{ color: '#ffffff', fontSize: 16 }}>In-Company</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.15)', padding: '16px 80px', justifyContent: 'space-between' }}>
          <span style={{ color: '#ffffff', fontSize: 18, opacity: 0.7 }}>www.computertraining.nl</span>
          <span style={{ color: '#ffffff', fontSize: 18, opacity: 0.7 }}>17 locaties door heel Nederland</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
