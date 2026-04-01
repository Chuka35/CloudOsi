/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '67ab4d8d-c7e7-427a-aa1c-f15ce1598d78-00-2rgd5c5sdl7w7.spock.replit.dev',
    '*.spock.replit.dev',
    '*.replit.dev',
    '*.kirk.replit.dev',
  ],
}

export default nextConfig
