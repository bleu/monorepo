/** @type {import('next').NextConfig} */

module.exports = {
  transpilePackages: [
    "@balancer-pool-metadata/balancer-gql",
    "@balancer-pool-metadata/pool-metadata-gql",
    "@balancer-pool-metadata/schema",
  ],
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  env: {
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_API_SECRET: process.env.PINATA_API_SECRET,
    NEXT_PUBLIC_PINATA_GW: process.env.NEXT_PUBLIC_PINATA_GW,
  },
};
