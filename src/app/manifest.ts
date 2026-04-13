import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Compu Act Opleidingen',
    short_name: 'Compu Act',
    description: 'Al meer dan 21 jaar dé specialist in Microsoft Office trainingen. Klassikaal, live online of incompany door heel Nederland.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B6AB3',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  }
}
