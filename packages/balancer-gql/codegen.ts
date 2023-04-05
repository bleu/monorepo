import { Network } from "@balancer-pool-metadata/shared";
import { CodegenConfig } from "@graphql-codegen/cli";

const BASE_URL = "https://api.thegraph.com/subgraphs/name/balancer-labs";

export const ENDPOINTS = {
  [Network.Mainnet]: `${BASE_URL}/balancer-v2`,
  [Network.Polygon]: `${BASE_URL}/balancer-polygon-v2`,
  [Network.Arbitrum]: `${BASE_URL}/balancer-arbitrum-v2`,
  [Network.Goerli]: `${BASE_URL}/balancer-goerli-v2`,
};

const plugins = [
  "typescript",
  "typescript-operations",
  "typescript-graphql-request",
  "plugin-typescript-swr",
];

const documents = ["src/queries/**/*.ts"];

const config: CodegenConfig = {
  config: {
    autogenSWRKey: true,
  },
  generates: Object.keys(ENDPOINTS).reduce((acc, key) => {
    acc[`./src/gql/__generated__/${key}.ts`] = {
      schema: ENDPOINTS[key as Network],
      documents,
      plugins,
    };

    return acc;
  }, {} as CodegenConfig["generates"]),
};

export default config;
