import { PoolMetadataAttribute } from "#/contexts/AdminToolsContext";

export async function pinJSON(
  poolId: string,
  metadata: PoolMetadataAttribute[]
) {
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
