export const eventEmitterABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "identifier", type: "bytes32" },
      { internalType: "address", name: "addr", type: "address" },
    ],
    name: "authorize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "identifier", type: "bytes32" },
      { internalType: "bytes", name: "message", type: "bytes" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "emitEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "bytes32", name: "", type: "bytes32" },
    ],
    name: "isAuthorized",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "identifier", type: "bytes32" },
      { internalType: "address", name: "addr", type: "address" },
    ],
    name: "removeAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
