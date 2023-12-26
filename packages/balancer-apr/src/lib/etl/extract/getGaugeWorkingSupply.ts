import { Address, createPublicClient, getContract, http } from "viem";
import { mainnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.bleu.fi/v1/mainnet"),
  batch: {
    multicall: true,
  },
});

const abi = [
  {
    stateMutability: "view",
    type: "function",
    name: "working_supply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "is_killed",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "inflation_rate",
    inputs: [{ name: "arg0", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const getGaugeWorkingSupply = async (
  gaugeAddressBlockTuples: [Address, number][],
) => {
  if (gaugeAddressBlockTuples.length === 0) return [];

  const responses = await Promise.all(
    gaugeAddressBlockTuples.map(([address, block]) => {
      const gauge = getContract({
        address,
        publicClient,
        abi,
      });

      return gauge.read.working_supply({ blockNumber: BigInt(block) });
    }),
  );
  return responses.map((response, index) => {
    const [address, block] = gaugeAddressBlockTuples[index];
    return response
      ? ([address, block, Number(response) / 1e18] as const)
      : ([address, block, 0] as const);
  });
};
