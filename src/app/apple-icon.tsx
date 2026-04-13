import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1B6AB3',
          borderRadius: '32px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '96px',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-2px',
            marginTop: '-8px',
          }}
        >
          CA
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            right: '24px',
            height: '12px',
            backgroundColor: '#F49800',
            borderRadius: '6px',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
