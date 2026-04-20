/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://challenges.cloudflare.com https://www.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; frame-src https://www.google.com https://challenges.cloudflare.com https://maps.google.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://challenges.cloudflare.com https://api.indexnow.org https://region1.google-analytics.com https://maps.googleapis.com" },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/documents/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000' },
        ],
      },
    ]
  },
  images: {
    minimumCacheTTL: 3600,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/cursussen/categorie/:slug',
        destination: '/cursussen/:slug',
        permanent: true,
      },
      {
        source: '/locatie',
        destination: '/locaties',
        permanent: true,
      },
      {
        source: '/locatie/:slug',
        destination: '/locaties/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
