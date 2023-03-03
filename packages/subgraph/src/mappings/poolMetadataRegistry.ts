import { PoolMetadataUpdated as PoolMetadataUpdatedEvent } from "../types/PoolMetadataRegistry/PoolMetadataRegistry"

export function handlePoolMetadataUpdated(
  event: PoolMetadataUpdatedEvent
): void {
  // TODO: https://linear.app/bleu-llc/issue/BAL-36/create-mapping-for-handling-metadata-updates-events
  // const entity = new PoolMetadataUpdated(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // )
  // entity.poolId = event.params.poolId
  // entity.metadataCID = event.params.metadataCID

  // entity.blockNumber = event.block.number
  // entity.blockTimestamp = event.block.timestamp
  // entity.transactionHash = event.transaction.hash

  // entity.save()
}
