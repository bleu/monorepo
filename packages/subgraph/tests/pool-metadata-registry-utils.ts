import { Bytes, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent } from "matchstick-as";

import { PoolMetadataUpdated } from "../src/types/PoolMetadataRegistry/PoolMetadataRegistry";

export function createPoolMetadataUpdatedEvent(
  poolId: Bytes,
  metadataCID: string
): PoolMetadataUpdated {
  const poolMetadataUpdatedEvent = changetype<PoolMetadataUpdated>(
    newMockEvent()
  );

  poolMetadataUpdatedEvent.parameters = [];

  poolMetadataUpdatedEvent.parameters.push(
    new ethereum.EventParam("poolId", ethereum.Value.fromFixedBytes(poolId))
  );
  poolMetadataUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataCID",
      ethereum.Value.fromString(metadataCID)
    )
  );

  return poolMetadataUpdatedEvent;
}
