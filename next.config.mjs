
const backendPort = parseInt(process.env.BACKEND_PORT || "") || 4000;

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: false,

  async rewrites() {
    return [
      {
        source: '/query/:path*',
        destination: 'http://localhost:' + backendPort + '/query/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:' + backendPort + '/api/:path*',
      },
      {
        source: '/support/api',
        destination: 'http://localhost:' + backendPort + '/api/v1/docs/swagger',
      },
    ]
  },
};

export default nextConfig;