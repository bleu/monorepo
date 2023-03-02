import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes } from "@graphprotocol/graph-ts"
import { PoolMetadataUpdated } from "../generated/PoolMetadataRegistry/PoolMetadataRegistry"

export function createPoolMetadataUpdatedEvent(
  poolId: Bytes,
  metadataCID: string
): PoolMetadataUpdated {
  let poolMetadataUpdatedEvent = changetype<PoolMetadataUpdated>(newMockEvent())

  poolMetadataUpdatedEvent.parameters = new Array()

  poolMetadataUpdatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromFixedBytes(poolId))
  )
  poolMetadataUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataCID",
      ethereum.Value.fromString(metadataCID)
    )
  )

  return poolMetadataUpdatedEvent
}
