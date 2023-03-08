/** @type {import('next').NextConfig} */

module.exports = {
  transpilePackages: ["@balancer-pool-metadata/balancer-gql"],
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
};
