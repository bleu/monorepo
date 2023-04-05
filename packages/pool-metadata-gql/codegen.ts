import { Network } from "@balancer-pool-metadata/shared";
import { CodegenConfig } from "@graphql-codegen/cli";

const BASE_URL = "https://api.thegraph.com/subgraphs/name/bleu-llc";

// TODO: https://linear.app/bleu-llc/issue/BAL-131/deploy-contracts-in-all-networks-that-balancer-is-deployed
export const ENDPOINTS = {
  [Network.Mainnet]: `${BASE_URL}/balancer-pools-metadata`,
  [Network.Polygon]: `${BASE_URL}/balancer-metadata-polygon`,
  [Network.Arbitrum]: `${BASE_URL}/balancer-pools-metadata`,
  [Network.Goerli]: `${BASE_URL}/balancer-metadata-goerli`,
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
