export const manualPoolsRateProvider = [
  {
    poolAddress:
      "0x1ee442b5326009bb18f2f472d3e0061513d1a0ff000200000000000000000464",
    address: "0x1a8F81c256aee9C640e14bB0453ce247ea0DFE6F",
    token: {
      address: "0xae78736cd615f374d3085123a210448e74fc6393",
      symbol: "rETH",
    },
  },
  {
    poolAddress:
      "0x577f6076e558818a5df21ce4acde9a9623ec0b4c000200000000000000000a64",
    address: "0xeE652bbF72689AA59F0B8F981c9c90e2A8Af8d8f",
    token: {
      address: "0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6",
      symbol: "MaticX",
    },
    //TODO on BAL-781, MaticX does not update the rate daily.
  },
  {
    poolAddress:
      "0xeab6455f8a99390b941a33bbdaf615abdf93455e000200000000000000000a66",
    address: "0xdEd6C522d803E35f65318a9a4d7333a22d582199",
    token: {
      address: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
      symbol: "stMatic",
    },
  },
] as const;
