export const cowAmmModuleAbi = [
  {
    inputs: [
      {
        internalType: "contract GPv2Settlement",
        name: "_settler",
        type: "address",
      },
      {
        internalType: "contract ExtensibleFallbackHandler",
        name: "_extensibleFallbackHandler",
        type: "address",
      },
      {
        internalType: "contract ComposableCoW",
        name: "_composableCow",
        type: "address",
      },
      {
        internalType: "contract IConditionalOrder",
        name: "_handler",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ModuleAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "NoActiveAMM",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAClone",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlySafe",
    type: "error",
  },
  {
    inputs: [],
    name: "TokenBalanceZero",
    type: "error",
  },
  {
    inputs: [],
    name: "COMPOSABLE_COW",
    outputs: [
      {
        internalType: "contract ComposableCoW",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "COW_DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EXTENSIBLE_FALLBACK_HANDLER",
    outputs: [
      {
        internalType: "contract ExtensibleFallbackHandler",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "HANDLER",
    outputs: [
      {
        internalType: "contract IConditionalOrder",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VAULT_RELAYER",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "activeOrder",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "closeAmm",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token0",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "token1",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minTradedToken0",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "priceOracle",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "priceOracleData",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "appData",
        type: "bytes32",
      },
    ],
    name: "createAmm",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_safe",
        type: "address",
      },
    ],
    name: "initialize",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token0",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "token1",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minTradedToken0",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "priceOracle",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "priceOracleData",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "appData",
        type: "bytes32",
      },
    ],
    name: "replaceAmm",
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "safe",
    outputs: [
      {
        internalType: "contract Safe",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
