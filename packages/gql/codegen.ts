import { capitalize, Network } from "@bleu-fi/utils";
import { CodegenConfig } from "@graphql-codegen/cli";

export enum Subgraph {
  BalancerPoolsMetadata = "balancer-pools-metadata",
  BalancerGauges = "balancer-gauges",
  Balancer = "balancer",
}

// IMPORTANT NOTE:
// The endpointFor function expects every network has an endpoint
// If a network doesn't have an endpoint, it will throw an error
// to not break the build and raise an error we used the Goerli endpoints for
// all the networks that don't have an subgraph deployed yet
// this will be removed once we have all the subgraphs deployed
// TODO: https://linear.app/bleu-llc/issue/BAL-131/deploy-contracts-in-all-networks-that-balancer-is-deployed
// https://linear.app/bleu-llc/issue/BAL-290/deploy-subgraph-with-token-relation-on-other-networks

export const SUBGRAPHS = {
  [Subgraph.BalancerPoolsMetadata]: {
    name: Subgraph.BalancerPoolsMetadata,
    endpoints() {
      const baseEndpoint =
        "https://api.thegraph.com/subgraphs/name/bleu-studio";

      return {
        [Network.Ethereum]: `${baseEndpoint}/balancer-pool-metadata`,
        [Network.Sepolia]: `https://api.studio.thegraph.com/query/48427/bal-pool-metadata-sepolia/v0`,
        [Network.Goerli]: `${baseEndpoint}/bal-pools-metadata-goerli`,
        [Network.Polygon]: `${baseEndpoint}/balancer-pools-metadata-matic`,
        [Network.PolygonZKEVM]: `https://api.studio.thegraph.com/query/49707/balacer-pool-metadata-zkevm/version/latest`,
        [Network.Arbitrum]: `${baseEndpoint}/bal-pools-metadata-arb`,
        [Network.Gnosis]: `${baseEndpoint}/balancer-pools-metadata-gnosis`,
        [Network.Optimism]: `${baseEndpoint}/balancer-pools-metadata-op`,
        // TODO: deploy Base and Avalanche subgraphs
        [Network.Base]: `${baseEndpoint}/balancer-pool-metadata`,
        [Network.Avalanche]: `${baseEndpoint}/balancer-pool-metadata`,
      };
    },
    endpointFor(network: Network) {
      return this.endpoints()[network];
    },
  },
  [Subgraph.BalancerGauges]: {
    name: Subgraph.BalancerGauges,
    endpoints() {
      const baseEndpoint =
        "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges";

      return {
        [Network.Ethereum]: `${baseEndpoint}`,
        // TODO: substitute Sepolia
        [Network.Sepolia]: `${baseEndpoint}-goerli`,
        [Network.Goerli]: `${baseEndpoint}-goerli`,
        [Network.Polygon]: `${baseEndpoint}-polygon`,
        [Network.PolygonZKEVM]: `https://api.studio.thegraph.com/query/24660/balancer-gauges-polygon-zk/version/latest`,
        [Network.Arbitrum]: `${baseEndpoint}-arbitrum`,
        [Network.Gnosis]: `${baseEndpoint}-gnosis-chain`,
        [Network.Optimism]: `${baseEndpoint}-optimism`,
        [Network.Base]: `https://api.studio.thegraph.com/query/24660/balancer-gauges-base/version/latest`,
        [Network.Avalanche]: `${baseEndpoint}-avalanche`,
      };
    },
    endpointFor(network: Network) {
      return this.endpoints()[network];
    },
  },
  [Subgraph.Balancer]: {
    name: Subgraph.Balancer,
    endpoints() {
      const baseEndpoint =
        "https://api.thegraph.com/subgraphs/name/balancer-labs";

      return {
        [Network.Ethereum]: `${baseEndpoint}/balancer-v2`,
        [Network.Sepolia]: `https://api.studio.thegraph.com/query/24660/balancer-sepolia-v2/version/latest`,
        [Network.Goerli]: `${baseEndpoint}/balancer-goerli-v2`,
        [Network.Polygon]: `${baseEndpoint}/balancer-polygon-v2`,
        [Network.PolygonZKEVM]: `https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest`,
        [Network.Arbitrum]: `${baseEndpoint}/balancer-arbitrum-v2`,
        [Network.Gnosis]: `${baseEndpoint}/balancer-gnosis-chain-v2`,
        [Network.Optimism]: `${baseEndpoint}/balancer-optimism-v2`,
        [Network.Base]:
          "https://api.studio.thegraph.com/query/24660/balancer-base-v2/version/latest",
        [Network.Avalanche]: `${baseEndpoint}/balancer-avalanche-v2`,
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
      Object.entries(endpoints())
        .map(([network, endpoint]) => [
          [
            `./src/${name}/__generated__/${capitalize(network)}.ts`,
            {
              schema: endpoint,
              documents: [`src/${name}/*.ts`],
              plugins: [
                "typescript",
                "typescript-operations",
                "typescript-graphql-request",
                "plugin-typescript-swr",
              ],
            },
          ],
          [
            `./src/${name}/__generated__/${capitalize(network)}.server.ts`,
            {
              schema: endpoint,
              documents: [`src/${name}/*.ts`],
              plugins: [
                "typescript",
                "typescript-operations",
                "typescript-graphql-request",
              ],
            },
          ],
        ])
        .flat(1),
    ),
  ),
);

const config: CodegenConfig = {
  config: {
    autogenSWRKey: true,
    enumsAsTypes: true,
    futureProofEnums: true,
  },
  generates,
};

export default config;
