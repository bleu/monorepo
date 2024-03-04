import { Address } from "@bleu-fi/utils";
import { gnosis, goerli, mainnet, sepolia } from "viem/chains";

import { ChainId } from "#/utils/chainsPublicClients";

const cowExplorerBaseUrl = "https://explorer.cow.fi/";

const cowExplorerUrl = {
  [mainnet.id]: "",
  [goerli.id]: "goerli",
  [gnosis.id]: "gc",
  [sepolia.id]: "sepolia",
};

export function buildAccountCowExplorerUrl({
  chainId,
  address,
}: {
  chainId: ChainId;
  address: Address;
}) {
  return `${cowExplorerBaseUrl}${cowExplorerUrl[chainId]}/address/${address}`;
}
