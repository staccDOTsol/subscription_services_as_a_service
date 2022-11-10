/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAINNET_PRIMARY: process.env.MAINNET_PRIMARY,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, crypto: false }
    return config
  },
}

module.exports = nextConfig
