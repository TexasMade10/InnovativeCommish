/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable experimental features that might cause issues
  experimental: {
    appDir: false,
  },
  
  // TypeScript configuration
  typescript: {
    // Don't ignore build errors - fix them instead
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Don't ignore ESLint errors during builds
    ignoreDuringBuilds: false,
  },
  
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    // Add any webpack customizations here if needed
    return config;
  },
  
  // Headers for better security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 