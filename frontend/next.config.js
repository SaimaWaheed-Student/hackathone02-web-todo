/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' is needed for Docker but must be disabled on Vercel
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  reactStrictMode: true,
}

module.exports = nextConfig
