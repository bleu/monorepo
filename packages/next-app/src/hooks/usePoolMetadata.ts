import { useEffect, useState } from "react";
import useSWR from "swr";

import { PoolMetadataAttribute } from "#/contexts/PoolMetadataContext";
import { fetcher } from "#/lib/ipfs";
import metadataGql from "#/lib/poolMetadataGql";

function usePoolMetadata<T>(
  poolId: string,
  handleSetMetadata: any
): { data: unknown; updatedMetadataCID: string } {
  const { data: poolsData } = metadataGql.useMetadataPool({
    poolId,
  });

  const pool = poolsData?.pools[0];

  const [updatedMetadataCID, setUpdatedMetadataCID] = useState<string>("");

  const { data } = useSWR(
    pool?.metadataCID ? `https://ipfs.io/ipfs/${pool.metadataCID}` : null,
    fetcher
  );

  useEffect(() => {
    handleSetMetadata(data ? (data as PoolMetadataAttribute[]) : []);
  }, [data, pool?.metadataCID]);

  return { data, updatedMetadataCID, setUpdatedMetadataCID };
}

export default usePoolMetadata;
