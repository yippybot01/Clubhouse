/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/mission-control.html',
        destination: '/mission-control',
      },
    ];
  },
};

module.exports = nextConfig;
