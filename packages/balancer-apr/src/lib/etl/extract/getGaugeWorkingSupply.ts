import pThrottle from "p-throttle";
import { Address, formatUnits, getContract } from "viem";

import { logIfVerbose } from "../../../index";
import { publicClients } from "../../../lib/chainsPublicClients";

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
  {
    stateMutability: "view",
    type: "function",
    name: "inflation_rate",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const throttle = pThrottle({
  limit: 10,
  interval: 100,
});

const WEEK = 86400n * 7n;

export const getGaugeWorkingSupply = async (
  gaugeAddressNetworkTimestampBlockTuples: [Address, string, number, number][],
) => {
  if (gaugeAddressNetworkTimestampBlockTuples.length === 0) return [];

  const responses = await Promise.all(
    gaugeAddressNetworkTimestampBlockTuples.map(
      ([address, network, timestamp, block], idx) => {
        return throttle(async () => {
          if (!address) return [null, null, null, null];

          logIfVerbose(
            `${network}:${address}:${timestamp} Fetching working supply, ${
              idx + 1
            }/${gaugeAddressNetworkTimestampBlockTuples.length}`,
          );

          const publicClient = publicClients[network];

          const gauge = getContract({
            address,
            abi,
            publicClient,
          });

          const promises = [
            gauge.read.working_supply({ blockNumber: BigInt(block) }),
            gauge.read.totalSupply({ blockNumber: BigInt(block) }),
          ];

          if (network !== "ethereum") {
            promises.push(
              gauge.read.inflation_rate([BigInt(timestamp) / WEEK]),
            );
          }

          try {
            const results = await Promise.allSettled(promises);

            let workingSupply, totalSupply, inflationRate;

            if (results[0].status === "rejected") {
              logIfVerbose(
                `${network}:${address}:${timestamp} Error: ${results[0].reason.shortMessage}`,
              );
            } else if (results[0]) {
              workingSupply = formatUnits(results[0].value, 18);
            }

            if (results[1].status === "rejected") {
              logIfVerbose(
                `${network}:${address}:${timestamp} Error: ${results[1].reason.shortMessage}`,
              );
            } else if (results[1]) {
              totalSupply = formatUnits(results[1].value, 18);
            }

            if (results[2] && results[2].status === "rejected") {
              logIfVerbose(
                `${network}:${address}:${timestamp} Error: ${results[2]?.reason?.shortMessage}`,
              );
            } else if (results[2]) {
              inflationRate = formatUnits(results[2].value, 18);
            }

            if (results.every((r) => r.status === "rejected"))
              return [null, null, null, null];

            return [address, workingSupply, totalSupply, inflationRate];
          } catch (e) {
            logIfVerbose(
              `Error fetching working supply ${network}:${address}:${timestamp}`,
              // @ts-expect-error
              e,
            );
            return [null, null, null, null];
          }
        })();
      },
    ),
  );

  return responses.map(([_, workingSupply, totalSupply, inflationRate]) => {
    return {
      workingSupply,
      inflationRate,
      totalSupply,
    };
  });
};
