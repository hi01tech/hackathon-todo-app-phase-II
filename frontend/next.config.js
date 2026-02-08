/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API requests to backend during development
  // /api/auth/* is handled by Better Auth (Next.js API route)
  // /api/tasks/* and other routes go to FastAPI backend
  async rewrites() {
    return {
      beforeFiles: [
        // Don't rewrite auth routes - let Next.js handle them
      ],
      afterFiles: [
        // Proxy non-auth API requests to FastAPI backend
        {
          source: '/api/tasks/:path*',
          destination: 'http://127.0.0.1:8000/api/tasks/:path*',
        },
        {
          source: '/api/users/:path*',
          destination: 'http://127.0.0.1:8000/api/users/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
