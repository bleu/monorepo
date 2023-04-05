import { Network } from "@balancer-pool-metadata/shared";
import { CodegenConfig } from "@graphql-codegen/cli";

const BASE_URL =
  "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges";

export const ENDPOINTS = {
  [Network.Mainnet]: `${BASE_URL}`,
  [Network.Polygon]: `${BASE_URL}-polygon`,
  [Network.Arbitrum]: `${BASE_URL}-arbitrum`,
  [Network.Goerli]: `${BASE_URL}-goerli`,
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
      config: {
        enumsAsTypes: true,
        futureProofEnums: true,
      },
    };

    return acc;
  }, {} as CodegenConfig["generates"]),
};

export default config;
