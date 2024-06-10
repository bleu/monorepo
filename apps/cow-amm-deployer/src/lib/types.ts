export const PRICE_ORACLES = {
  UNI: "Uniswap V2",
  BALANCER: "Balancer",
  SUSHI: "Sushi V2",
  CHAINLINK: "Chainlink",
  CUSTOM: "Custom",
} as const;

export type PriceOraclesValue =
  (typeof PRICE_ORACLES)[keyof typeof PRICE_ORACLES];
