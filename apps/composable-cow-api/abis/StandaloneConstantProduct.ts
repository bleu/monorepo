export const standaloneConstantProductAbi = [
  {
    inputs: [
      {
        internalType: "contract ISettlement",
        name: "_solutionSettler",
        type: "address",
      },
      { internalType: "contract IERC20", name: "_token0", type: "address" },
      { internalType: "contract IERC20", name: "_token1", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "CommitOutsideOfSettlement", type: "error" },
  { inputs: [], name: "OnlyManagerCanCall", type: "error" },
  { inputs: [], name: "OrderDoesNotMatchCommitmentHash", type: "error" },
  { inputs: [], name: "OrderDoesNotMatchDefaultTradeableOrder", type: "error" },
  { inputs: [], name: "OrderDoesNotMatchMessageHash", type: "error" },
  {
    inputs: [{ internalType: "string", name: "", type: "string" }],
    name: "OrderNotValid",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "blockNumber", type: "uint256" },
      { internalType: "string", name: "message", type: "string" },
    ],
    name: "PollTryAtBlock",
    type: "error",
  },
  { inputs: [], name: "TradingParamsDoNotMatchHash", type: "error" },
  { anonymous: false, inputs: [], name: "TradingDisabled", type: "event" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "hash", type: "bytes32" },
      {
        components: [
          { internalType: "uint256", name: "minTradedToken0", type: "uint256" },
          {
            internalType: "contract IPriceOracle",
            name: "priceOracle",
            type: "address",
          },
          { internalType: "bytes", name: "priceOracleData", type: "bytes" },
          { internalType: "bytes32", name: "appData", type: "bytes32" },
        ],
        indexed: false,
        internalType: "struct ConstantProduct.TradingParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "TradingEnabled",
    type: "event",
  },
  {
    inputs: [],
    name: "COMMITMENT_SLOT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EMPTY_COMMITMENT",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_ORDER_DURATION",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NO_TRADING",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "orderHash", type: "bytes32" }],
    name: "commit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "commitment",
    outputs: [{ internalType: "bytes32", name: "value", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "disableTrading",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "minTradedToken0", type: "uint256" },
          {
            internalType: "contract IPriceOracle",
            name: "priceOracle",
            type: "address",
          },
          { internalType: "bytes", name: "priceOracleData", type: "bytes" },
          { internalType: "bytes32", name: "appData", type: "bytes32" },
        ],
        internalType: "struct ConstantProduct.TradingParams",
        name: "tradingParams",
        type: "tuple",
      },
    ],
    name: "enableTrading",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "minTradedToken0", type: "uint256" },
          {
            internalType: "contract IPriceOracle",
            name: "priceOracle",
            type: "address",
          },
          { internalType: "bytes", name: "priceOracleData", type: "bytes" },
          { internalType: "bytes32", name: "appData", type: "bytes32" },
        ],
        internalType: "struct ConstantProduct.TradingParams",
        name: "tradingParams",
        type: "tuple",
      },
    ],
    name: "getTradeableOrder",
    outputs: [
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "sellToken",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "buyToken",
            type: "address",
          },
          { internalType: "address", name: "receiver", type: "address" },
          { internalType: "uint256", name: "sellAmount", type: "uint256" },
          { internalType: "uint256", name: "buyAmount", type: "uint256" },
          { internalType: "uint32", name: "validTo", type: "uint32" },
          { internalType: "bytes32", name: "appData", type: "bytes32" },
          { internalType: "uint256", name: "feeAmount", type: "uint256" },
          { internalType: "bytes32", name: "kind", type: "bytes32" },
          { internalType: "bool", name: "partiallyFillable", type: "bool" },
          {
            internalType: "bytes32",
            name: "sellTokenBalance",
            type: "bytes32",
          },
          { internalType: "bytes32", name: "buyTokenBalance", type: "bytes32" },
        ],
        internalType: "struct GPv2Order.Data",
        name: "order",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "minTradedToken0", type: "uint256" },
          {
            internalType: "contract IPriceOracle",
            name: "priceOracle",
            type: "address",
          },
          { internalType: "bytes", name: "priceOracleData", type: "bytes" },
          { internalType: "bytes32", name: "appData", type: "bytes32" },
        ],
        internalType: "struct ConstantProduct.TradingParams",
        name: "tradingParams",
        type: "tuple",
      },
    ],
    name: "hash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_hash", type: "bytes32" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "isValidSignature",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "manager",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "solutionSettler",
    outputs: [
      { internalType: "contract ISettlement", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "solutionSettlerDomainSeparator",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token0",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tradingParamsHash",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "minTradedToken0", type: "uint256" },
          {
            internalType: "contract IPriceOracle",
            name: "priceOracle",
            type: "address",
          },
          { internalType: "bytes", name: "priceOracleData", type: "bytes" },
          { internalType: "bytes32", name: "appData", type: "bytes32" },
        ],
        internalType: "struct ConstantProduct.TradingParams",
        name: "tradingParams",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "sellToken",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "buyToken",
            type: "address",
          },
          { internalType: "address", name: "receiver", type: "address" },
          { internalType: "uint256", name: "sellAmount", type: "uint256" },
          { internalType: "uint256", name: "buyAmount", type: "uint256" },
          { internalType: "uint32", name: "validTo", type: "uint32" },
          { internalType: "bytes32", name: "appData", type: "bytes32" },
          { internalType: "uint256", name: "feeAmount", type: "uint256" },
          { internalType: "bytes32", name: "kind", type: "bytes32" },
          { internalType: "bool", name: "partiallyFillable", type: "bool" },
          {
            internalType: "bytes32",
            name: "sellTokenBalance",
            type: "bytes32",
          },
          { internalType: "bytes32", name: "buyTokenBalance", type: "bytes32" },
        ],
        internalType: "struct GPv2Order.Data",
        name: "order",
        type: "tuple",
      },
    ],
    name: "verify",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
] as const;
