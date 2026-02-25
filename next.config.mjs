
const backendPort = parseInt(Bun.env.BACKEND_PORT || "") || 4000;

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: false,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:' + backendPort + '/api/:path*',
      },
    ]
  },
};

export default nextConfig;