import { Address, createPublicClient, getContract, http } from "viem";
import { mainnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.bleu.fi/v1/mainnet"),
  batch: {
    multicall: true,
  },
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

export const getPoolRelativeWeights = async (
  gaugeAddressTimestampTuples: [Address, number][],
) => {
  if (gaugeAddressTimestampTuples.length === 0) return [];

  const responses = await Promise.all(
    gaugeAddressTimestampTuples.map(([address, timestamp]) =>
      gaugesController.read.gauge_relative_weight([
        address,
        BigInt(Math.floor(timestamp)),
      ]),
    ),
  );
  return responses.map((response, index) => {
    const [address, timestamp] = gaugeAddressTimestampTuples[index];
    return response
      ? ([address, timestamp, Number(response) / 1e18] as const)
      : ([address, timestamp, 0] as const);
  });
};
