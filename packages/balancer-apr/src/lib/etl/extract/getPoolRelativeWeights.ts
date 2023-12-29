import pThrottle from "p-throttle";
import { Address, createPublicClient, getContract, http } from "viem";
import { mainnet } from "viem/chains";

import { logIfVerbose } from "../../../index";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.bleu.fi/v1/mainnet", {
    batch: true,
  }),
  batch: {
    multicall: true,
  },
  cacheTime: 10_000,
});

// Constants and Initializations
const GAUGES_CONTROLLER_MAINNET_ADDRESS =
  "0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD";

const gaugesController = getContract({
  address: GAUGES_CONTROLLER_MAINNET_ADDRESS,
  abi: [
    {
      stateMutability: "view",
      type: "function",
      name: "gauge_relative_weight",
      inputs: [{ name: "addr", type: "address" }],
      outputs: [{ name: "", type: "uint256" }],
    },
    {
      stateMutability: "view",
      type: "function",
      name: "gauge_relative_weight",
      inputs: [
        { name: "addr", type: "address" },
        { name: "time", type: "uint256" },
      ],
      outputs: [{ name: "", type: "uint256" }],
    },
  ] as const,
  publicClient,
});

const throttle = pThrottle({
  limit: 20,
  interval: 1_000,
});

export const getPoolRelativeWeights = async (
  gaugeAddressTimestampTuples: [Address, number][],
) => {
  if (gaugeAddressTimestampTuples.length === 0) return [];

  const responses = await Promise.all(
    gaugeAddressTimestampTuples.map(([address, timestamp], idx) => {
      return throttle(() => {
        try {
          logIfVerbose(
            `$${address}:${timestamp} Fetching working supply, ${idx + 1}/${
              gaugeAddressTimestampTuples.length
            }`,
          );
          return gaugesController.read.gauge_relative_weight([
            address,
            BigInt(Math.floor(timestamp)),
          ]);
        } catch (e) {
          logIfVerbose(
            `Error fetching relative weight ${address}:${timestamp}`,
            // @ts-expect-error
            e,
          );
          return null;
        }
      })();
    }),
  );

  return responses.map((response, index) => {
    const [address, timestamp] = gaugeAddressTimestampTuples[index];
    return response
      ? ([address, timestamp, Number(response) / 1e18] as const)
      : ([address, timestamp, 0] as const);
  });
};
