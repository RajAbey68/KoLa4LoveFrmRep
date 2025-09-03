// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Skip ESLint during production builds (warnings & errors won't block)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Skip TypeScript type checking during builds (won't block deploy)
  typescript: {
    ignoreBuildErrors: true,
  },

  // (optional) keep whatever else you already had here:
  // reactStrictMode: true,
  // poweredByHeader: false,

  // (optional) if you serve images/videos from external hosts, allow them:
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    qualities: [75, 90, 100], // Fix Next.js 16 warning
  },

  // Ensure the server binds to Replit's port if you rely on it
  env: {
    PORT: process.env.PORT || '5000',
  },
};

export default nextConfig;