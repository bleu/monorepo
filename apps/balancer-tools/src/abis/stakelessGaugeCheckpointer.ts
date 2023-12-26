export const stakelessGaugeCheckpointerAbi = [
  {
    inputs: [
      {
        internalType: "contract IGaugeAdder",
        name: "gaugeAdder",
        type: "address",
      },
      {
        internalType: "contract IAuthorizerAdaptorEntrypoint",
        name: "authorizerAdaptorEntrypoint",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IStakelessGauge",
        name: "gauge",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "indexedGaugeType",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "gaugeType",
        type: "string",
      },
    ],
    name: "GaugeAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IStakelessGauge",
        name: "gauge",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "indexedGaugeType",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "gaugeType",
        type: "string",
      },
    ],
    name: "GaugeRemoved",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "gaugeType", type: "string" },
      {
        internalType: "contract IStakelessGauge[]",
        name: "gauges",
        type: "address[]",
      },
    ],
    name: "addGauges",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "gaugeType", type: "string" },
      {
        internalType: "contract IStakelessGauge[]",
        name: "gauges",
        type: "address[]",
      },
    ],
    name: "addGaugesWithVerifiedType",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "minRelativeWeight", type: "uint256" },
    ],
    name: "checkpointAllGaugesAboveRelativeWeight",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string[]", name: "gaugeTypes", type: "string[]" },
      { internalType: "uint256", name: "minRelativeWeight", type: "uint256" },
    ],
    name: "checkpointGaugesOfTypesAboveRelativeWeight",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string[]", name: "gaugeTypes", type: "string[]" },
      {
        internalType: "contract IStakelessGauge[]",
        name: "gauges",
        type: "address[]",
      },
    ],
    name: "checkpointMultipleGauges",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "gaugeType", type: "string" },
      {
        internalType: "contract IStakelessGauge[]",
        name: "gauges",
        type: "address[]",
      },
    ],
    name: "checkpointMultipleGaugesOfMatchingType",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "gaugeType", type: "string" },
      {
        internalType: "contract IStakelessGauge",
        name: "gauge",
        type: "address",
      },
    ],
    name: "checkpointSingleGauge",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "selector", type: "bytes4" }],
    name: "getActionId",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAuthorizer",
    outputs: [
      { internalType: "contract IAuthorizer", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGaugeAdder",
    outputs: [
      { internalType: "contract IGaugeAdder", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "gaugeType", type: "string" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "getGaugeAtIndex",
    outputs: [
      { internalType: "contract IStakelessGauge", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGaugeTypes",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string[]", name: "gaugeTypes", type: "string[]" },
      { internalType: "uint256", name: "minRelativeWeight", type: "uint256" },
    ],
    name: "getGaugeTypesBridgeCost",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRoundedDownBlockTimestamp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "gaugeType", type: "string" },
      {
        internalType: "contract IStakelessGauge",
        name: "gauge",
        type: "address",
      },
    ],
    name: "getSingleBridgeCost",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "minRelativeWeight", type: "uint256" },
    ],
    name: "getTotalBridgeCost",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "gaugeType", type: "string" }],
    name: "getTotalGauges",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVault",
    outputs: [{ internalType: "contract IVault", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "gaugeType", type: "string" },
      {
        internalType: "contract IStakelessGauge",
        name: "gauge",
        type: "address",
      },
    ],
    name: "hasGauge",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "gaugeType", type: "string" }],
    name: "isValidGaugeType",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "gaugeType", type: "string" },
      {
        internalType: "contract IStakelessGauge[]",
        name: "gauges",
        type: "address[]",
      },
    ],
    name: "removeGauges",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
