import { VeBalGetVotingListQuery } from "@bleu/gql/src/balancer-api-v3/__generated__/Ethereum";
import { readContract } from "@wagmi/core";

import { apiChainNameToGaugeType } from "#/lib/gauge-checkpointer-mappings";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

import {
  gaugeCheckpointerQueriesABI,
  gaugeCheckpointerQueriesAddress,
} from "./generated";

export async function readBalToMint(
  votingOption: ArrElement<
    GetDeepProp<VeBalGetVotingListQuery, "veBalGetVotingList">
  >,
) {
  const gaugeType = apiChainNameToGaugeType[votingOption.chain];
  return readContract({
    address: gaugeCheckpointerQueriesAddress[1],
    abi: gaugeCheckpointerQueriesABI,
    // @ts-ignore
    functionName: "queryCheckpointGauge",
    args: [votingOption.gauge.address, gaugeType],
  })
    .then(() => null)
    .catch((error) => {
      return Number(error.cause.reason) * 1e-18;
    });
}
