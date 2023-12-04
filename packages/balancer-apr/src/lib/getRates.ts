import pThrottle from "p-throttle";
import { Address, getContract } from "viem";

import { publicClients } from "./chainsPublicClients";

export const rateProviderAbi = [
  {
    inputs: [],
    name: "getRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const throttle = pThrottle({
  limit: 24,
  interval: 1000, // 1000 milliseconds = 1 second
});

export const getRates = async (
  rateProviderAddressBlocksTuples: [Address, string, number, Date][]
) => {
  if (rateProviderAddressBlocksTuples.length === 0) return [];

  const responses = await Promise.all(
    rateProviderAddressBlocksTuples.map(([address, network, block]) => {
      const publicClient = publicClients[network];
      const rateProvider = getContract({
        address,
        abi: rateProviderAbi,
        publicClient,
      });
      const throttledRate = throttle(() =>
        rateProvider.read.getRate([], { blockNumber: BigInt(block) })
      );

      return throttledRate();
    })
  );

  return responses.map((response, index) => {
    const [address, network, block, timestamp] =
      rateProviderAddressBlocksTuples[index];
    return response
      ? ([address, network, block, timestamp, Number(response)] as const)
      : ([address, network, block, timestamp, 0] as const);
  });
};
