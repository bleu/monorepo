import { CodegenConfig } from "@graphql-codegen/cli";

const BASE_URL = "https://api.thegraph.com/subgraphs/name/bleu-llc";

export enum Network {
  // mainnet = "mainnet",
  // polygon = "polygon",
  // arbitrum = "arbitrum",
  goerli = "goerli",
}

export const ENDPOINTS = {
  // [Network.mainnet]: `${BASE_URL}/balancer-v2`,
  // [Network.polygon]: `${BASE_URL}/balancer-polygon-v2`,
  // [Network.arbitrum]: `${BASE_URL}/balancer-arbitrum-v2`,
  [Network.goerli]: `${BASE_URL}/balancer-pools-metadata`,
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
