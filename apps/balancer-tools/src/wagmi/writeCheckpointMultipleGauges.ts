import { VeBalGetVotingListQuery } from "@bleu/gql/src/balancer-api-v3/__generated__/Ethereum";
import { Address } from "@bleu/utils";
import { prepareWriteContract, writeContract } from "@wagmi/core";

import { apiChainNameToGaugeType } from "#/lib/gauge-checkpointer-mappings";
import { GetDeepProp } from "#/utils/getTypes";

import {
  stakelessGaugeCheckpointerABI,
  stakelessGaugeCheckpointerAddress,
} from "./generated";

export async function writeCheckpointMultipleGauges({
  votingOptions,
  ethValue,
}: {
  votingOptions: GetDeepProp<VeBalGetVotingListQuery, "veBalGetVotingList">;
  ethValue?: number;
}) {
  const gauges = votingOptions.map(
    (votingOption) => votingOption.gauge.address,
  );
  const gaugesTypes = votingOptions.map(
    (votingOption) => apiChainNameToGaugeType[votingOption.chain],
  );

  const config = await prepareWriteContract({
    address: stakelessGaugeCheckpointerAddress[1] as Address,
    abi: stakelessGaugeCheckpointerABI,
    functionName: "checkpointMultipleGauges",
    args: [gaugesTypes, gauges],
    value: BigInt((ethValue || 0) * 1e18),
  });

  return await writeContract(config);
}
