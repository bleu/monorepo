import { gnosis, goerli } from "viem/chains";

import { PRICE_CHECKERS, PriceCheckerArgument } from "./types";

const dynamicSlippageDescription =
  "This value represents the allowed slippage that you accepts between the quote and the order execution";

export const priceCheckersArgumentsMapping = {
  [PRICE_CHECKERS.FIXED_MIN_OUT]: [
    {
      name: "minOut",
      type: "uint256",
      label: "Token to buy minimum amount",
      inputType: "number",
      convertInput: (input: number, decimals: number) =>
        BigInt(input * 10 ** decimals),
      convertOutput: (output: bigint, decimals: number) =>
        Number(output) / 10 ** decimals,
      toExpectedOutCalculator: false,
      description: "The minimum amount of tokens you want to receive.",
    },
  ] as PriceCheckerArgument[],
  [PRICE_CHECKERS.UNI_V2]: [
    {
      name: "allowedSlippageInBps",
      type: "uint256",
      label: "Allowed slippage (%)",
      inputType: "number",
      convertInput: (input: number) => BigInt(input * 100),
      convertOutput: (output: bigint) => Number(output) / 100,
      toExpectedOutCalculator: false,
      description: dynamicSlippageDescription,
    },
  ] as PriceCheckerArgument[],
  [PRICE_CHECKERS.BALANCER]: [
    {
      name: "allowedSlippageInBps",
      type: "uint256",
      label: "Allowed slippage (%)",
      inputType: "number",
      convertInput: (input: number) => BigInt(input * 100),
      convertOutput: (output: bigint) => Number(output) / 100,
      toExpectedOutCalculator: false,
      description: dynamicSlippageDescription,
    },
  ] as PriceCheckerArgument[],
  [PRICE_CHECKERS.SUSHI_SWAP]: [
    {
      name: "allowedSlippageInBps",
      type: "uint256",
      label: "Allowed slippage (%)",
      inputType: "number",
      convertInput: (input: number) => BigInt(input * 100),
      convertOutput: (output: bigint) => Number(output) / 100,
      toExpectedOutCalculator: false,
      description: dynamicSlippageDescription,
    },
  ] as PriceCheckerArgument[],
  [PRICE_CHECKERS.CHAINLINK]: [
    {
      name: "allowedSlippageInBps",
      type: "uint256",
      label: "Allowed slippage (%)",
      inputType: "number",
      convertInput: (input: number) => BigInt(input * 100),
      convertOutput: (output: bigint) => Number(output) / 100,
      toExpectedOutCalculator: false,
      description: dynamicSlippageDescription,
    },
    {
      name: "addressesPriceFeeds",
      type: "address[]",
      label: "Price feeds",
      inputType: "text",
      toExpectedOutCalculator: true,
      convertInput: (input: string) => input,
      convertOutput: (output: string) => output,
      description:
        "The price feeds addresses that will be used to calculate the expected amount of tokens you will receive.",
      link: "https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1",
    },
    {
      name: "revertPriceFeeds",
      type: "bool[]",
      label: "Revert price feeds",
      inputType: "checkbox",
      toExpectedOutCalculator: true,
      convertInput: (input: boolean) => input,
      convertOutput: (output: boolean) => output,
      description:
        "If the price feed will revert, the price checker will revert. This means that if the price feed is A/B and you want B/A you will have to mark this option.",
    },
  ] as PriceCheckerArgument[],
  [PRICE_CHECKERS.UNI_V3]: [
    {
      name: "allowedSlippageInBps",
      type: "uint256",
      label: "Allowed slippage (%)",
      inputType: "number",
      convertInput: (input: number) => BigInt(input * 100),
      convertOutput: (output: bigint) => Number(output) / 100,
      toExpectedOutCalculator: false,
      description: dynamicSlippageDescription,
    },
    {
      name: "tokenIn",
      type: "address[]",
      label: "Token In",
      inputType: "text",
      toExpectedOutCalculator: true,
      convertInput: (input: string) => input,
      convertOutput: (output: string) => output,
      description: "The token you want to sell on each pool.",
    },
    {
      name: "tokenOut",
      type: "address[]",
      label: "Token Out",
      inputType: "text",
      toExpectedOutCalculator: true,
      convertInput: (input: string) => input,
      convertOutput: (output: string) => output,
      description: "The token you want to buy on each pool.",
    },
    {
      name: "fees",
      type: "uint24[]",
      label: "Fees (%)",
      inputType: "number",
      step: 0.01,
      toExpectedOutCalculator: true,
      convertInput: (inputs: number[]) =>
        inputs.map((input) => BigInt(input * 100)),
      convertOutput: (outputs: string[]) =>
        outputs.map((output) => Number(output) / 100),
      description: "The fee of each selected pool.",
      link: "https://info.uniswap.org/#/pools",
    },
  ] as PriceCheckerArgument[],
  [PRICE_CHECKERS.CURVE]: [
    {
      name: "allowedSlippageInBps",
      type: "uint256",
      label: "Allowed slippage (%)",
      inputType: "number",
      convertInput: (input: number) => BigInt(input * 100),
      convertOutput: (output: bigint) => Number(output) / 100,
      toExpectedOutCalculator: false,
    },
  ] as PriceCheckerArgument[],
  [PRICE_CHECKERS.META]: [
    {
      name: "allowedSlippageInBps",
      type: "uint256",
      label: "Allowed slippage (%)",
      inputType: "number",
      convertInput: (input: number) => BigInt(input * 100),
      convertOutput: (output: bigint) => Number(output) / 100,
      toExpectedOutCalculator: false,
      description: dynamicSlippageDescription,
    },
    {
      name: "swapPath",
      type: "address[]",
      label: "Price checker",
      inputType: "text",
      toExpectedOutCalculator: true,
      convertInput: (input: string) => input,
      convertOutput: (output: string) => output,
      description: "The expected out path",
    },
    {
      name: "expectedOutAddresses",
      type: "address[]",
      label: "Price checker",
      inputType: "text",
      toExpectedOutCalculator: true,
      convertInput: (input: string) => input,
      convertOutput: (output: string) => output,
      description: "The expected out path",
    },
    {
      name: "expectedOutData",
      type: "bytes[]",
      label: "Price checker arguments",
      inputType: "text",
      toExpectedOutCalculator: true,
      convertInput: (input: string) => input,
      convertOutput: (output: string) => output,
      description: "The expected out arguments",
    },
  ] as PriceCheckerArgument[],
} as const;

export const priceCheckerAddressesMapping = {
  [goerli.id]: {
    [PRICE_CHECKERS.FIXED_MIN_OUT]:
      "0xEB2bD2818F7CF1D92D81810b0d45852bE48E1502",
    [PRICE_CHECKERS.UNI_V2]: "0x5d74aFFFd2a0250ABA74D6703Bd8e140534b3F36",
    [PRICE_CHECKERS.BALANCER]: "0xA6a7dA94C0D28159B84BC754733781e67E33531D",
    [PRICE_CHECKERS.SUSHI_SWAP]: "0x5A5633909060c75e5B7cB4952eFad918c711F587",
    [PRICE_CHECKERS.CHAINLINK]: "0x81909582e1Ab8a0f8f98C948537528E29a98f116",
    [PRICE_CHECKERS.UNI_V3]: "0xb560a403F8450164b8B745EccA41D8cED93C50a1",
    [PRICE_CHECKERS.CURVE]: "0x",
    [PRICE_CHECKERS.META]: "0x43E850F9B8Cb2635673168F92Cf195F4BcFE056F",
  },
  [gnosis.id]: {
    [PRICE_CHECKERS.FIXED_MIN_OUT]:
      "0x978414CBBE776d3F56E78c6e522dd01B1A608EfC",
    [PRICE_CHECKERS.UNI_V2]: "0x",
    [PRICE_CHECKERS.BALANCER]: "0x",
    [PRICE_CHECKERS.SUSHI_SWAP]: "0x",
    [PRICE_CHECKERS.CHAINLINK]: "0x",
    [PRICE_CHECKERS.UNI_V3]: "0x",
    [PRICE_CHECKERS.CURVE]: "0x5088989fE6f7E89aD94e2AEFb98856CeA04e9135",
    [PRICE_CHECKERS.META]: "0x",
  },
};

export const expectedOutCalculatorAddressesMapping = {
  [goerli.id]: {
    [PRICE_CHECKERS.FIXED_MIN_OUT]: "0x",
    [PRICE_CHECKERS.UNI_V2]: "0x2E93639509A9D7e93f581CEd97F40A1e4e813E7a",
    [PRICE_CHECKERS.BALANCER]: "0x5D6FE80Ce00978dF2D55c46B89A3ed8681323fFe",
    [PRICE_CHECKERS.SUSHI_SWAP]: "0x26eef32497909Bb27E9B40091246c0aA39d1A7dB",
    [PRICE_CHECKERS.CHAINLINK]: "0x9d5f78fb9b120f1fb1321aacf7db6884d2efadab",
    [PRICE_CHECKERS.UNI_V3]: "0x07F20c78b86eC17150805d155C33dd5a6267Ce03",
    [PRICE_CHECKERS.CURVE]: "0x",
    [PRICE_CHECKERS.META]: "0xe35BD2A019a9Dd258a3d98e6aCd97aBB6CDCfA9b",
  },
  [gnosis.id]: {
    [PRICE_CHECKERS.FIXED_MIN_OUT]: "0x",
    [PRICE_CHECKERS.UNI_V2]: "0x",
    [PRICE_CHECKERS.BALANCER]: "0x",
    [PRICE_CHECKERS.SUSHI_SWAP]: "0x",
    [PRICE_CHECKERS.CHAINLINK]: "0x",
    [PRICE_CHECKERS.UNI_V3]: "0x",
    [PRICE_CHECKERS.CURVE]: "0x021CdBed287504F90A76B0D3DD39415B9864D323",
    [PRICE_CHECKERS.META]: "0x",
  },
};

export const validFromDecorator = {
  [goerli.id]: "0x51c911323B12c0c7A5dB0381505dA23B2fd00061" as const,
  [gnosis.id]: "0x" as const,
};

export const deployedPriceCheckersByChain = {
  [goerli.id]: [
    PRICE_CHECKERS.FIXED_MIN_OUT,
    PRICE_CHECKERS.UNI_V2,
    PRICE_CHECKERS.BALANCER,
    PRICE_CHECKERS.CHAINLINK,
    PRICE_CHECKERS.UNI_V3,
    PRICE_CHECKERS.META,
  ] as const,
  [gnosis.id]: [PRICE_CHECKERS.FIXED_MIN_OUT, PRICE_CHECKERS.CURVE],
};

export const priceCheckerHasExpectedOutCalculatorMapping = {
  [PRICE_CHECKERS.FIXED_MIN_OUT]: false,
  [PRICE_CHECKERS.UNI_V2]: true,
  [PRICE_CHECKERS.BALANCER]: true,
  [PRICE_CHECKERS.SUSHI_SWAP]: true,
  [PRICE_CHECKERS.CHAINLINK]: true,
  [PRICE_CHECKERS.UNI_V3]: true,
  [PRICE_CHECKERS.CURVE]: true,
  [PRICE_CHECKERS.META]: true,
} as const;

export const priceCheckerTooltipMessageMapping = {
  [PRICE_CHECKERS.FIXED_MIN_OUT]:
    "This is the simplest price checker, it will accept the quoted order if the amount of tokens you will receive is greater than the minimum amount you set. This means that all the math is on you and, if the order will get a long time to be processed, you will have to predict the price.",
  [PRICE_CHECKERS.UNI_V2]:
    "This price checker will use Uniswap V2 pools to calculate the expected amount of tokens you will receive. To build the path with Uniswap V2 pools, it will always use WETH as the middle token (if it isn't one of the pair tokens).",
  [PRICE_CHECKERS.BALANCER]:
    "This price checker is specific for the case when you want to trade BAL80-WETH20 BPT token to BAL or WETH. It uses BAL infrastructure and Chainlink oracles to calculate the expected amount of tokens you will receive.",
  [PRICE_CHECKERS.SUSHI_SWAP]:
    "This price checker will use SushiSwap pools to calculate the expected amount of tokens you will receive. To build the path with Uniswap V2 pools, it will always use WETH as the middle token (if it isn't one of the pair tokens).",
  [PRICE_CHECKERS.CURVE]:
    "This price checker will use Curve pools to calculate the expected amount of tokens you will receive. To build the path it is used the Curve registry and router.",
  [PRICE_CHECKERS.CHAINLINK]:
    "The Chainlink price checker uses a path of price feeds to calculate the expected amount of tokens you will receive. The only checking that we do here is if the price checker will or not revert, so the construction of the path is up to you, a construction of a wrong path can lead to a relative lower amount of tokens received.",
  [PRICE_CHECKERS.UNI_V3]:
    "This price checker will use Uniswap V3 pools to calculate the expected amount of tokens you will receive. The only checking that we do here is if the price checker will or not revert, so the construction of the path is up to you, a construction of a wrong path can lead to a relative lower amount of tokens received.",
  [PRICE_CHECKERS.META]:
    "This price checker is used when you want to create a price checker that will use different protocols to calculate the expected amount of tokens you will receive. The only checking that we do here is if the price checker will or not revert, so the construction of the path is up to you, a construction of a wrong path can lead to a relative lower amount of tokens received.",
};
