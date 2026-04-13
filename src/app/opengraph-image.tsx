import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Compu Act Opleidingen — Microsoft Office Trainingen'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#1B6AB3',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div style={{ display: 'flex', height: 8, backgroundColor: '#F49800', width: '100%' }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '60px 80px',
            justifyContent: 'center',
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#ffffff',
                color: '#1B6AB3',
                fontWeight: 800,
                fontSize: 32,
                padding: '8px 16px',
                borderRadius: 8,
              }}
            >
              CA
            </div>
            <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 600, opacity: 0.9 }}>
              Compu Act Opleidingen
            </span>
          </div>

          {/* Main title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <h1
              style={{
                color: '#ffffff',
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Microsoft Office
            </h1>
            <h1
              style={{
                color: '#F49800',
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Trainingen
            </h1>
          </div>

          {/* Subtitle */}
          <p
            style={{
              color: '#ffffff',
              fontSize: 24,
              opacity: 0.85,
              marginTop: 24,
              lineHeight: 1.4,
            }}
          >
            Excel • Word • PowerPoint • Outlook • Power BI • Office 365 • AI
          </p>

          {/* Stats bar */}
          <div
            style={{
              display: 'flex',
              gap: 40,
              marginTop: 40,
            }}
          >
            {[
              { value: '21+', label: 'jaar ervaring' },
              { value: '17', label: 'locaties' },
              { value: '15.000+', label: 'deelnemers' },
            ].map((stat) => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#F49800', fontSize: 32, fontWeight: 800 }}>{stat.value}</span>
                <span style={{ color: '#ffffff', fontSize: 16, opacity: 0.7 }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(0,0,0,0.15)',
            padding: '16px 80px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#ffffff', fontSize: 18, opacity: 0.7 }}>
            www.computertraining.nl
          </span>
          <span style={{ color: '#ffffff', fontSize: 18, opacity: 0.7 }}>
            Klassikaal • Live Online • In-Company
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
