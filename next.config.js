/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/twilio/:path*',
        destination: '/api/twilio/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
