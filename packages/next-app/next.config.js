// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const moduleExports = {
  transpilePackages: [
    "@balancer-pool-metadata/gql",
    "@balancer-pool-metadata/schema",
  ],
  experimental: {
    appDir: true,
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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        port: "",
        pathname: "/coins/images/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/trustwallet/assets/master/blockchains/ethereum/assets/**",
      },
      {
        protocol: "https",
        hostname: "cdn.moralis.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
