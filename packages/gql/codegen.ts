import { Network } from "@balancer-pool-metadata/shared";
import { CodegenConfig } from "@graphql-codegen/cli";

export enum Subgraph {
  BalancerPoolsMetadata = "balancer-pools-metadata",
}

export const SUBGRAPHS = {
  [Subgraph.BalancerPoolsMetadata]: {
    name: Subgraph.BalancerPoolsMetadata,
    endpoints() {
      const baseEndpoint = "https://api.thegraph.com/subgraphs/name/bleu-llc";

      return {
        [Network.Mainnet]: `${baseEndpoint}/balancer-pools-metadata`,
        [Network.Polygon]: `${baseEndpoint}/balancer-metadata-polygon`,
        [Network.Goerli]: `${baseEndpoint}/balancer-metadata-goerli`,
        // TODO: https://linear.app/bleu-llc/issue/BAL-131/deploy-contracts-in-all-networks-that-balancer-is-deployed
        [Network.Arbitrum]: `${baseEndpoint}/balancer-metadata-goerli`,
      };
    },
    endpointFor(network: Network) {
      return this.endpoints()[network];
    },
  },
};

const generates = Object.assign(
  {},
  ...Object.values(SUBGRAPHS).map(({ name, endpoints }) =>
    Object.fromEntries(
      Object.entries(endpoints()).map(([network, endpoint]) => [
        `./src/__generated__/${name}/${network}.ts`,
        {
          schema: endpoint,
          documents: [`src/${name}/**/*.ts`],
          plugins: [
            "typescript",
            "typescript-operations",
            "typescript-graphql-request",
            "plugin-typescript-swr",
          ],
        },
      ])
    )
  )
);

const config: CodegenConfig = {
  config: {
    autogenSWRKey: true,
  },
  generates,
};

export default config;
