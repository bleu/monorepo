import { ChainId } from "#/utils/chainsPublicClients";

const tokenUrlRoot =
  "https://raw.githubusercontent.com/cowprotocol/token-lists/main/src/public/images";

export const cowprotocolTokenLogoUrl = (address: string, chainId: ChainId) =>
  `${tokenUrlRoot}/${chainId}/${address}/logo.png`;
