export const cowAmmModuleFactoryAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address",
      },
      {
        internalType: "address",
        name: "_extensibleFallbackHandler",
        type: "address",
      },
      {
        internalType: "address",
        name: "_composableCow",
        type: "address",
      },
      {
        internalType: "address",
        name: "_ammHandler",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "IMPLEMENTATION",
    outputs: [
      {
        internalType: "contract CowAmmModule",
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
        name: "safe",
        type: "address",
      },
    ],
    name: "create",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "safe",
        type: "address",
      },
    ],
    name: "predictAddress",
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
];
