/** @type {import('next').NextConfig} */

module.exports = {
  transpilePackages: [
    "@balancer-pool-metadata/gql",
    "@balancer-pool-metadata/schema",
  ],
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/metadata",
        permanent: false,
      },
    ];
  },
};
