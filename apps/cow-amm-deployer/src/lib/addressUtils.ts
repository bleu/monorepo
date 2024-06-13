// from https://github.com/cowprotocol/cowswap/blob/ebab592e50a8a5246e4014f2ea44bd4342846894/libs/common-utils/src/legacyAddressUtils.ts#L10

import { ChainId } from "#/utils/chainsPublicClients";

import { CHAIN_INFO } from "./chainInfo";
import { getExplorerOrderLink } from "./cowExplorer";

const ORDER_ID_SHORT_LENGTH = 8;
const COW_ORDER_ID_LENGTH = 114;

export type BlockExplorerLinkType =
  | "transaction"
  | "token"
  | "address"
  | "block"
  | "token-transfer"
  | "composable-order"
  | "event"
  | "contract";

function getEtherscanUrl(
  chainId: ChainId,
  data: string,
  type: BlockExplorerLinkType,
): string {
  const basePath = CHAIN_INFO[chainId].explorer;

  switch (type) {
    case "transaction":
      return `${basePath}/tx/${data}`;
    case "token":
      return `${basePath}/token/${data}`;
    case "block":
      return `${basePath}/block/${data}`;
    case "token-transfer":
      return `${basePath}/address/${data}#tokentxns`;
    case "event":
      return `${basePath}/tx/${data}#eventlog`;
    case "contract":
      return `${basePath}/address/${data}#code`;
    case "address":
    default:
      return `${basePath}/address/${data}`;
  }
}

// Get the right block explorer URL by chainId
export function getBlockExplorerUrl(
  chainId: ChainId,
  type: BlockExplorerLinkType,
  data: string,
): string {
  return getEtherscanUrl(chainId, data, type);
}

export function isCowOrder(type: BlockExplorerLinkType, data?: string) {
  if (!data) return false;

  return type === "transaction" && data.length === COW_ORDER_ID_LENGTH;
}

export function getEtherscanLink(
  chainId: ChainId,
  type: BlockExplorerLinkType,
  data: string,
): string {
  if (isCowOrder(type, data)) {
    // Explorer for CoW orders:
    //    If a transaction has the size of the CoW orderId, then it's a meta-tx
    return getExplorerOrderLink(chainId, data);
  } else {
    return getEtherscanUrl(chainId, data, type);
  }
}

export function getExplorerLabel(
  chainId: ChainId,
  type: BlockExplorerLinkType,
  data?: string,
): string {
  if (isCowOrder(type, data)) {
    return "View on Explorer";
  }

  return `View on ${CHAIN_INFO[chainId].explorerTitle}`;
}

// Shortens OrderID (or any string really) removing initial 2 characters e.g 0x
// and cutting string at 'chars' length, default = 8
export function shortenOrderId(
  orderId: string,
  start = 0,
  chars = ORDER_ID_SHORT_LENGTH,
): string {
  return orderId.substring(start, chars + start);
}

export function formatOrderId(orderId: string): string {
  const has0x = orderId.match("0x");

  // 0x is at index 0 of orderId, shorten. Else return id as is
  return has0x?.index === 0
    ? shortenOrderId(orderId, 2, orderId.length)
    : orderId;
}
