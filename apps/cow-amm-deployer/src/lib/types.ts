export type argTypeName =
  | "uint256"
  | "address"
  | "bool"
  | "address[]"
  | "bool[]"
  | "bytes"
  | "uint24[]";

export type argType =
  | string
  | bigint
  | boolean
  | string[]
  | boolean[]
  | bigint[];

export interface PriceCheckerArgument {
  name: string;
  type: argTypeName;
  encodingLevel: number;
  label?: string;
  inputType?: "number" | "text" | "checkbox";
  convertInput?: (input: argType | number, decimals?: number) => argType;
  convertOutput?: (
    output: argType,
    decimals?: number,
  ) => Exclude<argType, bigint | bigint[]> | number | number[];
  description?: string;
  link?: string;
  step?: number;
}

export enum PRICE_CHECKERS {
  FIXED_MIN_OUT = "Fixed Minimum Out Amount",
  UNI_V2 = "Uniswap V2",
  SUSHI_SWAP = "SushiSwap",
  CHAINLINK = "Chainlink",
  BALANCER = "Balancer BAL WETH Single Sided",
  UNI_V3 = "Uniswap V3",
  CURVE = "Curve",
  META = "Meta",
}
