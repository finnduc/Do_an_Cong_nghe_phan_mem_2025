/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/v1/api/:path*',
        destination: `${process.env.EXPRESS_URL}/v1/api/:path*`
      },
    ];
  },
};

export default nextConfig;