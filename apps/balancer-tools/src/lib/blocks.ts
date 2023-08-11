import axios from "axios";

enum Chain {
  mainnet,
  polygon,
  arbitrum,
  gnosis,
}

const BLOCKS_SUBGRAPH_URL_MAP: Record<Chain, string> = {
  [Chain.mainnet]:
    "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
  [Chain.polygon]:
    "https://api.thegraph.com/subgraphs/name/ianlapham/polygon-blocks",
  [Chain.arbitrum]:
    "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks",
};

const CHAIN_BLOCK_EXPLORER_FN_MAP: Record<
  Chain,
  (timestamp: number) => string
> = {
  [Chain.gnosis]: (timestamp: number) =>
    `https://api.gnosisscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${process.env.GNOSIS_API_KEY}`,
};

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
    const response = await axios.get(CHAIN_BLOCK_EXPLORER_FN_MAP[chain](t));
    return parseInt(response.data.result);
  }

  static async getBlockNumberByTimestamp(
    chain: Chain = Chain.mainnet,
    timestamp: number = this.getTime24hAgo(),
  ): Promise<number> {
    const url = BLOCKS_SUBGRAPH_URL_MAP[chain];
    if (!url) {
      return this.bestGuess(chain, timestamp);
    }

    const data = await this.gql(
      url,
      BLOCKS_QUERY,
      this.getTimestamps(timestamp),
    );
    return parseInt(data.blocks[0].number);
  }

  // Placeholder methods for gql, getTime24hAgo and getTimestamps which were in the original python code but not provided.
  static async gql(url: string, query: string, variables: any): Promise<any> {
    // Implement GraphQL query execution.
    // You might need to use a GraphQL client or make an axios request with the right headers.
    throw new Error("Not Implemented");
  }

  static getTime24hAgo(): number {
    // Convert this method to return the required timestamp.
    throw new Error("Not Implemented");
  }

  static getTimestamps(timestamp: number): any {
    // Convert this method to return the timestamps as per your requirements.
    throw new Error("Not Implemented");
  }
}

export default Subgraph;
