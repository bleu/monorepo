/** @type {import('next').NextConfig} */

module.exports = {
  transpilePackages: [
    "@balancer-pool-metadata/balancer-gql",
    "@balancer-pool-metadata/pool-metadata-gql",
  ],
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
};
