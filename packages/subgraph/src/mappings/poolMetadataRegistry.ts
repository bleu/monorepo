import { PoolMetadataUpdated as PoolMetadataUpdatedEvent } from "../types/PoolMetadataRegistry/PoolMetadataRegistry";
import { PoolMetadataUpdate } from "../types/schema";

export function handlePoolMetadataUpdated(
  event: PoolMetadataUpdatedEvent
): void {
  const entity = new PoolMetadataUpdate(event.transaction.hash.toHexString());
  entity.poolId = event.params.poolId.toString();
  entity.metadataCID = event.params.metadataCID;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
