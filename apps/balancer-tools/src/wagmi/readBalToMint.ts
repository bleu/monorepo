import { VeBalGetVotingListQuery } from "@bleu-fi/gql/src/balancer-api-v3/__generated__/Ethereum";
import { readContract } from "@wagmi/core";

import { apiChainNameToGaugeType } from "#/app/gaugescheckpointer/(utils)/chainMapping";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

import { checkGaugeMintABI, checkGaugeMintAddress } from "./generated";

export async function readBalToMint(
  votingOption: ArrElement<
    GetDeepProp<VeBalGetVotingListQuery, "veBalGetVotingList">
  >,
) {
  const gaugeType = apiChainNameToGaugeType[votingOption.chain];
  return readContract({
    address: checkGaugeMintAddress[1],
    abi: checkGaugeMintABI,
    // @ts-ignore
    functionName: "queryBalToMint",
    args: [votingOption.gauge.address, gaugeType],
  })
    .then(() => null)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log({ votingOption, errorReason: error.cause.reason });
      return Number(error.cause.reason) * 1e-18;
    });
}
