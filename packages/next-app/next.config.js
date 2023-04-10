/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
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
  sentry: {
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
