/** @type {import('next').NextConfig} */

module.exports = {
  transpilePackages: [
    "@balancer-admin-tools/balancer-gql",
  ],
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  env: {
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_API_SECRET: process.env.PINATA_API_SECRET,
  },
};
