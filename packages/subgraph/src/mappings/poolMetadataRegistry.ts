import { getPoolAddress } from "../helpers";
import { PoolMetadataUpdated as PoolMetadataUpdatedEvent } from "../types/PoolMetadataRegistry/PoolMetadataRegistry";
import { Pool, PoolMetadataUpdate } from "../types/schema";

export function handlePoolMetadataUpdated(
  event: PoolMetadataUpdatedEvent
): void {
  const poolId = event.params.poolId.toHexString();

  let pool = Pool.load(poolId);
  if (pool == null) {
    pool = new Pool(poolId);
    pool.address = getPoolAddress(poolId);
  }
  pool.metadataCID = event.params.metadataCID;
  pool.latestUpdatedBy = event.params.sender;
  pool.save();

  const metadataUpdateId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  const metadataUpdate = new PoolMetadataUpdate(metadataUpdateId);
  metadataUpdate.pool = poolId;
  metadataUpdate.metadataCID = event.params.metadataCID;
  metadataUpdate.sender = event.params.sender;

  metadataUpdate.blockNumber = event.block.number;
  metadataUpdate.blockTimestamp = event.block.timestamp;
  metadataUpdate.transactionHash = event.transaction.hash;

  metadataUpdate.save();
}
