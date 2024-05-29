import { dateToEpoch } from "@bleu/utils/date";
import { logIfVerbose } from "lib/logIfVerbose";
import pThrottle from "p-throttle";
import { Address, getContract } from "viem";

import { publicClients } from "../../chainsPublicClients";

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
  interval: 100,
  limit: 10,
});

export const getRates = async (
  rateProviderAddressBlocksTuples: [Address, string, number, Date][],
) => {
  if (rateProviderAddressBlocksTuples.length === 0) return [];

  const responses = await Promise.all(
    rateProviderAddressBlocksTuples.map(
      async ([address, network, block, timestamp]) => {
        // logIfVerbose(`Getting rates for ${address} on ${network}:${block}`);
        const publicClient = publicClients[network];
        const rateProvider = getContract({
          address,
          abi: rateProviderAbi,
          client: {
            public: publicClient,
          },
        });
        return throttle(async () => {
          try {
            return await rateProvider.read.getRate({
              blockNumber: BigInt(block),
            });
          } catch (e) {
            // @ts-expect-error
            const message = e.shortMessage || e.message;
            if (message.includes("BAL#004")) {
              return 0;
            } else if (message.includes(`returned no data ("0x")`)) {
              logIfVerbose(
                `${network}:${block}(${dateToEpoch(
                  timestamp,
                )}):${address}.getRate - error: returned no data ("0x")`,
              );
              return null;
            } else if (
              message.includes(`The contract function "getRate" reverted`)
            ) {
              logIfVerbose(
                `${network}:${block}(${dateToEpoch(
                  timestamp,
                )}):${address}.getRate - error: The contract function "getRate" reverted`,
              );
              return null;
            } else if (
              message.includes(
                `Cannot decode zero data ("0x") with ABI parameters.`,
              )
            ) {
              logIfVerbose(
                `${network}:${block}(${dateToEpoch(
                  timestamp,
                )}):${address}.getRate - error: Cannot decode zero data ("0x") with ABI parameters.`,
              );
              return null;
            }
            logIfVerbose(
              `Error getting rate for ${address} on ${network}:${block}: ${message}`,
            );
            return null;
          }
        })();
      },
    ),
  );

  return responses.map((response, index) => {
    const [address, network, block, timestamp] =
      rateProviderAddressBlocksTuples[index];
    return response !== null
      ? ([address, network, block, timestamp, Number(response)] as const)
      : null;
  });
};
