import { CodegenConfig } from "@graphql-codegen/cli";

const BASE_URL = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges";

export enum Network {
  mainnet = "mainnet",
  polygon = "polygon",
  arbitrum = "arbitrum",
  goerli = "goerli",
}

export const ENDPOINTS = {
  [Network.mainnet]: `${BASE_URL}`,
  [Network.polygon]: `${BASE_URL}-polygon`,
  [Network.arbitrum]: `${BASE_URL}-arbitrum`,
  [Network.goerli]: `${BASE_URL}-goerli`,
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
