/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    ]
  },
};

export default nextConfig;
