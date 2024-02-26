import { Address } from "@bleu-fi/utils";
import { gnosis, goerli, mainnet } from "viem/chains";

import { ChainId } from "#/utils/chainsPublicClients";

const cowExplorerBaseUrl = "https://explorer.cow.fi/";

const cowExplorerUrl = {
  [mainnet.id]: "",
  [goerli.id]: "goerli",
  [gnosis.id]: "gc",
};

export function buildAccountCowExplorerUrl({
  chainId,
  address,
}: {
  chainId?: ChainId;
  address: Address;
}) {
  if (!chainId) return undefined;
  return `${cowExplorerBaseUrl}${cowExplorerUrl[chainId]}/address/${address}`;
}
