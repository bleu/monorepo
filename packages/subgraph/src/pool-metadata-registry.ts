import { PoolMetadataUpdated as PoolMetadataUpdatedEvent } from "../generated/PoolMetadataRegistry/PoolMetadataRegistry"
import { PoolMetadataUpdated } from "../generated/schema"

export function handlePoolMetadataUpdated(
  event: PoolMetadataUpdatedEvent
): void {
  let entity = new PoolMetadataUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.poolId = event.params.poolId
  entity.metadataCID = event.params.metadataCID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
