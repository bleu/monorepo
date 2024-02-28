import { ChainId } from "#/utils/chainsPublicClients";

import { COW_API_URL_BY_CHAIN_ID } from ".";

export async function uploadAppData({
  appDataHex,
  fullAppData,
  chainId,
}: {
  appDataHex: string;
  fullAppData: string;
  chainId: ChainId;
}) {
  const url = COW_API_URL_BY_CHAIN_ID[chainId];

  return fetch(`${url}/api/v1/app_data/${appDataHex}`, {
    method: "PUT",
    body: JSON.stringify({ fullAppData }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}
