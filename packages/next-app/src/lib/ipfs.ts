import { PoolMetadataAttribute } from "#/contexts/PoolMetadataContext";

export async function pinJSON(poolId: string, metadata: PoolMetadataAttribute[]) {
  const resp = await fetch(`./${poolId}/pin`, {
    method: "POST",
    body: JSON.stringify({ metadata }),
    headers: {
      "Content-Type": "application/json; charset=utf8",
    },
    mode: "no-cors",
  });
  return await resp.json();
}


export async function fetchIpfsData(metadataCID: string) {
  const response = await fetch(`https://ipfs.io/ipfs/${metadataCID}`);
  return await response.json();
}

export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

