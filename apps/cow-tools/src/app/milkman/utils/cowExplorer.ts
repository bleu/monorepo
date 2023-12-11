import { Address } from "@bleu-fi/utils";
import { goerli, mainnet } from "viem/chains";

export type chainId = typeof goerli.id | typeof mainnet.id;

const cowExplorerBaseUrl = "https://explorer.cow.fi/";

const cowExplorerUrl = {
  [mainnet.id]: "",
  [goerli.id]: "goerli",
};

export function buildAccountCowExplorerUrl({
  chainId,
  address,
}: {
  chainId?: chainId;
  address: Address;
}) {
  if (!chainId) return undefined;
  return `${cowExplorerBaseUrl}${cowExplorerUrl[chainId]}/address/${address}`;
}
