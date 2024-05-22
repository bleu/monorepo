import { Address, formatUnits, PublicClient } from "viem";
import { gnosis, mainnet, sepolia } from "viem/chains";

import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { priceFeedAbi } from "./abis/priceFeed";
import { priceFeedRegisterAbi } from "./abis/priceFeedRegister";
import { IToken } from "./types";

export const PRICE_FEED_REGISTER_ADDRESS = {
  [mainnet.id]: "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf",
} as const;

export interface OracleFinderArgs {
  chainId: ChainId;
  token: IToken;
}

export interface Oracles {
  ETH?: Address;
  USD?: Address;
}

export interface IRoute {
  priceFeedToken0: Address;
  priceFeedToken1: Address;
}

export interface IOracleRouterArgs {
  chainId: ChainId;
  token0: IToken;
  token1: IToken;
}

export interface IGnosisPriceFeedItem {
  proxyAddress: Address;
  pair: [string, string];
}

abstract class OracleRouter {
  publicClient: PublicClient;
  chainId: ChainId;
  token0: IToken;
  token1: IToken;

  constructor({ chainId, token0, token1 }: IOracleRouterArgs) {
    this.chainId = chainId;
    this.publicClient = publicClientsFromIds[chainId];
    this.token0 = token0;
    this.token1 = token1;
  }

  abstract findBuyOracle(): Promise<Oracles>;
  abstract findSellOracle(): Promise<Oracles>;

  matchOracles(tokenSellOracles: Oracles, tokenBuyOracles: Oracles): IRoute {
    if (tokenSellOracles.ETH && tokenBuyOracles.ETH) {
      return {
        priceFeedToken0: tokenSellOracles.ETH,
        priceFeedToken1: tokenBuyOracles.ETH,
      };
    }
    if (tokenSellOracles.USD && tokenBuyOracles.USD) {
      return {
        priceFeedToken0: tokenSellOracles.USD,
        priceFeedToken1: tokenBuyOracles.USD,
      };
    }
    throw new Error("No matching oracles found");
  }

  async findRoute(): Promise<IRoute> {
    const [tokenSellOracles, tokenBuyOracles] = await Promise.all([
      this.findSellOracle(),
      this.findBuyOracle(),
    ]);
    return this.matchOracles(tokenSellOracles, tokenBuyOracles);
  }

  async fetchOraclePrice(oracle: Address): Promise<number> {
    const [roundData, oracleDecimals] = await Promise.all([
      this.publicClient.readContract({
        address: oracle,
        abi: priceFeedAbi,
        functionName: "latestRoundData",
      }) as Promise<[bigint, bigint, bigint, bigint, bigint]>,
      this.publicClient.readContract({
        address: oracle,
        abi: priceFeedAbi,
        functionName: "decimals",
      }) as Promise<number>,
    ]);
    return Number(formatUnits(roundData[1], oracleDecimals));
  }

  async calculatePrice(route: IRoute): Promise<number> {
    const [sellPrice, buyPrice] = await Promise.all([
      this.fetchOraclePrice(route.priceFeedToken0),
      this.fetchOraclePrice(route.priceFeedToken1),
    ]);
    return sellPrice / buyPrice;
  }
}

export const WETH_MAINNET_ADDRESS =
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const WETH_GNOSIS_ADDRESS = "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1";

export class MainnetRouter extends OracleRouter {
  ETH_REGISTER_REFERENCE: Address;
  USD_REGISTER_REFERENCE: Address;

  constructor({ chainId, token0, token1 }: IOracleRouterArgs) {
    super({ chainId, token0, token1 });
    this.chainId = 1;
    this.ETH_REGISTER_REFERENCE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    this.USD_REGISTER_REFERENCE = "0x0000000000000000000000000000000000000348";
  }

  async getOracleFromRegistry(base: Address, quote: Address) {
    return this.publicClient
      .readContract({
        address: PRICE_FEED_REGISTER_ADDRESS[mainnet.id],
        abi: priceFeedRegisterAbi,
        functionName: "getFeed",
        args: [base, quote],
      })
      .catch(() => undefined);
  }

  async findOracles({ token }: OracleFinderArgs): Promise<Oracles> {
    // WETH is a special case, it`s not on the registry so we should use the ETH reference
    const addressToFind =
      token.address.toLowerCase() === WETH_MAINNET_ADDRESS.toLowerCase()
        ? this.ETH_REGISTER_REFERENCE
        : token.address;
    const [ETH_ORACLE, USD_ORACLE] = await Promise.all([
      this.getOracleFromRegistry(
        addressToFind as Address,
        this.ETH_REGISTER_REFERENCE,
      ),
      this.getOracleFromRegistry(
        addressToFind as Address,
        this.USD_REGISTER_REFERENCE,
      ),
    ]);

    return {
      ETH: ETH_ORACLE,
      USD: USD_ORACLE,
    };
  }

  async findBuyOracle(): Promise<Oracles> {
    return this.findOracles({ chainId: this.chainId, token: this.token1 });
  }

  async findSellOracle(): Promise<Oracles> {
    return this.findOracles({ chainId: this.chainId, token: this.token0 });
  }
}

export class GnosisRouter extends OracleRouter {
  PRICE_FEEDS_URL: string;

  constructor(args: IOracleRouterArgs) {
    super(args);
    this.PRICE_FEEDS_URL =
      "https://reference-data-directory.vercel.app/feeds-xdai-mainnet.json";
  }

  async fetchPriceFeeds() {
    const response = await fetch(this.PRICE_FEEDS_URL);
    return response.json() as Promise<IGnosisPriceFeedItem[]>;
  }

  async findOracle(token: IToken): Promise<Oracles> {
    // WETH is a special case, it`s not on the price feeds so we should use ETH
    const symbolToFind =
      token.address.toLowerCase() === WETH_GNOSIS_ADDRESS.toLowerCase()
        ? "ETH"
        : token.symbol;
    const feeds = await this.fetchPriceFeeds();
    const ETH_ORACLE = feeds.find(
      (feed) => feed.pair[0] === symbolToFind && feed.pair[1] === "ETH",
    );
    const USD_ORACLE = feeds.find(
      (feed) => feed.pair[0] === symbolToFind && feed.pair[1] === "USD",
    );

    return {
      ETH: ETH_ORACLE?.proxyAddress,
      USD: USD_ORACLE?.proxyAddress,
    };
  }

  async findBuyOracle(): Promise<Oracles> {
    return this.findOracle(this.token1);
  }

  async findSellOracle(): Promise<Oracles> {
    return this.findOracle(this.token0);
  }
}

export class SepoliaRouter extends OracleRouter {
  // Sepolia is a testnet, so we always return the same oracles for testing purposes
  async findBuyOracle(): Promise<Oracles> {
    return { ETH: "0xEd2D417d759b1E77fe6A8920C79AE4CE6D6930F7" };
  }

  async findSellOracle(): Promise<Oracles> {
    return { ETH: "0x57Cb700070Cb1b0475E2D668FA8E89cF0Dda9509" };
  }
}

export const CHAINS_ORACLE_ROUTER_FACTORY: Record<
  ChainId,
  new (args: IOracleRouterArgs) => OracleRouter
> = {
  [mainnet.id]: MainnetRouter,
  [sepolia.id]: SepoliaRouter,
  [gnosis.id]: GnosisRouter,
};
