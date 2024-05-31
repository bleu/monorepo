/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires

/** @type {import('next').NextConfig} */
const moduleExports = {
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, content-type, Authorization",
          },
        ],
      },
    ];
  },
  transpilePackages: ["@bleu/gql"],
  reactStrictMode: true,
  swcMinify: true,
  /**
   * This configuration is following Rainbowkit Migration Guide to Viem
   * 3. Ensure bundler and polyfill compatibility
   * https://www.rainbowkit.com/docs/migration-guide
   */
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: [
      "assets.coingecko.com",
      "raw.githubusercontent.com",
      "assets-cdn.trustwallet.com",
      "beethoven-assets.s3.eu-central-1.amazonaws.com",
      "safe-transaction-assets.safe.global",
    ],
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
        pathname: "/balancer/frontend-v2/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/trustwallet/assets/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/cowprotocol/token-lists/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/centfinance/assets/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname:
          "/images/r2mka0oi/production/bf37b9c7fb36c7d3c96d3d05b45c76d89072b777-1800x1800.png",
      },
      {
        protocol: "https",
        hostname: "gnosis.mypinata.cloud",
        port: "",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "app.stakewise.io",
        port: "",
        pathname: "/static/images/currencies/**",
      },
      {
        protocol: "https",
        hostname: "safe-transaction-assets.safe.global",
        port: "",
        pathname: "/tokens/logos/**",
      },
    ],
  },
};

module.exports = moduleExports;
