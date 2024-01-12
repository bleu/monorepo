export const gaugeCheckpointerQueriesAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "balancerTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "gaugeCheckpointerAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "BAL",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gaugeCheckpointer",
    outputs: [
      {
        internalType: "contract IStakelessGaugeCheckpointer",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "gauge",
        type: "address",
      },
      {
        internalType: "string",
        name: "gaugeType",
        type: "string",
      },
    ],
    name: "queryCheckpointGauge",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;
