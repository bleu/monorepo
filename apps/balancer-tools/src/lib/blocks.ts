import { gql } from "#/app/apr/(utils)/balancerAPI";

enum Chain {
  mainnet,
  polygon,
  arbitrum,
  gnosis,
}

const BLOCKS_SUBGRAPH_URL_MAP = {
  [Chain.mainnet]:
    "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
  [Chain.polygon]:
    "https://api.thegraph.com/subgraphs/name/ianlapham/polygon-blocks",
  [Chain.arbitrum]:
    "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks",
} as const;

const CHAIN_BLOCK_EXPLORER_FN_MAP = {
  [Chain.gnosis]: (timestamp: number) =>
    `https://api.gnosisscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${process.env.GNOSIS_API_KEY}`,
} as const;

const BLOCKS_QUERY = `
query($timestamp_gte: BigInt, $timestamp_lt: BigInt) {
    blocks(
        first: 1,
        orderBy: number,
        orderDirection: asc,
        where: {
            timestamp_gte: $timestamp_gte,
            timestamp_lt: $timestamp_lt
        }
      ) {
            number
      }
}
`;

const CHAIN_AVG_BLOCK_TIME: Record<Chain, number> = {
  [Chain.mainnet]: 13,
  [Chain.polygon]: 2,
  [Chain.arbitrum]: 2,
  [Chain.gnosis]: 2,
};

class Subgraph {
  static async bestGuess(
    chain: Chain = Chain.mainnet,
    t: number = this.getTime24hAgo(),
  ): Promise<number> {
    if (chain !== Chain.gnosis) {
      throw new Error("Only gnosis is supported for bestGuess");
    }
    const response = await fetch(CHAIN_BLOCK_EXPLORER_FN_MAP[chain](t));
    const json = await response.json();
    return parseInt(json.data.result);
  }

  static async getBlockNumberByTimestamp(
    chain: Chain = Chain.mainnet,
    timestamp: number = this.getTime24hAgo(),
  ): Promise<number> {
    if (chain === Chain.gnosis) {
      return this.bestGuess(chain, timestamp);
    }

    const data = await gql(BLOCKS_SUBGRAPH_URL_MAP[chain], BLOCKS_QUERY, {
      timestamp_gte: timestamp,
      timestamp_lt: timestamp + 60 * 60,
    });
    return parseInt(data.blocks[0].number);
  }

  static getTime24hAgo(): number {
    return Math.floor(Date.now() / 1000) - 24 * 60 * 60;
  }
}

export default Subgraph;
