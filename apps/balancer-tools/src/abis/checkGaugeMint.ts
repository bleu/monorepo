export const checkGaugeMintAbi = [
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
        internalType: "contract IStakelessGauge",
        name: "gauge",
        type: "address",
      },
      {
        internalType: "string",
        name: "gaugeType",
        type: "string",
      },
    ],
    name: "queryBalToMint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
