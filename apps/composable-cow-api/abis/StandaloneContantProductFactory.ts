export const standaloneConstantProductFactoryAbi = [
  {
    inputs: [
      {
        internalType: "contract ISettlement",
        name: "_settler",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OnlyOwnerCanCall",
    type: "error",
  },
  {
    inputs: [{ internalType: "string", name: "", type: "string" }],
    name: "OrderNotValid",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        components: [
          {
            internalType: "contract IConditionalOrder",
            name: "handler",
            type: "address",
          },
          { internalType: "bytes32", name: "salt", type: "bytes32" },
          { internalType: "bytes", name: "staticInput", type: "bytes" },
        ],
        indexed: false,
        internalType: "struct IConditionalOrder.ConditionalOrderParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "ConditionalOrderCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract ConstantProduct",
        name: "amm",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "token0",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "token1",
        type: "address",
      },
    ],
    name: "Deployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract ConstantProduct",
        name: "amm",
        type: "address",
      },
    ],
    name: "TradingDisabled",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "ammOwner", type: "address" },
      { internalType: "contract IERC20", name: "token0", type: "address" },
      { internalType: "contract IERC20", name: "token1", type: "address" },
    ],
    name: "ammDeterministicAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "token0", type: "address" },
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "contract IERC20", name: "token1", type: "address" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
      { internalType: "uint256", name: "minTradedToken0", type: "uint256" },
      {
        internalType: "contract IPriceOracle",
        name: "priceOracle",
        type: "address",
      },
      { internalType: "bytes", name: "priceOracleData", type: "bytes" },
      { internalType: "bytes32", name: "appData", type: "bytes32" },
    ],
    name: "create",
    outputs: [
      {
        internalType: "contract ConstantProduct",
        name: "amm",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ConstantProduct",
        name: "amm",
        type: "address",
      },
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ConstantProduct",
        name: "amm",
        type: "address",
      },
    ],
    name: "disableTrading",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ConstantProduct",
        name: "amm",
        type: "address",
      },
      {
        components: [
          {
            internalType: "contract IConditionalOrder",
            name: "handler",
            type: "address",
          },
          { internalType: "bytes32", name: "salt", type: "bytes32" },
          { internalType: "bytes", name: "staticInput", type: "bytes" },
        ],
        internalType: "struct IConditionalOrder.ConditionalOrderParams",
        name: "params",
        type: "tuple",
      },
      { internalType: "bytes", name: "", type: "bytes" },
      { internalType: "bytes32[]", name: "", type: "bytes32[]" },
    ],
    name: "getTradeableOrderWithSignature",
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
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract ConstantProduct", name: "", type: "address" },
    ],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "settler",
    outputs: [
      { internalType: "contract ISettlement", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ConstantProduct",
        name: "amm",
        type: "address",
      },
      { internalType: "uint256", name: "minTradedToken0", type: "uint256" },
      {
        internalType: "contract IPriceOracle",
        name: "priceOracle",
        type: "address",
      },
      { internalType: "bytes", name: "priceOracleData", type: "bytes" },
      { internalType: "bytes32", name: "appData", type: "bytes32" },
    ],
    name: "updateParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ConstantProduct",
        name: "amm",
        type: "address",
      },
      { internalType: "uint256", name: "amount0", type: "uint256" },
      { internalType: "uint256", name: "amount1", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
