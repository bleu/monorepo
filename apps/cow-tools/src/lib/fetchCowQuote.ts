import { gnosis, goerli } from "viem/chains";

import { ChainId } from "#/utils/chainsPublicClients";

const COW_API_BASE_URL = "https://api.cow.fi/";

const COW_API_URL_BY_CHAIN_ID = {
  [gnosis.id]: COW_API_BASE_URL + "xdai",
  [goerli.id]: COW_API_BASE_URL + "goerli",
};

export async function fetchCowQuote({
  tokenIn,
  tokenOut,
  amountIn,
  chainId,
  priceQuality = "fast",
}: {
  tokenIn: {
    address: string;
    decimals: number;
    symbol: string;
  };
  tokenOut: {
    address: string;
    decimals: number;
    symbol: string;
  };
  amountIn: number;
  chainId: ChainId;
  priceQuality?: "fast" | "optimal";
}) {
  const url = COW_API_URL_BY_CHAIN_ID[chainId];

  const bodyObject = {
    sellToken: tokenIn.address,
    buyToken: tokenOut.address,
    receiver: "0x0000000000000000000000000000000000000000",
    from: "0x0000000000000000000000000000000000000000",
    kind: "sell",
    partiallyFillable: false,
    priceQuality,
    sellTokenBalance: "erc20",
    buyTokenBalance: "erc20",
    sellAmountBeforeFee: amountIn.toLocaleString().replaceAll(",", ""),
    signingScheme: "eip1271",
    onChainOrder: true,
    appData:
      "0x2B8694ED30082129598720860E8E972F07AA10D9B81CAE16CA0E2CFB24743E24",
  };
  return fetch(`${url}/api/v1/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObject),
  }).then((res) => res.json());
}
